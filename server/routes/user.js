const express = require('express');
const { registerUser, authUser, allUsers } = require('../controllers/user')

const router = express.Router();

//auth
router.post('/', registerUser);
router.post('/login', authUser);

//search
router.get('/', allUsers);

module.exports = router