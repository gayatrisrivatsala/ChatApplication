const express = require('express');
const User = require('../models/userModel');
const { protect } = require("../middleware/authMiddleware");
const {accessChat, fetchChats , createGroupChat, renameGroup, removeFromGroup, addToGroup } = require("../controllers/chatControllers");
const router = express.Router();

//apis for chats are given below

router.route('/').post(protect, accessChat );
router.route('/').get(protect, fetchChats);


//groups api's are given below

router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;