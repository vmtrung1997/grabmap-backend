var crypto = require('crypto'),
    getUser = require('./getUser');

// Logs in a user
module.exports = function loginUser (socket, user) {

    var token = crypto.randomBytes(64).toString('base64');

    userSessions[token] = user;

    return getUser(socket, token);
};
