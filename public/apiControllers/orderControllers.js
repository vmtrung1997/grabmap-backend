const mongoose = require('mongoose');
const RequestGrab = require('../models/requestGrab');
const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').mongo.ObjectId;

var mongoURI = 'mongodb://localhost:27017/grab';
mongoose.connect(mongoURI, { useNewUrlParser: true } );
//
// load orders by User

router.post('/somerequest', (req, res) => {
    let request = req.body.request;
    let pos = req.body.locationGeoCode;
    let id = new ObjectId(request._id);
    RequestGrab.findOneAndUpdate({_id: id}, {locationGeocode: [pos.lat, post.lng], state: 'located'}, {upsert:false} ,function(err, result){
        if (result){
            res.statusCode = 201;
            res.json({
                success: true,
                msg: "update success"
            })
        } else {
            console.log(err);
            res.end('View on console log')
        }
    })
})

module.exports = router;