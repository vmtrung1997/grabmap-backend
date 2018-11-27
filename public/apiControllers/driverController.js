const mongoose = require('mongoose');
const RequestGrab = require('../models/requestGrab');
const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').mongo.ObjectId;
const moment = require('moment');

router.get('/driver_located', (req, res) => {
    res.json({
        msg: "no info"
    })
})

module.exports = router;