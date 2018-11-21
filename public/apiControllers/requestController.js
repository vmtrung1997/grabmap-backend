const mongoose = require('mongoose');
const RequestGrab = require('../models/requestGrab');
const express = require('express');
const router = express.Router();

var mongoURI = 'mongodb://localhost:27017/grab';
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
            state: "located"
        })
        i_request.save((err,result) => {
            if (err){
                res.statusCode = 401;
                res.end('View error on console log')
                console.log(err);
            }
            else{
                var io = req.app.get('socketio');
                io.sockets.emit('client_create_request');
                res.statusCode = 201
                res.json({
                createSuccess: true,
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
module.exports = router;