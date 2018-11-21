var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    token: String,
    expTime: Date,
    idUser: String
});
const model = mongoose.model('User', userSchema, 'User');
module.exports = model;
