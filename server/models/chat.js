const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

//user + latestMsg, ref db for particular id to retrieve
const chatSchema = new Schema({
    chatName: {
        type: String,
        trim: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    latestMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;