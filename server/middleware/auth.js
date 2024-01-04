const jwt = require('jsonwebtoken');        
const User = require('../models/user');
const asyncHandler = require('express-async-handler');


const verify = asyncHandler(async (req, res, next) => {
    let token;
  
    //get token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
  
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
  
        //return without password
        req.user = await User.findById(decoded._id).select("-password");
  
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }
  
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });
  
module.exports = { verify };