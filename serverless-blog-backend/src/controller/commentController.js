const HttpException = require("../exception/http.exception");
const Article = require("../models/article");
const Comment = require("../models/comment");
const User = require("../models/user");
const slug = require("slug");

module.exports.createComment = async(req,res,next) => {//params:slug(for article)
    try{
        const {email} = req.body.user;

        let user = await User.findByPk(email);
        if(!user){
            return next(new HttpException(402,"user not found"));
        }
    
        if(!req.body.comment){
            return next(new HttpException(402,"no comments sent"));
        }
        const {commentBody} = req.body.comment;

        let articleSlug = req.params.slug;
        let article = await Article.findByPk(articleSlug);
        if(!article){
            return next(new HttpException(402,"article not found"));
        }
    
        let commentSlug = slug(user.dataValues.username + " " + articleSlug + " " + Math.floor(Math.random()*100000),'_');

        let comment = await Comment.create({
            slug:commentSlug,
            body:commentBody
        });

        await comment.setUser(user);
        await comment.setArticle(article);

        res.json({
            message:"ok"
        });
    }
    catch(error){
        next(error);
    }
}

module.exports.deleteComment = async(req,res,next) => {//params:slug(for comment)
    try{
        const {email} = req.body.user;

        let user = await User.findByPk(email);
        if(!user){
            return next(new HttpException(402,"user not found"));
        }

        //console.log(user);

        const commentSlug = req.params.slug;

        let comment = await Comment.findByPk(commentSlug);
        
        //console.log(comment);

        let commenter = await comment.getUser();

        if(commenter.dataValues.email != email && commenter.username != "admin"){
            return next(new HttpException(402,"can't delete other people's article"));
        }

        await Comment.destroy({
            where:{
                slug:commentSlug
            }
        });

        res.json({
            message:'ok'
        })
    }
    catch(error){
        next(error);
    }
}

module.exports.getArticleComment = async(req,res,next) => {//params:slug(for article),page
    try{
        const articleSlug = req.params.slug;
        
        let article = await Article.findByPk(articleSlug);

        if(!article){
            return next(new HtAtpException(402,"article not found"));
        }

        const page = req.params.page;
        if(page < 1){
            return next(new HttpException(401,"params error"));
        }

        let offset = (page - 1)*20;

        let comments = await article.getComments({
            limit:20,
            offset,
            order: [['createdAt','DESC']]
        })

        let data = [];

        for(let i = 0 ; i < comments.length ; i++){
            let commenter = await comments[i].getUser();
            data.push({
                slug: comments[i].dataValues.slug,
                body: comments[i].dataValues.body,
                commenterEmail: commenter.dataValues.email,
                commenterName: commenter.dataValues.username,
                commenterAvatar: commenter.dataValues.avatar
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

module.exports.getUserComment = async (req,res,next) => {//params: page
    try{
        const {email} = req.body.user;
        let user = await User.findByPk(email);
        if(!user){
            return next(new HttpException(402,"user not found"));
        }

        const page = req.params.page;
        if(page < 1){
            return next(new HttpException(401,"params error"));
        }
        let offset = (page - 1)*20;

        let comments = await user.getComments({
            limit: 20,
            offset,
            order: [['createdAt','DESC']]
        });

        let data = [];

        for(let i = 0 ; i < comments.length ; i++){
            let article = await comments[i].getArticle();
            data.push({
                slug: comments[i].dataValues.slug,
                body: comments[i].dataValues.body,
                articleSlug: article.dataValues.slug,
                articleTitle: article.dataValues.title,
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

