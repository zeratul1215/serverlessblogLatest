const HttpException = require("../exception/http.exception");
const Tag = require("../models/tag");

//get all tags
//add tag

module.exports.getAllTags = async(req,res,next) => {
    try{
        let data = Tag.findAll();
        res.json({
            data,
            message:"ok"
        });
    }
    catch(error){
        next(error);
    }
}

module.exports.addTags = async(req,res,next) => {
    try{
        let username = req.body.user.username;
        if(username != "admin"){
            return next(new HttpException(402,"not admin user"));
        }
        let tag = req.body.tag;
        let existingTag = await Tag.findByPk(tag);
        if(existingTag){
            return next(new HttpException(405,"tag already exists"));
        }
        await Tag.create({
            name:tag
        });

        res.json({
            message:"ok"
        });
    }
    catch(error){
        next(error);
    }
}

