const express = require('express');
const { signUp, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const userRouter = express.Router()

userRouter.post('/signup',signUp);
userRouter.post('/login',login);
userRouter.get('/me',authMiddleware,getMe);


module.exports = userRouter