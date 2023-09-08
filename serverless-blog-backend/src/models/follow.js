const sequelize = require('../db/sequelize');
const {DataTypes} = require('sequelize');

const Follow = sequelize.define('Follow',{
    userEmail:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:'Users',
            key:'email'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    },
    followerEmail:{
        type:DataTypes.STRING,
        allowNull:false,
        references:{
            model:'Users',
            key:'email'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    }
});

module.exports = Follow;