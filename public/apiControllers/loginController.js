const express = require('express');
const router = express.Router();

router.post('/login',(req, res) => {
    if (!userSession[req.token]){
        res.statusCode = 500;
        res.end('Cant get token')
    }
    else{
        res.statusCode = 201;
    }
});

module.exports = router;