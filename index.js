var express = require('express')
var socket = require('socket.io')
var application = express();

var server = application.listen(5000, function () {
	console.log("server run")
})

application.use(express.static('public'))

var sio = socket(server)

sio.on('connection', function (visiteur) {
	console.log('we have a new user id => ', visiteur.id)
	let devices = {},
		lines = {}
	visiteur.on('device', function (_device) {
		console.log(_device)
		devices[_device.id] = _device;
		sio.sockets.emit('data_devices', _device)
	})

	visiteur.on('line', function (_line) {
		console.log(_line)
		lines[_line.id] = _line;
		sio.sockets.emit('data_lines', _line)
	})

	visiteur.on('detecter', function (_detect) {
		console.log(_detect)
		lines[_detect.id] = _detect;
		sio.sockets.emit('data_Detect', _detect)
	})
})