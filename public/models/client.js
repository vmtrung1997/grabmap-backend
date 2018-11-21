const mongoose = require("mongoose");
const Schema = mongoose.Schema;
    ObjectId    = Schema.ObjectId;
const Client = new Schema({
    name: String,
    phone: String,
    address: String,
    note: String
});
// tao module 
const client = mongoose.model("Client",Client);
module.exports=client;