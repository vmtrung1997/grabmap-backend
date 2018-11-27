const mongoose = require('mongoose');
const RequestGrab = require('../models/requestGrab');

var mongoURI = 'mongodb://localhost:27017/grab';//'mongodb://grab:grabmap2015@ds115154.mlab.com:15154/grabmap';
mongoose.connect(mongoURI,{ useNewUrlParser: true });

exports.getRequests = () => {
    return new Promise((resole, reject) => {
        RequestGrab.find()
            .sort({ date: -1 })
            .exec()
            .then(result => {
                if (result)
                    resole(result)
                else
                    reject(new Error('no data'))
            })

    })
}