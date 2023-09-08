const express = require('express');
const { authMiddleware } = require('../middleWare/auth.middleWare');
const { createComment, getArticleComment, getUserComment, deleteComment } = require('../controller/commentController');
const commentRouter = express.Router();

commentRouter.post("/makeComment/:slug",authMiddleware,createComment);
commentRouter.delete("/deleteComment/:slug",authMiddleware,deleteComment);
commentRouter.get("/getArticleComment/:slug/:page",getArticleComment);
commentRouter.get("/getUserComment/:page",authMiddleware,getUserComment);
//for getting the user's own comments

module.exports = commentRouter;