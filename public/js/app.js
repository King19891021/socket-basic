var socket = io();

socket.on('connect', function () {
    console.log('Connected to socket.io server');
})

socket.on('message', function(message){
    console.log('New message:');
    console.log(message.text);
})

// Handling submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
    event.preventDefault();

    socket.emit('message', {
        text: $form.find('input[name=message]').val()
    });
})