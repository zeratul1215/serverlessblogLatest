const validator = require("validator");

module.exports.validateToken = (token) => {
    return validator.isJWT(token);
}