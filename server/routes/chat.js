const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chat')
const { verify } = require('../middleware/auth');

const router = express.Router();

//chat
router.post('/', verify, accessChat);
router.get('/', verify, fetchChats);

//group
router.post('/group', verify, createGroupChat);
router.put('/rename', verify, renameGroup);
router.put('/remove', verify, removeFromGroup);
router.put('/add', verify, addToGroup);

module.exports = router