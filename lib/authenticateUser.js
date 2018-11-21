var md5 = require('MD5'),
    User = require('./userModel'),
    loginUser = require('./loginUser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/grab',{ useNewUrlParser: true });
// Authenticates a user and logs them in
module.exports = function authenticateUser (socket, data) {

  // Hash the password
  data.password = md5(data.password);

  User.findOne(data, null, function (err, data) {

      // If the username and password are correct, log the user in
      if (data) {
          console.log('have data');

          return loginUser(socket, data);

      // If the username or password are incorrect, emit an error
      } else {
          console.log('no data');
          return socket.emit('user_login_error', err || {
              message: 'Invalid username or password.'
          });
      }
  });

};
