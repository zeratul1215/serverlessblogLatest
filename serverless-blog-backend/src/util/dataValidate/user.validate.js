const validator = require('validator');

module.exports.validateCreateUser = (username,email,password) => {
    let error = {};

    if(validator.isEmpty(username)){
        error.usernameCode = 1;
        error.username = 'username can not be empty';
    }

    if(validator.isEmpty(email)){
        error.emailCode = 1;
        error.email = 'email can not be empty';
    }
    else if(!validator.isEmail(email)){
        error.emailCode = 1;
        error.email = 'invalid email';
    }

    if(validator.isEmpty(password)){
        error.passwordCode = 1;
        error.password = 'password can not be empty';
    }
    //true: passed the validation 
    let validateResult = Object.keys(error).length < 1;

    //throw new Error()

    return {error,validateResult};
}


module.exports.validateUserLogin = (email,password) => {
    let error = {};

    if(validator.isEmpty(email)){
        error.emailCode = 1;
        error.email = 'email can not be empty';
    }
    else if(!validator.isEmail(email)){
        error.emailCode = 1;
        error.email = 'invalid email';
    }

    if(validator.isEmpty(password)){
        error.passwordCode = 1;
        error.password = 'password can not be empty';
    }


    //true: passed the validation 
    let validateResult = true;

    if(Object.keys(error).length > 0){
        validateResult = false;
    }

    return {error,validateResult};
}