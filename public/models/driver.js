const mongoose = require("mongoose");
const Schema = mongoose.Schema;
    ObjectId    = Schema.ObjectId;
const Driver = new Schema({
    driverId: String,
    state: String,
    position: {
        lat: Number,
        lng: Number
    },
    requestId: String
});
// tao module 
const driver = mongoose.model('Driver', Driver, 'Driver');
module.exports=driver;