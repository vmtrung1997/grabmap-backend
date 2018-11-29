var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');

var app = express();
const mongoose = require('mongoose');
const Driver = require('./public/models/driver');
const RequestGrab = require('./public/models/requestGrab')
const ObjectId = mongoose.mongo.ObjectId;
const haversine = require('haversine')

var mongoURI = 'mongodb://localhost:27017/grab';//'mongodb://grab:grabmap2015@ds115154.mlab.com:15154/grabmap';
mongoose.connect(mongoURI, { useNewUrlParser: true });

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(cors());


var requestCtrl = require('./public/apiControllers/requestController');
var userCtrl = require('./public/apiControllers/userController')
var orderCtrl = require('./public/apiControllers/orderControllers');
var logoutCtrl = require('./public/apiControllers/logoutController')
var verifyAccessToken = require('./public/repos/authRepo').verifyAccessToken;

var requestRepo = require('./public/repos/requestRepo');
var driverRepo = require('./public/repos/driverRepo')
var driverCtrl = require('./public/apiControllers/driverController')
var managerCtrl = require('./public/apiControllers/managerController')


app.use('/api/request', verifyAccessToken, requestCtrl);
app.use('/api/user', userCtrl);
app.use('/api/orders', verifyAccessToken, orderCtrl);
app.use('/api/logout', verifyAccessToken, logoutCtrl);

app.use('/api/driver', verifyAccessToken, driverCtrl);
app.use('/api/manager', verifyAccessToken, managerCtrl);

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var infoValue = []
var iMin = 0;
app.use('sockets', requestCtrl);

io.on("connection", function (socket) {
    console.log("Co nguoi ket noi " + socket.id);

    socket.on("disconnect", function () {
        console.log(socket.id + " ngat ket noi");
        if (socket.driverId != null) {
            console.log('driver_logout');
            Driver.findOneAndDelete({ driverId: socket.driverId }, function (err, doc) {
                if (doc) {
                    console.log(doc);
                    console.log("driver_logout");
                }
            })
        }
    });

    socket.on("identifier_loged", function () {
        socket.join('identifier_room');
    })

    socket.on("driver_loged", function (data) {
        console.log('driver loged');
        console.log(data);
        socket.driverId = data.id;
        socket.join(data.id);
        var driver = new Driver({
            driverId: data.id,
            state: 'online',
            position: {
                lat: 0,
                lng: 0
            },
            requestId: ''
        })
        driver.save().then(() => {
            socket.emit("driver_is_online");
        }).catch(err => console.log(err));
    })

    socket.on("driver_ready", function (data) {
        Driver.findOneAndUpdate({ driverId: data.driverId },
            {
                $set: {
                    'state': 'ready',
                    'position': {
                        lat: data.position.lat,
                        lng: data.position.lng
                    }
                }
            },
            function (err, doc) {
                if (doc) {
                    console.log(doc);
                    socket.emit("driver_is_ready");
                }
            })

    })

    socket.on("driver_logout", function () {
        if (socket.driverId != null) {
            console.log('driver_logout');
            Driver.findOneAndDelete({ driverId: socket.driverId }, function (err, doc) {
                if (doc) {
                    console.log(doc);
                    console.log("driver_logout");
                }
            })
        }
    })

    socket.on("manager_loged", function () {
        socket.join('manager_room');
    })

    socket.on("client_create_request", function () {
        io.sockets.emit('user_load_requests');
    })

    socket.on("identifier_located_request", function (data) {
        io.sockets.emit('user_load_requests');
        //console.log('identifier_located_request has been')
        driverRepo.driverReady().then(drivers => {
            if (drivers.length > 0) {
                var distanceDriver = [];
                for (let driver of drivers) {
                    distanceDriver.push(requestRepo.pointToDriver(data, driver));
                }
                const result = Promise.all(distanceDriver)
                result.then(values => {
                    if (values) {
                        infoValue = values
                        iMin = 0;
                        for (let i = 1; i < values.length; i++) {
                            if (values[i].path.distance < values[iMin].path.distance)
                                iMin = i
                        }
                        console.log(`${values[iMin].driver.driverId}`);
                        io.to(`${values[iMin].driver.driverId}`).emit('driver_confirm_request', values[iMin]);
                    }
                }).catch(err => console.log(err));
            }
        }).catch(error => console.log(error))
    })

    socket.on('driver_discard_request', function (data) {
        console.log('driver_discard_request');
        infoValue.splice(iMin,1);
        console.log(typeof(infoValue));
        iMin = 0;
        for (let i = 1; i < infoValue.length; i++) {
            if (infoValue[i].path < infoValue[iMin].path)
                iMin = i
        }
        console.log(infoValue[iMin])
        io.to(`${infoValue[iMin].driver.driverId}`).emit('driver_confirm_request', infoValue[iMin]);
    })

    socket.on('driver_accept_request', function (data) {

        console.log('driver_accept_request');
        //io.to(`${data.driver.driverId}`).emit('driver_confirm_request', data);
        Driver.findOneAndUpdate({ driverId: data.driver.driverId },
            {
                $set: {
                    'state': 'request_accepted',
                    'requestId': data.request.request._id
                }
            },
            function (err, doc) {
                if (doc) {
                    //socket.emit("driver_had_request");
                }
            })
        console.log(data.request);
        var requestId = new ObjectId(data.request.request._id)
        RequestGrab.findOneAndUpdate({_id: requestId}, {
            $set: {
                'state': 'request_accepted',
                'idDriver': data.driver.driverId,
                'driverPosition.lat': data.driver.position.lat,
                'driverPosition.lng': data.driver.position.lng
            }
        },
        function (err, doc) {
            if (doc){
                console.log(doc);
                socket.emit("user_load_requests");
            }
        })
    })

    socket.on("driver_starting_request", function (data) {
        Driver.findOneAndUpdate({ driverId: data.driver.driverId },
            {
                $set: {
                    'state': 'starting',
                    'requestId': data.request.requestId
                }
            },
            function (err, doc) {
                if (doc) {
                    socket.emit("driver_had_request");
                }
            })
        var requestId = new ObjectId(data.request.request._id)
        RequestGrab.findOneAndUpdate({_id: requestId}, {
            $set: {
                'state': 'moving',
            }
        },
        function (err, doc) {
            if (doc){
                socket.emit("user_load_requests");
            }
        })
    })

    socket.on("driver_standby", function (data) {
        Driver.findOneAndUpdate({ driverId: data.driver.driverId },
            {
                $set: {
                    'state': 'standby'
                }
            },
            function (err, doc) {
                if (doc) {
                    console.log(doc)
                }
            })
    })

    socket.on("driver_moving", function(data){
        const start = {
            latitude: data.start.lat,
            longitude: data.start.lng
        };
        const end = {
            latitude: data.end.lat,
            longitude: data.end.lng
        }
       var distance = haversine(start, end, {unit: 'meter'});
       io.to(`${data.driver.driverId}`).emit('drive_moving_response', {returnData: data, distance:distance});
    })

    socket.on("driver_finish", function(data){
        const start = {
            latitude: data.point.lat,
            longitude: data.point.lng
        };
        const end = {
            latitude: data.request.position.lat,
            longitude: data.request.position.lng,
        }
        var distance = haversine(start, end, {unit: 'meter'});
        if (distance < 100){
            io.to(`${data.driver.driverId}`).emit('drive_finished', {res: true, msg: "success"});
            var requestId = new ObjectId(data.request.request._id)
            RequestGrab.findOneAndUpdate({_id: requestId}, {
                $set: {
                    'state': 'finished'
                }
            },
            function (err, doc) {
                if (doc){
                    console.log(doc);
                    socket.emit("user_load_requests");
                }
        })
        } else {
            io.to(`${data.driver.driverId}`).emit('drive_finished', {res: false, msg: "fail"});
        }
    })
    socket.on("identifier_locating_request", function () {
        io.sockets.emit('user_load_requests');
    })

    socket.on("identifier_locating_request", function () {
        io.sockets.emit('user_load_requests');
    })
});

app.get('/', (req, res) => {
    res.json({
        msg: 'hello from nodejs express api'
    })
});
