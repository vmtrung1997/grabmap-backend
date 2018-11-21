var express = require('express');
const ReToken = require('../models/token')
var router = express.Router();

router.get('/', (req, res) => {
    console.log(req.headers['x-refresh-token']);
	ReToken.findOneAndDelete({token: req.headers['x-refresh-token']}, function(err, result){
        if (err){
            res.statusCode = 401;
            res.end('View err on console log')
            console.log(err);
        } else {
            res.statusCode = 201;
            res.json({
                logout: true
            })
        }
    })
})

module.exports = router;