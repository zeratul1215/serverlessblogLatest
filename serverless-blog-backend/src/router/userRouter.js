const express = require('express');
const { userLogin, getAuthorInfo, createUser, getUser, updateUserInfo, updatePassword } = require('../controller/userController');
const userRouter = express.Router();
const { authMiddleware } = require("../middleWare/auth.middleWare");

userRouter.post('/login',authMiddleware,userLogin);
userRouter.post('/create',createUser);
userRouter.get('/getUser',authMiddleware,getUser);
userRouter.patch('/update',updateUserInfo);
userRouter.patch('/changePassword',updatePassword);
userRouter.get('/getAuthorInfo/:email',getAuthorInfo);
//userRouter.get('/getLiked',authMiddleware,getLiked);

module.exports = userRouter;