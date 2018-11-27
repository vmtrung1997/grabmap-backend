const mongoose = require('mongoose');
const Token = require('../models/token')

var mongoURI = 'mongodb://localhost:27017/grab';//'mongodb://grab:grabmap2015@ds115154.mlab.com:15154/grabmap';
mongoose.connect(mongoURI,{ useNewUrlParser: true });

exports.deleteRefreshToken = (user) => {
    return new Promise((resolve, reject) =>{
        Token.deleteOne({userid: user}).then(res =>{
            resolve(res)
        }).catch(err=>{
            reject(err);
        })
    });
}
exports.insertRefreshToken = (reToken, user, time) => {
    return new Promise((resolve, reject) => {
        var token = new Token({
            userid: user,
            token: reToken,
            exp: time
        });
        token.save().then(result=>{
            resolve(result);
        }).catch(err => {
            reject(err);
        })
    })
}