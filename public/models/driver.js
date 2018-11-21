const mongoose = require("mongoose");
const Schema = mongoose.Schema;
    ObjectId    = Schema.ObjectId;
const Driver = new Schema({
    idDriver: String,
    username: {type:String,required:true},
    password: {type:String,required:true},
    token: String,
    state: String
});
// tao module 
const driver = mongoose.model('Driver', Driver, 'Driver');
module.exports=driver;