const express = require("express");
const { getAllTags, addTags } = require("../controller/tagController");
const { authMiddleware } = require("../middleWare/auth.middleWare");


const tagRouter = express.Router();
tagRouter.get("/allTags",getAllTags);
tagRouter.post("/addTag",authMiddleware,addTags);

module.exports = tagRouter;