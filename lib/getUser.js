// Get a user who matches the token
module.exports = function getUser (socket, token) {

  // Emit an error if the token doesn't exist
  if (!userSessions[token]) {
      return socket.emit('user_get_error', {
          error: 'This user is not authenticated'
      });
  }

  // Emit a message with the profile and token
  // if the token does exist
  return socket.emit('user_get_success', {
      profile: userSessions[token],
      token: token
  });

};
