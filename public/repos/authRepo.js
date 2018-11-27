var jwt = require('jsonwebtoken');
var rndToken = require('rand-token');
var moment = require('moment');

const dbToken = require('../fn/db-userRefreshToken');

const SECRET = 'ABCDEF';
const AC_LIFETIME = 6000;

exports.generateAccessToken = userEntity => {
    var payload = {
        user: userEntity,
        info: 'more info'
    }

    var token = jwt.sign(payload, SECRET, {
        expiresIn: AC_LIFETIME
    });

    return token;
}

exports.verifyAccessToken = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) {
                res.statusCode = 401;
                res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                })
            } else {
                req.token_payload = payload;
                console.log('verify success');
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'NO_TOKEN'
        })
    }
}

exports.generateRefreshToken = () => {
    const SIZE = 80;
    return rndToken.generate(SIZE);
}

exports.updateRefreshToken = (userId, rfToken) => {
    return new Promise((resolve, reject) => {
        dbToken.deleteRefreshToken(userId).then(() =>{
            var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
            return dbToken.insertRefreshToken(rfToken, userId, rdt)
        }).then(value => resolve(value))
        .catch(err => reject(err));
    });
}