const mongoose = require('mongoose');
const RequestGrab = require('../models/requestGrab');
const User = require('../models/user');
const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').mongo.ObjectId;

var axios = require('axios');
var mongoURI = 'mongodb://localhost:27017/grab';
mongoose.connect(mongoURI, { useNewUrlParser: true } );

router.post('/get_detail', (req, res) => {
	var id = new ObjectId(req.body.idRequest);
    RequestGrab.findOne({_id: id }, function(err, dataRequest){
    	if(dataRequest){
    		var idDriver = dataRequest.idDriver;
	    	User.findOne({_id: idDriver}, function(error, dataDriver){
	    		if(dataDriver){
	    			res.statusCode = 201;
	    			res.json({
	    				request: dataRequest,
	    				driver : dataDriver
	    			});
	    		}
	    	});
    	}
    	else {
    		console.log(err);
    	}
    });
})

router.post('/get_path', (req, res) => {
	var rx = req.body.requestPosition.lat,
		ry = req.body.requestPosition.lng,
		dx = req.body.driverPosition.lat,
		dy = req.body.driverPosition.lng;
	var access_token = "ec2e892c-d171-4a3d-82ca-4c0a80d42d18";
	var url = 'https://graphhopper.com/api/1/route?point=' + rx + ',' + ry + '&point=' + dx + ',' + dy + '&vehicle=car&points_encoded=false&key=' + access_token;
	
	axios.get(url)
		.then(result => {
			res.json({
				res: result.data,
			});
		})
		.catch(error => {
			res.end("Error!");
		})
})
module.exports = router;