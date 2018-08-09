var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var gameState = {
	players: {},
}

io.on('connection', function(socket) {
	let playerId = socket.id;
	console.log(playerId + ' connected');
	socket.on('disconnect', function() {
		console.log(playerId + 'disconnected');
		delete gameState.players[playerId]
	})
	.on('update', function(update){
		gameState.players[playerId] = update;
		io.emit('new state', gameState);
	})
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
