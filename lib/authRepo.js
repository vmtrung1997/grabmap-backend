var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var moment = require('moment');

const SECRET = 'ABCDEF';
const AC_LIFETIME = 600;
exports.generateAccessToken = userEntity => {

    var token = jwt.sign(userEntity, SECRET, {
        expiresIn: AC_LIFETIME
    });

    return token;
}

exports.verifyAccessToken = (req, res, next) => {
    var token = req.token;
    console.log(token);

    if (token) {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) {
                res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                })
            } else {
                req.token = payload;
                next();
            }
        });
    } else {
        res.json({
            msg: 'NO_TOKEN'
        })
    }
}
exports.generateRefreshToken = () => {
    return crypto.randomBytes(64).toString('base64');;
}

exports.updateRefreshToken = (userId, rfToken) => {
    return new Promise((resolve, reject) => {

        var sql = `delete from userRefreshTokenExt where ID = ${userId}`;
        db.insert(sql) // delete
            .then(value => {
                var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
                sql = `insert into userRefreshTokenExt values(${userId}, '${rfToken}', '${rdt}')`;
                return db.insert(sql);
            })
            .then(value => resolve(value))
            .catch(err => reject(err));
    });
}