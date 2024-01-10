const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const messageRoutes = require('./routes/message');
const {notFound, errorHandler} = require('./middleware/error')

require('dotenv').config();

const app = express();
const port = process.env.PORT;
const uri = process.env.ATLAS_URI;
const userAPI = process.env.API_USER;
const chatAPI = process.env.API_CHAT;
const messageAPI = process.env.API_MESSAGE;

app.use(express.json());
app.use(cors());

mongoose.connect(uri).then(() => {
    console.log(`MongoDB Connection Established. Listening on port: ${port}`)
}).catch((error) => {console.log(error)})

app.use(userAPI, userRoutes);
app.use(chatAPI, chatRoutes);
app.use(messageAPI, messageRoutes);

// error handling
app.use(notFound);
app.use(errorHandler);


const server = app.listen(port, console.log(`Server connection established. Listening on port: ${port}`));
const io = require('socket.io')(server, {
    //inactivity, close connection
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on("connection", (socket) => {
    console.log("Socket Connection established")

    socket.on('setup', (user) => {
        socket.join(user._id);
        socket.emit('connected')
    })

    //setup room with chat id
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    
    socket.on("new message", (newMessageRecieved) => {
        //chatID
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
        //if sent by current user, return
        if (user._id == newMessageRecieved.sender._id) return;
    
        //inside that users room, emits/sends msg
        socket.in(user._id).emit("message received", newMessageRecieved);
        });
    });
    
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})