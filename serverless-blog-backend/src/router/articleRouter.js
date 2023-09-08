const express = require('express');
const { getLatestArticle, createArticle, getArticleContent, getArticleByKey, deleteArticle, likeArticle, unlikeArtile, getLikers, getLiked, getArticleByAuthor } = require('../controller/articleController');
const { authMiddleware } = require('../middleWare/auth.middleWare');
const articleRouter = express.Router();

articleRouter.get("/getLatestArticle/:page",getLatestArticle);
articleRouter.post("/createArticle",authMiddleware,createArticle);
articleRouter.get("/getArticleContent/:slug",getArticleContent);
articleRouter.get("/searchArticle/:keyword/:page",getArticleByKey);
articleRouter.get("/getAuthorArticle/:authorEmail/:page",getArticleByAuthor);
articleRouter.delete("/deleteArticle/:slug",authMiddleware,deleteArticle);
articleRouter.patch("/likeArticle/:slug",authMiddleware,likeArticle);
articleRouter.patch("/unlikeArticle/:slug",authMiddleware,unlikeArtile);
articleRouter.get("/getLikers/:slug/:page",authMiddleware,getLikers);
articleRouter.get("/getLiked/:page",authMiddleware,getLiked);

module.exports = articleRouter;