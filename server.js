var express =  require('express');
var PORT = process.env.PORT || 3000;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname+'/public'));

var clientInfo = {};

io.on('connection', function (socket) {
    console.log('User connected via socket.io');

    // Message by join room
    socket.on('joinRoom', function (req) {
        clientInfo[socket.id] = req;

        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + 'has joined',
            timestamp: moment().valueOf()
        })
    })

    // Receiving the message
    socket.on('message', function (message) {
        console.log('New message:' + message.text);

        message.timestamp = moment().valueOf();

        // Receiving the message by chatting room
        io.to(clientInfo[socket.id].room).emit('message', message);

        // 주고받은 메세지 
        // io.emit('message', message);
        // 보낸 메세지
        // socket.broadcast.emit('message', message);
    })

    // Sending message 
    socket.emit('message', {
        name: 'System',
        text: 'Welcome to the chat application',
        timestamp: moment().valueOf()
    })
})

http.listen(PORT, function () {
    console.log('server started');
});