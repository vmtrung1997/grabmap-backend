const mongoose = require("mongoose");
const Schema = mongoose.Schema;
    ObjectId    = Schema.ObjectId;
const RequestGrab = new Schema({
    name: String,
    phone: String,
    address: String,
    note: String,
    date: {type: Date},
    idDriver: String,
    state: String
});
// tao module 
const requestGrab = mongoose.model('RequestGrab', RequestGrab, 'RequestGrab');
module.exports=requestGrab;