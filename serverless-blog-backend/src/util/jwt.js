const jwt = require('jsonwebtoken');

// add the token
const sign = (username,email) => {
    return new Promise((resolve,reject) => {
        jwt.sign({
            username,
            email 
        },process.env.JWT_SECRET,(error,token) => {
            if(error){
                reject(error);
            }
            else{
                resolve(token);
            }
        });
    });
}

// verify the token
const verify = (token) => {
    return new Promise((resolve,reject) => {
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
            if(err){
                reject(err);
            }
            else{
                resolve(decoded);
            }
        });
    });
} 

module.exports = {
    sign,
    verify
}