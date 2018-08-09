const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
	socket.on('disconnect', () => {
		io.emit('user disconnect', {
			author: 'system',
			message: 'A user has disconnected',
		})
	})
	.on('new message authored', (data) => {
		io.emit('update chat', {
			author: data.author || 'Anon',
			message: data.message || 'I have NOTHING to say!',
		})
	});
	// //test
	// setInterval(() =>{
	// 	socket.emit('update chat', {
	// 		author: 'Server',
	// 		message: 'Test Message',
	// 	})
	// }, 5000)
});

http.listen(4001, () => {
	console.log('Server started');
});
