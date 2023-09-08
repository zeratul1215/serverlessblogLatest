const serverless = require("serverless-http");
const express = require("express");
const app = express();
const cors = require('cors');
const morgan = require("morgan");
const {initRelation} = require("./src/init/initDB");
const bodyParser = require("body-parser");

const errorMiddleware = require("./src/middleWare/error.middleWare");
const HttpException = require("./src/exception/http.exception");
const userRouter = require("./src/router/userRouter");
const followRouter = require("./src/router/followRouter");
const tagRouter = require("./src/router/tagRouter");
const articleRouter = require("./src/router/articleRouter");
const commentRouter = require("./src/router/commentRouter");

initRelation();


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({credentials:true,origin:true}));
app.use(express.json());
app.use(morgan('tiny'));

app.use("/user",userRouter);
app.use("/follow",followRouter);
app.use("/tag",tagRouter);
app.use("/article",articleRouter);
app.use("/comment",commentRouter);

app.use((req, res, next) => {
  next(new HttpException(404,"URL Not Found"));
  return;
});

app.use(errorMiddleware);

module.exports.handler = serverless(app);
