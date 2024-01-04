const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET_KEY, {expiresIn: '3d'});
};

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, picture} = req.body;

    if (!name || !email || !password){
        res.status(400);
        throw new Error("Please fill in all fields");
    }

    const alreadyExists = await User.findOne({email});

    if (alreadyExists){
        res.status(400);
        throw new Error("Email already exists. Please try again");
    }

    //generate user
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await User.create({name, email, password: hash, picture})

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: createToken(user._id),
        })
    }else{
        res.status(400);
        throw new Error("Failed to create user. Please try again");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    const match = await bcrypt.compare(password, user.password);
    
    if (user && match){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: createToken(user._id),
        })
    }else {
        res.status(400);
        throw new Error("Invalid Credentials. Please try again");
    }
});

const allUsers = asyncHandler(async(req, res) => {
    //get user and search from query
    const keyword = req.query.search
    ? {
        //filter db by keyword (whether that is name or email passed into params), option for case sensitivity
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

    //return users who are not equal to current user ($ne)
    const users = await User.find(keyword)
    //.find({_id: {$ne: req.body.user._id}});

    res.send(users);
})

module.exports = {
    registerUser,
    authUser,
    allUsers,
}