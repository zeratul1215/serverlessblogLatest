const HttpException = require('../exception/http.exception');
const { validateUserLogin, validateCreateUser } = require('../util/dataValidate/user.validate');
const User = require("../models/user");
const { matchOldPassword, md5Password } = require('../util/encryption');
const { sign } = require('../util/jwt');
const AWS = require("aws-sdk");
const { param } = require('../router/userRouter');

AWS.config.update({
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETKEY,
    region: process.env.REGION
});

//401 for the request message format error
//402 for the user information error

module.exports.userLogin = async(req,res,next) => {
    try{
        //get the information from the http request
        let {email,password} = req.body.user;

        if(req.body.usingToken){
            let user = await User.findByPk(email);
            if(!user){
                return next(new HttpException(402,"user not found"));
            }
            else{
                user.dataValues.token = await sign(user.dataValues.username,user.dataValues.email);
                res.json({
                    data:user.dataValues,
                    message:"login success"
                });
                return;
            }
        }

        //validate the user information format
        let {error,validateResult} = validateUserLogin(email,password);


        if(!validateResult){
            if(error.emailCode == 1){
                next(new HttpException(401,error.email));
                return;
            }
            else if(error.passwordCode == 1){
                next(new HttpException(401,error.password));
                return;
            }
            return;
        }
        
        //verify the user exists
        const user = await User.findByPk(email);

        if(!user){
            next(new HttpException(402,"user not registered yet"));
            return;
        }

        //verify the password
        const storedPassword = user.dataValues.password;

        const matchResult = matchOldPassword(password,storedPassword);

        if(!matchResult){
            next(new HttpException(402,"wrong password"));
            return;
        }

        //send the token
        delete user.dataValues.password;
        user.dataValues.token = await sign(user.dataValues.username,user.dataValues.email);

        res.json({
            data:user.dataValues,
            message:"login success"
        });
    }
    catch(error){
        next(error);
    }
    
}

module.exports.createUser = async(req,res,next) => {
    try{
        
        //console.log(req.body);
        //get the information from the http request
        let {email,username,password} = req.body.user;

        let avatar = null;
        let bio = null;

        if(req.body.user.avatar){
            avatar = req.body.user.avatar;
        }
        if(req.body.user.bio){
            bio = req.body.user.bio;
        }

        //verify the user information format
        let {error,validateResult} = validateCreateUser(username,email,password);

        if(!validateResult){
            if(error.emailCode == 1){
                next(new HttpException(401,error.email));
                return;
            }
            else if(error.passwordCode == 1){
                next(new HttpException(401,error.password));
                return;
            }
            else if(error.usernameCode == 1){
                next(new HttpException(401,error.username));
                return;
            }
            return;
        }

        //verify the email has not been registered
        const user = await User.findByPk(email);

        if(user){
            next(new HttpException(402,"email has already been registered"));
            return;
        }

        //verify the username has not been used
        const sameUsername = await User.findAll({
            where:{
                username
            }
        });

        if(sameUsername.length > 0){
            next(new HttpException(402,"username has already been used"));
            return;
        }

        //encrypt the password
        let encrypted = await md5Password(password);

        let objectURL = "null";

        const createUser = new Promise((resolve,reject)=> {
            if(avatar){
                folder = email;
                const s3 = new AWS.S3({ region: process.env.REGION });
                
                let body = avatar.base64;
                let byte = Buffer.from(body,'base64');
    
                let format = avatar.format.split(";")[0].split(":")[1];
                
    
                let suffix = '.'+format.split("/")[1];
    
                
                let objectURL = null;
                let s3Params = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: folder + '/' + 'avatar' + suffix,
                    Body:byte,
                    ACL:'public-read'
                }
    
    
                s3.upload(s3Params,(err,data) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(data.Location);
                    }
                
                });
            }
            else{
                resolve(null);
            }
        }).then(async data => {
            const newUser = await User.create({
                email,
                username,
                password:encrypted,
                avatar:data,
                bio
            });
            delete newUser.dataValues.password;
            newUser.dataValues.token = await sign(newUser.dataValues.username,newUser.dataValues.email);

            res.status(200).json({
                data:newUser.dataValues,
                message:"create successful"
            });
        }).catch(err => {
            throw err;
        });
    }
    catch(error){
        next(error);
    }
}

module.exports.getAuthorInfo = async(req,res,next) => {
    try{
        let email = req.params.email;

        let user = await User.findByPk(email);
        if(!user){
            next(new HttpException(402,"author's account has been deleted));
        }
    }
    catch(error){
        next(error);
    }
}

module.exports.getUser = async(req,res,next) => {
    try{
        let {email} = req.body.user;

        //console.log(email);

        let user = await User.findByPk(email);

        if(!user){
            next(new HttpException(402,"user not found"));
        }

        delete user.dataValues.password;
        user.dataValues.token = await sign(user.dataValues.username,email);
        
        res.json({
            data:user.dataValues,
            message:"ok"
        })
    }
    catch(error){
        next(error)
    }
}

module.exports.updateUserInfo = async(req,res,next) => {
    try{
        //get email
        let {email} = req.body.user;

        //verify the existence of the email
        let user = await User.findByPk(email);
        if(!user){
            next(new HttpException(402,"user not found")); 
            return;
        }

        //update user data
        let bodyUser = req.body.user;
        if(bodyUser){
            //verify whether the info are in the body

            if(bodyUser.username){
                let user = await User.findAll({
                    where:{
                        username:bodyUser.username
                    }
                });
                if(user){
                    next(new HttpException(402,"username already been taken"));
                    return;
                }
            }

            let username = bodyUser.username ? bodyUser.username : user.dataValues.username;
            let avatar = bodyUser.avatar ? bodyUser.avatar : user.dataValues.avatar;
            let bio = bodyUser.bio ? bodyUser.bio : user.dataValues.bio;
            let password = user.dataValues.password; 
            
            await User.update({
                username,
                avatar,
                bio,
                password
            },{
                where:{
                    email
                }
            });

            res.json({
                message:"updated"
            });
        }
        else{
            next(new HttpException(401,"update info is null"));
        }
    }   
    catch(error){
        next(error);
    }
    
}

module.exports.updatePassword = async(req,res,next) => {
    try{
        let {email,originalPassword,newPassword} = req.body.user;

        //verify email exists
        let user = await User.findByPk(email);

        if(!user){
            next(new HttpException(402,"user not found"));
            return;
        }
        
        //get the original password
        let password = user.dataValues.password;

        if(!await matchOldPassword(originalPassword,password)){
            next(new HttpException(402,"wrong password"));
            return;
        }

        let encrypted = await md5Password(newPassword);


        
        await User.update({
                password:encrypted
            },{
                where:{
                    email
                }
            }
        );
        
        res.json({
            message:"updated"
        });
    }
    catch(error){
        next(error);
    }
}

