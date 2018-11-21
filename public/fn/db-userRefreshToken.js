const mongoose = require('mongoose');
const Token = require('../models/token')

var mongoURI = 'mongodb://localhost:27017/grab';
mongoose.connect(mongoURI,{ useNewUrlParser: true });

exports.deleteRefreshToken = (user) => {
    return new Promise((resolve, reject) =>{
        Token.deleteOne({userid: user}).then(res =>{
            console.log(res + ' on delete refreshtoken')
            resolve(res)
        }).catch(err=>{
            reject(err);
        })
    });
}
exports.insertRefreshToken = (reToken, user, time) => {
    return new Promise((resolve, reject) => {
        console.log(reToken + " " + user + " " + time + " on insert re token");
        var token = new Token({
            userid: user,
            token: reToken,
            exp: time
        });
        token.save().then(result=>{
            console.log(result + ' on insert refresh token')
            resolve(result);
        }).catch(err => {
            reject(err);
        })
    })
}