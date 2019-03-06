var express =  require('express');
var PORT = process.env.PORT || 3000;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname+'/public'));

var clientInfo = {};

// Send current users to provided socket
function sendCurrentUsers(socket){
    var info = clientInfo[socket.id];
    var users = [];

    if(typeof info === 'undefined'){
        return;
    }
    Object.keys(clientInfo).forEach(function(socketId){
        var userInfo = clientInfo[socketId];
        if(info.room === userInfo.room){
            users.push(userInfo.name);
        }
    });

    socket.emit('message', {
        name: 'System',
        text: 'Current users:' + users.join(', '),
        timestamp: moment().valueOf()
    })
}

io.on('connection', function (socket) {
    console.log('User connected via socket.io');

    // Disconnect the socket chatting server
    socket.on('disconnect', function () {
        var userData = clientInfo[socket.id];

        if(typeof userData !== 'undefined'){
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                name: 'System',
                text: userData.name + 'has left',
                timestamp: moment().valueOf()
            });
            
            delete clientInfo[socket.id];
        }
    })

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

        if(message.text === '@currentUsers'){
            sendCurrentUsers(socket)
        }
        else{
            message.timestamp = moment().valueOf();
            // Receiving the message by chatting room
            io.to(clientInfo[socket.id].room).emit('message', message);
    
            // 주고받은 메세지 
            // io.emit('message', message);
            // 보낸 메세지
            // socket.broadcast.emit('message', message);
        }        
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