const sequelize = require('../db/sequelize');
const {DataTypes} = require('sequelize');

const Tag = sequelize.define('tag',{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true
    }
},{
    timestamps:false
});

module.exports = Tag;