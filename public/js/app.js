var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

// Showing room name
$(".room_name").text(room);

socket.on('connect', function () {
    console.log('Connected to socket.io server');

    // Join Room
    socket.emit('joinRoom',{
        name: name,
        room: room
    })
})

socket.on('message', function(message){
    console.log('New message:');
    console.log(message.text);

    var momentTimestamp = moment.utc(message.timestamp)
    var $message = jQuery('.messages');

    $message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');
})

// Handling submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
    event.preventDefault();

    var $message = $form.find('input[name=message]')

    socket.emit('message', {
        name: name,
        text: $message.val()
    });

    $message.val('');
})