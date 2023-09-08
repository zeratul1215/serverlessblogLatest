const express = require('express');
const followRouter = express.Router();

const { authMiddleware } = require("../middleWare/auth.middleWare");
const { follow, cancelFollow, getFollowerList, getFollowingList } = require('../controller/followController');

followRouter.post("/follow/:username",authMiddleware,follow);
followRouter.delete("/unfollow/:username",authMiddleware,cancelFollow);
followRouter.get("/follower/:page",authMiddleware,getFollowerList);
followRouter.get("/following/:page",authMiddleware,getFollowingList);

module.exports = followRouter;