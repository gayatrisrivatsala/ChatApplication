const mongoose = require("mongoose");

const chatModel = new mongoose.Schema(
  {
    // The name of the chat
    chatName: {
      type: String,
      required: true, // You can add "required: true" if the name is mandatory
    },

    // Boolean indicating if the chat is a group chat
    isGroupchat: {
      type: Boolean,
      default: false, // Default value is false, meaning it's not a group chat by default
    },

    // Array of users that are part of this chat
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, // You can add "required: true" to ensure at least one user exists
      },
    ],

    // Latest message in the chat, referenced by its ObjectId
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    // The admin of the group chat (if it's a group chat)
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Exporting the model to use it in other files
const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;
