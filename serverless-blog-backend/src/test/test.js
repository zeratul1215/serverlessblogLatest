const validator = require("validator");
const { validateToken } = require("../util/dataValidate/token.validate");
const {Op} = require("sequelize");


const array = [1,2,3,4,5];

const arr = array.map(num => ({title:{[Op.like]:`%${num}%`}}));

console.log(arr);