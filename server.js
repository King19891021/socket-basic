var express =  require('express');
var PORT = process.env.PORT || 3000;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname+'/public'));

io.on('connection', function (socket) {
    console.log('User connected via socket.io');

    // Receiving the message
    socket.on('message', function (message) {
        console.log('New message:' + message);

        // 주고받은 메세지 
        // io.emit('message', message);
        // 보낸 메세지
        // socket.broadcast.emit('message', message);
    })

    // Sending message 
    socket.emit('message', {
        text: 'Welcome to the chat application'
    })
})

http.listen(PORT, function () {
    console.log('server started');
});