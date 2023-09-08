const sequelize = require('../db/sequelize');
const {DataTypes} = require('sequelize');

const Comment = sequelize.define('comment',{
    slug:{ //id
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true
    },
    body:{ 
        type:DataTypes.TEXT,
        allowNull:false
    }
});

module.exports = Comment;