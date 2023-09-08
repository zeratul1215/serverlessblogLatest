const md5 = require('md5');

const salt = 'SALT';

const md5Password = (password) => {
    return new Promise((resolve,reject) => {
        const pwd = md5(password + salt);
        resolve(pwd)
    });
}

const matchOldPassword = (password,oldMD5Password) => {
    return new Promise((resolve,reject) => {
        const newPwd = md5(password + salt);
        if(newPwd === oldMD5Password){
            resolve(true);
        }
        else{
            reject(false);
        }
    }).catch((err)=>{
        return false;
    });
}

module.exports = {
    md5Password,
    matchOldPassword
}