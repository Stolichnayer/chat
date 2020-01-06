var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);


server.listen(process.env.PORT || 3000);

app.use(express.static("public"));



io.sockets.on('connection', function(socket) {
    
    var clientIp = socket.request.connection.remoteAddress;
      console.log('New connection from ' + clientIp);

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

    socket.on('clientMessage', function(message){
        console.log("Client: " + message);
        socket.broadcast.emit('serverMessage', message);
    })
});