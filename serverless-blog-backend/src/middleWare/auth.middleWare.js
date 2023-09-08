const HttpException = require("../exception/http.exception");
const { validateToken } = require("../util/dataValidate/token.validate");
const { verify } = require("../util/jwt");

module.exports.authMiddleware = async (req,res,next) => {
    try{
        let authHeader = req.headers.authorization;

        if(!authHeader && !req.body.user){
            return next(new HttpException(401,"autherization missing"));
            
        }
        else if(!authHeader && req.body.user){
            req.body.usingToken = false;
            return next();
        }

        let token = authHeader.split(" ")[1];
        if(!validateToken(token)){
            next(new HttpException(401,"invalid token"));
        }

        let user = await verify(token);

        req.body.user = user;
        req.body.usingToken = true;
        return next();
    }
    catch(error){
        next(error);
    }
}