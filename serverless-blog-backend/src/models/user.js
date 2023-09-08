const sequelize = require('../db/sequelize');
const {DataTypes} = require('sequelize');

const User = sequelize.define('User',{
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true
    },
    username:{ //username
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{ //password
        type:DataTypes.STRING,
        allowNull:false
    },
    avatar:{ //avatar
        type:DataTypes.TEXT
    },
    bio:{ //biography
        type:DataTypes.TEXT
    }
});

module.exports = User;