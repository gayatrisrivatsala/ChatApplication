const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");


//note all chats are stored in the chat collection in the database. irrespective of whether it is a group chat or a one-on-one chat. The isGroupchat field is used to differentiate between the two types of chats.


//notes: Access chat API
const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body; // The ID of the other user to create or find a chat with

  if (!userId) {
    console.log("User Id is required");
    return res.status(400).json({ error: "User Id is required" });
  }

  try {
    // Check if chat already exists
    let isChat = await Chat.find({
      isGroupchat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } }, // Authenticated user's ID
        { users: { $elemMatch: { $eq: userId } } }, // Provided user ID
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name picture email",
    });

    if (isChat.length > 0) {
      // Chat already exists
      return res.status(200).send(isChat[0]);
    }

    // Create a new chat if it doesn't exist
    const chatData = {
      chatName: "sender", // Default name for one-on-one chat
      isGroupchat: false,
      users: [req.user._id, userId], // Use req.user._id (authenticated user) instead of req.userId
    };

    const createdChat = await Chat.create(chatData);

    const fullChat = await Chat.findOne({ _id: createdChat._id })
      .populate("users", "-password")
      .populate("latestMessage");

    return res.status(200).send(fullChat);
  } catch (err) {
    console.error("Error creating chat:", err.message);
    return res
      .status(400)
      .json({ error: "Chat cannot be created", details: err.message });
  }
});


//notes: Fetch chats API
const fetchChats = expressAsyncHandler(async (req, res) => {
  try{
    const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results= await User.populate(results, {
        path: "latestMessage.sender",
        select: "name picture email",
      });

      res.status(200).send(results);
    });
  }
  catch(err){
    res.status(400).json({ error: "Chats cannot be fetched", details: err.message });
  }
});


//notes: Creating group 
const createGroupChat = expressAsyncHandler(async (req, res) => {
    if(!req.body.users || !req.body.name){
      return res.status(400).json({ error: "all fields are required" });
    }

    var users = JSON.parse(req.body.users);
    if(users.length < 2){
      return res.status(400).json({ error: "Group chat must have more than 2 users" });
    }

    users.push(req.user);
    try{
        const groupChat = await Chat.create({
          chatName: req.body.name,
          users: users,
          isGroupchat: true,  
          groupAdmin: req.user,
        });

      const fullGroupChat =await Chat.findOne({_id:groupChat._id})
      .populate("users", "-password") 
      .populate("groupAdmin", "-password");
      res.status(200).json(fullGroupChat);
    }
    catch(err){
      res.status(400).json({ error: "Group chat cannot be created", details: err.message });
    }
 
}); 


//notes: Renaming a  group tht already exist 
const renameGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName
    },
    { 
      new: true
    }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password")

  if(!updatedChat){
    throw new Error("Chat not found");
  }
  else{
    res.status(200).json(updatedChat);
  }
});


//notes: Adding a user to an existing group chat
const addToGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added =await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId }
    },
    {
      new: true
    }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password")

  if(!added){
    throw new Error("User not added to group");
  }
  else{
    res.status(200).json(added);
  }
});


//notes: Removing a user from an existing group chat
const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    throw new Error("User not removed to group");
  } else {
    res.status(200).json(removed);
  }
});


module.exports = { accessChat , fetchChats, createGroupChat , renameGroup , addToGroup , removeFromGroup };
