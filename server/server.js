const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chat')
const {notFound, errorHandler} = require('./middleware/error')

require('dotenv').config();

const app = express();
const port = process.env.PORT;
const uri = process.env.ATLAS_URI;
const userAPI = process.env.API_USER;
const chatAPI = process.env.API_CHAT;

app.use(express.json());
app.use(cors());

mongoose.connect(uri).then(() => {
    app.listen(port, () => console.log(`MongoDB Connection Established. Listening on port: ${port}`))
}).catch((error) => {console.log(error)})

app.use(userAPI, userRoutes);
app.use(chatAPI, chatRoutes);

// error handling
app.use(notFound);
app.use(errorHandler);