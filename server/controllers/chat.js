const asyncHandler = require('express-async-handler');
const User = require("../models/user");
const Chat = require('../models/chat');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//individual chat, not group
const accessChat = asyncHandler(async (req, res) => {
    const { userID } = req.body;
    if (!userID){
        res.status(400);
        throw new Error("No ID was found");
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: {$elemMatch: {$eq: req.user._id}}},
            { users: {$elemMatch: {$eq: userID}}},
        ]
    //ref id inside of those fields to populate by querying that particular collection for that id
    }).populate("users", "-password").populate("latestMessage");

    //populate sender field from msg model (nested populating, latestMessage attr for user, but has message object with field sender)
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name picture email",
    });

    if (isChat.length > 0){
        //one chat between two users, return 0th index
        res.send(isChat[0]);
    }else{
        //create new chat between 
        var chat = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userID]
        }

        try {
            const createdChat = await Chat.create(chat);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
              "users",
              "-password"
            );
            res.status(200).json(FullChat);
          } catch (error) {
            res.status(400);
            throw new Error(error.message);
          }
    }
});

//fetch chat for individual user
const fetchChats = asyncHandler(async (req, res) => {
    //populate ref user id to refer to specified user, populates data accordingly
    try{
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({updatedAt: -1}).then( async (response) => {
                response = await User.populate(response, {
                    path: "latestMessage.sender",
                    select: "name picture email"
                })

                res.status(200).send(response)
            })
    }catch(error){
        res.status(400);
        throw new Error(error.message)
    }
})

//create group chat
const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Some fields are missing. Please try again" });
    }

    //convert back to arr (stringified on fe, parsed on be)
    var users = JSON.parse(req.body.users);

    if (users.length < 2){
        return res.status(400).send({message: "Invalid # of people, cannot form group chat."})
    }

    //add logged in user
    users.push(req.user)
    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        const data = await Chat.findOne({_id: groupChat._id})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(data)
    }catch(error){
        res.status(400);
        throw new Error(error.message)
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const {chatID, chatName} = req.body;

    const chat = await Chat.findByIdAndUpdate(chatID, {chatName}, {new: true})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!chat){
        res.status(404);
        throw new Error("Group Chat not found")
    }else res.status(200).json(chat)
})

const removeFromGroup = asyncHandler(async (req, res) => {
    const {chatID, userID} = req.body;

    const chat = await Chat.findByIdAndUpdate(chatID, {$pull: {users: userID}}, {new: true})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!chat){
        res.status(404);
        throw new Error("Group Chat not found")
    }else res.status(200).json(chat)
})

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const chat = await Chat.findByIdAndUpdate(
        chatId,
        {
        $push: { users: userId },
        },
        {
        new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!chat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).json(chat);
    }
})

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup
}