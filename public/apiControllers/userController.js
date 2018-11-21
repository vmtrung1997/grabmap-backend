const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').mongo.ObjectId;
const md5 = require('md5');
var NodeGeocoder = require('node-geocoder');
 
var geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: '38df4c9a8b2b44f6a5cb6b89dfd2e473'
});

const User = require('../models/user');
const ReToken = require('../models/token');
var auth = require('../repos/authRepo');

router.post('/register', (req, res) =>{
    var userObject = req.body;
    userObject.password = md5(userObject.password);
    var user = new User(userObject);
    console.log(userObject);
    user.save().then(() => {
        res.statusCode = 201;
        res.json(req.body);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('view console log')
    })
})

router.post('/login',(req, res) => {
    User.findOne({username: req.body.username, password: md5(req.body.password)},
         null, function(error, result){
            if (result){
                var userEntity = result;
                var acToken = auth.generateAccessToken(userEntity);
                var reToken = auth.generateRefreshToken();
                auth.updateRefreshToken(result._id, reToken)
                .then(data => {
                    res.statusCode = 201;
                    res.json({
                        auth: true,
                        user: userEntity,
                        access_token : acToken,
                        refresh_token : reToken
                    })
                }).catch(err => {
                    res.statusCode = 500;
                    res.end('View error in console log')
                })
            } else {
                res.json({
                    auth: false
                })
            }
        })
});

router.post('/getaccess', (req, res) =>{

    var reToken = req.body.refresh_token;
    ReToken.findOne({token: reToken}, null, function(err, result){
        if(result){
            var id = new ObjectId(result.userid);
            User.findOne({'_id': id}, function(err, userEntity) {
                var acToken = auth.generateAccessToken(userEntity);
                res.statusCode = 201;
                res.json({
                    auth: true,
                    user: userEntity,
                    access_token : acToken,
                    refresh_token : reToken
                })
            })
        } else {
            res.statusCode = 401;
            res.end('end')
        }
    })
})

router.get('/deleteRefreshToken', (req, res) => {
    var reToken = req.body.refresh_token;
    ReToken.findOneAndDelete({token: reToken}, null, function(err, result){
        if (result){
            res.statusCode = 201;
        } else {
            console.log(err);
            res.statusCode = 500;
        }
    })
})

router.get('/map', (req,res) => {
    geocoder.geocode('37.4396, -122.1864', function(err, result) {
        res.json(result);
      });
    //geocoder.batchGeocode([{10.7929004106.6533143},])
})
module.exports = router;