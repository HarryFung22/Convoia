const express = require('express');
const { sendMessage } = require('../controllers/message')
const { verify } = require('../middleware/auth');

const router = express.Router();

//auth
// router.get('/:chatId', verify, allMessages);
router.post('/', verify, sendMessage);

module.exports = router;