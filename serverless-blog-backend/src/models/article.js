const sequelize = require('../db/sequelize');
const {DataTypes} = require('sequelize');

const Article = sequelize.define('article',{
    slug:{ //id
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true
    },
    title:{ //title
        type:DataTypes.STRING,
        allowNull:false,
    },
    description:{
        type:DataTypes.TEXT
    },
    s3URL:{
        type:DataTypes.TEXT,
        allowNull:false
    }
});

module.exports = Article;