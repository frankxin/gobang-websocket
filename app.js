var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var player = 0;
var turn = 0;


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection',function(socket){
	console.log("someone is connect");
	socket.on('join',function(name){
		player++;
		socket.username = name;
		if(player == 1){
			io.emit('whoTurnControl',true);
		}
		if (player == 2) {
			console.log('begin!!!!!');
			socket.emit('begin',true);
			socket.broadcast.emit('begin', true);
		};
	});
	socket.on('play', function(step) {

		socket.emit('drawchess', step);
		socket.broadcast.emit('drawchess', step);

	});

	socket.on('turn', function() {

		if (turn % 2 == 0) {
			socket.emit('yourTurn', true);
			socket.broadcast.emit('yourTurn',true);
		} else {
			socket.emit('yourTurn', false);
			socket.broadcast.emit('yourTurn',false);
		};

		turn++;
		
	});

	socket.on('disconnect',function(){
		socket.broadcast.emit('disconnection');
		player--;
		turn = 0;
	});
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});
