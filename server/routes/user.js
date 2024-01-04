const express = require('express');
const { registerUser, authUser, allUsers } = require('../controllers/user')
const { verify } = require('../middleware/auth');

const router = express.Router();

//auth
router.post('/', registerUser);
router.post('/login', authUser);

//search
router.get('/', verify, allUsers);

module.exports = router