const express = require('express')
const router = express.Router();
const UserController = require('../controllers/user.controller');

//Sign up method for the user
router.post('/signup', UserController.CreateUser);

//Login flow
router.post('/login', UserController.LoginUser);

module.exports = router;