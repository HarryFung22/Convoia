const express = require('express');
const { sendMessage, allMessages } = require('../controllers/message')
const { verify } = require('../middleware/auth');

const router = express.Router();

//auth
router.get('/:chatID', verify, allMessages);
router.post('/', verify, sendMessage);

module.exports = router;