const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PWD,{
    dialect:process.env.DB_DIALECT,
    host:process.env.DB_HOST_END_NAME,
    port:process.env.DB_PORT,
    logging:false
});

// const sequelize = new Sequelize('blog_2023','admin','yl001215th',{
//     dialect:'mysql',
//     host:'my-blog.cuuvsmferzqo.us-east-2.rds.amazonaws.com',
//     port:3306,
//     logging:false
// });

module.exports = sequelize;