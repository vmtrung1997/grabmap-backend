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

router.get('/driver_located', (req, res) => {
    res.json({
        msg: "no info"
    })
})

router.post('/click_position', (req, res) =>{
	console.log(req.body.position);
	geocoder.geocode(`${req.body.position.lat}, ${req.body.position.lng}`, (err, doc) =>{
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