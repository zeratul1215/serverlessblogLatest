const HttpException = require("../exceptions/http.exception");

const noMatchMiddleware = (req,res,next) => {
    const noMatchError = new HttpException(404,'path not match');
    //pass the error to the error middle ware
    throw(noMatchError);
}

module.exports = noMatchMiddleware;