const mongoose = require('mongoose');
const RequestGrab = require('../models/requestGrab');
const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').mongo.ObjectId;
const moment = require('moment');

var NodeGeocoder = require('node-geocoder');

var geocoder = NodeGeocoder({
    provider: 'opencage',
    apiKey: 'bf09a44e81634056a9b9c853b81c6c7a'
  });

var mongoURI = 'mongodb://localhost:27017/grab';//'mongodb://grab:grabmap2015@ds115154.mlab.com:15154/grabmap'//
mongoose.connect(mongoURI, { useNewUrlParser: true } );

router.post('/create_request', (req, res) => {
    try {
        let i_request = new RequestGrab({
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            note: req.body.note,
            date: new Date(),
            idDriver: "",
            state: "not_locate",
            locationGeocode: []
        })
        i_request.save((err,result) => {
            if (err){
                res.statusCode = 401;
                res.end('View error on console log')
                console.log(err);
            }
            else{
                res.statusCode = 201
                res.json({
                success: true,
                data: result
            })
            }
        })
    } catch (err) {
        console.log(err);
        res.statusCode = 404;
        res.end('View on console log')
    }
})

router.post('/get_requests', (req, res) => {
    RequestGrab.find(req.body)
    .sort({date: -1})
    .exec((err, docs) => {
        if (err){
            res.statusCode = 401;
            res.end('View on console log')
        } else {
            res.statusCode = 201;
            res.json(docs);
        }
    });
})

router.post('/located_request', (req, res) => {
    var request = req.body.request;
    var pos = {};
    pos.lat = parseFloat(req.body.locationGeoCode.lat);
    pos.lng = parseFloat(req.body.locationGeoCode.lng);
    var id = new ObjectId(request._id);
    console.log(id);
    RequestGrab.findByIdAndUpdate(id,
        {
            $set: {
                'position.lat': pos.lat,
                'position.lng': pos.lng,
                'state': 'located',
                'date': moment().format('YYYY-MM-DD HH:mm:ss')
            }
        }, (err, result) => {
            if (result !== null) {
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

router.post('/locate_request', (req, res) => {
    var id = new ObjectId(req.body.idRequest);
    console.log(id);
    RequestGrab.findByIdAndUpdate(id,
        {
            $set: {
                'state': 'locating',
                'date': moment().format('YYYY-MM-DD HH:mm:ss')
            }
        }, function(err, result){
        if (result){
            geocoder.geocode(result.address, function(error, data) {
                if (data){
                    console.log(data);
                    res.statusCode = 201;
                    res.json({
                        request: result,
                        location: data
                    })
                }
              });
        } else {
            console.log(err);
            res.end('View on console log')
        }
    })
    
})


module.exports = router;