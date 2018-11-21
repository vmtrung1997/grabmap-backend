var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');
    
var app = express();
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors());


var requestCtrl = require('./public/apiControllers/requestController');
var userCtrl = require('./public/apiControllers/userController')
var orderCtrl = require('./public/apiControllers/orderControllers');
var logoutCtrl = require('./public/apiControllers/logoutController')
var verifyAccessToken = require('./public/repos/authRepo').verifyAccessToken;



app.use('/api/request', verifyAccessToken, requestCtrl);
app.use('/api/user', userCtrl);
app.use('/api/orders', verifyAccessToken, orderCtrl);
app.use('/api/logout', verifyAccessToken, logoutCtrl);

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

app.set('socketio', io);

io.on("connection", function(socket){
    console.log("Co nguoi ket noi "+socket.id);

    socket.on("disconnect", function(){
        console.log(socket.id + " ngat ket noi");
    });
});

global.userSessions = {};

app.get('/', (req, res) => {
    res.json({
        msg: 'hello from nodejs express api'
    })
});
