const mongoose = require('mongoose');
const RequestGrab = require('../models/requestGrab');
const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').mongo.ObjectId;
const moment = require('moment');

var NodeGeocoder = require('node-geocoder');

var geocoder = NodeGeocoder({
    provider: 'opencage',
    apiKey: '2a24c2d95bcc49359eace760131c6f87'
  });

router.get('/driver_located', (req, res) => {
    res.json({
        msg: "no info"
    })
})

router.post('/click_position', (req, res) =>{
	var position = `${req.body.position.lat}, ${req.body.position.lng}`;
	console.log(position);
	geocoder.geocode(position, (err, doc) =>{
		if (err)
		{
			console.log('View on console log')
			res.end(err)
		}
		console.log(doc);
		res.json({
			address: doc
		})
	})
})

module.exports = router;