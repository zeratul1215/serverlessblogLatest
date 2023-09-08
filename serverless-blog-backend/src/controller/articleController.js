const HttpException = require("../exception/http.exception");
const Article = require("../models/article");
const User = require("../models/user");
const Tag = require("../models/tag");
const slug = require("slug");
const AWS = require("aws-sdk");
const {Op} = require("sequelize");

AWS.config.update({
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETKEY,
    region: process.env.REGION
});

//give the newest released 20 articles
module.exports.getLatestArticle = async(req,res,next)=>{
    try{
        const page = req.params.page;
        if(page < 1){
            return next(new HttpException(401,"param error"));
        }
        let offset = (page - 1)*20;
        let firstTwenty = await Article.findAll({
            order: [['createdAt','DESC']],
            limit:20,
            offset
        });
        //console.log(firstTwenty);
        let data = [];
        //console.log(firstTwenty[0].dataValues);
        for(let i = 0 ; i < firstTwenty.length ; i++){
            let currArticle = firstTwenty[i];
            //console.log(currArticle.dataValues);
            let author = await currArticle.getUser();
            if(!author){
                continue;
            }
            let articleTags = await currArticle.getTags();
            let tags = [];
            for(let j = 0 ; j < articleTags.length ; j++){
                tags.push(articleTags[j].name);
            }
            //console.log(articleTags);
            data.push({
                slug:currArticle.dataValues.slug,
                title: currArticle.dataValues.title,
                description: currArticle.dataValues.description,
                tags,
                authorEmail: author.dataValues.email,
                authorName:author.dataValues.username,
                authorAvatar:author.dataValues.avatar
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

//return article by the keyword
module.exports.getArticleByKey = async (req,res,next) => {
    try{
        let keyword = req.params.keyword;
        let page = req.params.page;
        let keywords = keyword.split(" ");
        
        if(page < 1){
            return next(new HttpException(401,"param error"));
        }

        let offset = (page - 1)*20;

        const whereCondition = {
            [Op.and]: keywords.map(key => ({title : {[Op.like]: `%${key}%`}}))
        };
        
        let articles = await Article.findAll({
            where:whereCondition,
            limit:20,
            offset
        })

        let data = [];

        for(let i = 0 ; i < articles.length ; i++){
            let currArticle = articles[i];
            let articleTags = await currArticle.getTags();
            let tags = [];
            for(let j = 0 ; j < articleTags.length ; j++){
                tags.push(articleTags[j].name);
            }
            //console.log(articleTags);
            data.push({
                slug:currArticle.dataValues.slug,
                title: currArticle.dataValues.title,
                description: currArticle.dataValues.description,
                tags
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

module.exports.getArticleByAuthor = async(req,res,next) => {
    try{
        let authorEmail = req.params.authorEmail;

        let page = req.params.page;

        let offset = (page - 1) * 20;
        let user = await User.findByPk(authorEmail);

        if(!user){
            return next(402,"user not found");
        }

        let articles = await user.getArticles({
            limit:20,
            offset
        });

        let data = [];

        for(let i = 0 ; i < articles.length ; i++){
            let currArticle = articles[i];
            let articleTags = await currArticle.getTags();
            let tags = [];
            for(let j = 0 ; j < articleTags.length ; j++){
                tags.push(articleTags[j].name);
            }
            //console.log(articleTags);
            data.push({
                slug:currArticle.dataValues.slug,
                title: currArticle.dataValues.title,
                description: currArticle.dataValues.description,
                tags
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


//create article, has to login
module.exports.createArticle = async(req,res,next) => {
    try{
        let {email} = req.body.user;
        let user = await User.findByPk(email);
        if(!user){
            return next(new HttpException(402,"user not found"));
        }

        let {articleName,description,body,tags} = req.body.Article;

        let articleSlug = slug(articleName + " " + Math.floor(Math.random()*100000),'_');

        let existingArticle = await Article.findByPk(articleSlug);

        while(existingArticle){
            articleSlug = slug(articleName + " " + Math.floor(Math.random()*100000),'_');
            existingArticle = await Article.findByPk(articleSlug);
        }

        const s3 = new AWS.S3({ region: process.env.REGION });

        let s3Params = {
            Bucket: process.env.BUCKET_NAME,
            Key: articleSlug,
            Body:body,
            ACL:'public-read'
        }

        await s3.upload(s3Params,(err,data)=>{
            if(err){
                return next(new HttpException(500,"upload failed"));
            }
        });

        const URLparams = {
            Bucket: process.env.BUCKET_NAME,
            Key: articleSlug
        };

        const objectURL = "https://" + process.env.BUCKET_NAME + ".s3.amazonaws.com/" + articleSlug

        console.log(objectURL);

        const article = await Article.create({
            slug:articleSlug,
            title:articleName,
            description,
            s3URL:objectURL
        });

        await article.setUser(user);

        for(let i = 0 ; i < tags.length ; i++){
            let tag = await Tag.findByPk(tags[i]);
            await article.addTag(tag);
        }

        res.json({
            message:"ok"
        });
    }
    catch(error){
        next(error);
    }
}

module.exports.deleteArticle = async (req,res,next) => {
    try{
        let {email} = req.body.user;

        let user = await User.findByPk(email);
    
        if(!user){
            return next(new HttpException(402,"user not found"));
        }

        let slug = req.params.slug;

        let article = await Article.findByPk(slug);

        let author = await article.getUser();

        if(author.dataValues.email != email && user.dataValues.username != "admin"){
            return next(new HttpException(402,"can't delete other people's article"));
        }

        await Article.destroy({
            where:{
                slug
            }
        });

        res.json({
            message:"ok"
        });
    }
    catch(err){
        next(err);
    }
}

//return the article by the slug, used when the link to the article is clicked on the web page
module.exports.getArticleContent = async (req,res,next) => {
    try{
        let slug = req.params.slug;

        let article = await Article.findByPk(slug);
        
        if(!article){
            return next(new HttpException(402,"article not found"));
        }

        res.json({
            data:{
                title: article.dataValues.title,
                author: article.dataValues.UserEmail,
                s3_URL: article.dataValues.s3URL
            },
            message:"ok"
        })
        
    }   
    catch(error){
        next(error);
    }
}



module.exports.likeArticle = async (req,res,next) => {
    try{
        let {email} = req.body.user;
        
        let user = await User.findByPk(email);
        if(!user){
            return next(new HttpException(402,"user not found"));
        }

        let slug = req.params.slug;

        let article = await Article.findByPk(slug);
        if(!article){
            return next(new HttpException(402,"article not found"));
        }

        if(article.dataValues.UserEmail == email){
            return next(new HttpException(405,"you can't like your own article"));
        }

        await user.addLiked(article);

        res.json({
            message:"ok"
        });
    }
    catch(error){
        next(error);
    }
}

module.exports.unlikeArtile = async (req,res,next) => {
    try{
        let {email} = req.body.user;
        
        let user = await User.findByPk(email);
        if(!user){
            return next(new HttpException(402,"user not found"));
        }

        let slug = req.params.slug;

        let article = await Article.findByPk(slug);
        if(!article){
            return next(new HttpException(402,"article not found"));
        }

        await user.removeLiked(article);

        res.json({
            message:"ok"
        });
    }
    catch(error){
        next(error);
    }
}

module.exports.getLikers = async(req,res,next) => {
    try{
        const {email} = req.body.user;

        let user = await User.findByPk(email);
        if(!user){
            return next(new HttpException(402,"user not found"));
        }
        

        let page = req.params.page;
        if(page < 1){
            return next(new HttpException(401,"param error"));
        }
        let offset = (page - 1)*40;


        let slug = req.params.slug;

        let article = await Article.findByPk(slug);
        if(!article){
            return next(new HttpException(402,"article not found"));
        }

        if(article.dataValues.UserEmail != email){
            return next(new HttpException(402,"you can not check likers of other people's article"));
        }

        let likers = await article.getLiker({
            limit:40,
            offset
        });

        let data = likers.map(liker => ({username:liker.dataValues.username,avatar:liker.dataValues.avatar}));


        res.json({
            data,
            message:"ok"
        });
    }
    catch(error){
        next(error);
    }
}

module.exports.getLiked = async (req,res,next) => {
    try{
        const {email} = req.body.user;

        let user = await User.findByPk(email);
        
        

        if(!user){
            return next(new HttpException(402,"user not found"));
        }

        let page = req.params.page;
        if(page < 1){
            return next(new HttpException(401,"param error"));
        }
        let offset = (page - 1) * 20;

        let articles = await user.getLiked({
            limit:20,
            offset
        });

        let data = [];

        for(let i = 0 ; i < articles.length ; i++){
            let currArticle = articles[i];
            let articleTags = await currArticle.getTags();
            let tags = [];
            for(let j = 0 ; j < articleTags.length ; j++){
                tags.push(articleTags[j].name);
            }
            //console.log(articleTags);
            data.push({
                slug:currArticle.dataValues.slug,
                title: currArticle.dataValues.title,
                description: currArticle.dataValues.description,
                tags
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