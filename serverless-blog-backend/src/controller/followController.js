const HttpException = require("../exception/http.exception");
const Follow = require("../models/follow");
const User = require("../models/user");

module.exports.follow = async (req,res,next) => {
    try{
        //get the followed username
        const followedUsername = req.params.username;

        //verify the followed user exists
        let followedUser = await User.findAll({
            where:{
                username:followedUsername
            }
        });

        if(!followedUser){
            return next(new HttpException(402,"user not found"));
        }

        const followedUserEmail = followedUser[0].dataValues.email;
        
        const followerUserEmail = req.body.user.email;

        if(followerUserEmail == followedUserEmail){
            return next(new HttpException(405,"you can't follow yourself"));
        }

        //no need to verify whether the user has already followed this one

        await Follow.create({
            userEmail:followedUserEmail,
            followerEmail:followerUserEmail
        });

        res.json({
            message:"ok"
        })
    }
    catch(error){
        next(error);
    }
}

module.exports.cancelFollow = async (req,res,next) => {
    try{
        //get the followed username
        const followedUsername = req.params.username;

        //verify the followed user exists
        let followedUser = await User.findAll({
            where:{
                username:followedUsername
            }
        });

        if(!followedUser){
            return next(new HttpException(402,"user not found"));
        }

        const followedUserEmail = followedUser[0].dataValues.email;
        
        const followerUserEmail = req.body.user.email;

        await Follow.destroy({
            where:{
                userEmail:followedUserEmail,
                followerEmail:followerUserEmail
            }
        });

        res.json({
            message:"ok"
        });
    }
    catch(error){
        next(error);
    }
}

module.exports.getFollowerList = async(req,res,next) => {
    try{
        const {email} = req.body.user;

        const page = req.params.page;

        if(page < 1){
            return next(new HttpException(401,"param error"))
        }

        let offset = (page - 1)*20

        let user = await User.findByPk(email);

        if(!user){
            return next(new HttpException(402,"user not found"));
        }

        let followerList = await Follow.findAll({
            limit:20,
            offset,
            where:{
                userEmail:email
            }
        });

        let data = [];
        for(let i = 0 ; i < followerList.length ; i++){
            let tempEmail = followerList[i].dataValues.followerEmail;
            let follower = await User.findByPk(tempEmail);
            if(!follower){
                continue;
            }
            data.push({
                username:follower.dataValues.username,
                avatar:follower.dataValues.avatar
            });
        }
        
        res.json({
            data,
            message:"ok"
        });
        
    }
    catch(error){
        next(error);
    }
}

module.exports.getFollowingList = async (req,res,next) => {
    try{
        const {email} = req.body.user;

        const page = req.params.page;

        if(page < 1){
            return next(new HttpException(401,"param error"))
        }

        let offset = (page - 1)*20

        let user = await User.findByPk(email);

        if(!user){
            return next(new HttpException(402,"user not found"));
        }

        let followingList = await Follow.findAll({
            limit:20,
            offset,
            where:{
                followerEmail:email
            }
        });

        //console.log(followingList);


        let data = [];
        for(let i = 0 ; i < followingList.length ; i++){
            let tempEmail = followingList[i].dataValues.userEmail;
            let followed = await User.findByPk(tempEmail);
            if(!followed){
                continue;
            }
            data.push({
                username:followed.dataValues.username,
                avatar:followed.dataValues.avatar
            });
        }

        res.json({
            data,
            message:"ok"
        });
    }
    catch(error){
        next(error);
    }
}