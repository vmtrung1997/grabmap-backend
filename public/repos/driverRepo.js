const mongoose = require('mongoose');
const Driver = require('../models/driver');

var mongoURI = 'mongodb://localhost:27017/grab';//'mongodb://grab:grabmap2015@ds115154.mlab.com:15154/grabmap';
mongoose.connect(mongoURI,{ useNewUrlParser: true });

exports.driverReady = function(){
    return new Promise((res,rej) => 
        Driver.find({state: 'READY'})
        .exec()
        .then(docs => res(docs))
        .catch(error => rej(error))
    )
}