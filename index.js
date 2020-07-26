var express = require('express')
var socket = require('socket.io')
var application = express();

var server = application.listen(5000,function(){
   console.log("server run")
})


application.use(express.static('public'))

var sio = socket(server)

sio.on('connection',function(visiteur){
   console.log('we have a new user id => ',visiteur.id)
   let devices = {}
   visiteur.on('device',function(_device){
      console.log(_device)
      devices[_device.id] = _device;
      sio.sockets.emit('data_devices',_device)
    })
 })
