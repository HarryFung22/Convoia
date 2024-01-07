const asyncHandler = require('express-async-handler');
const Message = require('../models/message');
const User = require('../models/user');
const Chat = require('../models/chat')

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatID } = req.body;

    if (!content || !chatID) {
        res.status(400);
        throw new Error("Invalid request body");
    }

    var msg = {
        sender: req.user._id,
        content: content,
        chat: chatID,
    };

    try {
        var message = await Message.create(msg);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatID, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
    });

const allMessages = asyncHandler(async (req, res) => {
    try{
        const messages = await Message.find({chat: req.params.chatID})
            .populate("sender", "name email pic")
            .populate("chat");
        res.json(messages);
    }catch(error){
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = {
    sendMessage,
    allMessages
}