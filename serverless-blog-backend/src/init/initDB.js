const sequelize = require('../db/sequelize');
const Article = require('../models/article');
const Comment = require('../models/comment');
const Tag = require('../models/tag');
const User = require('../models/user');
const Follow = require('../models/follow');

const initRelation = () => {

    //user and article
    User.hasMany(Article,{
        onDelete:'CASCADE'
    });
    Article.belongsTo(User);

    Article.hasMany(Comment,{
        onDelete:'CASCADE'
    });
    Comment.belongsTo(Article);

    //user and comments
    User.hasMany(Comment,{
        onDelete:'CASCADE'
    });
    Comment.belongsTo(User);

    //user and article(like)
    User.belongsToMany(Article,{
        through:'Like',
        uniqueKey:false,
        timestamps:false,
        as:"liked"
    });
    Article.belongsToMany(User,{
        through:'Like',
        uniqueKey:false,
        timestamps:false,
        as:"liker"
    });

    //article and tag
    Article.belongsToMany(Tag,{
        through:'TagList',
        uniqueKey:false,
        timestamps:false
    });
    Tag.belongsToMany(Article,{
        through:'TagList',
        uniqueKey:false,
        timestamps:false
    });

    

    //sequelize.sync({alter:true});
}

//initRelation();

module.exports = {
    initRelation
}