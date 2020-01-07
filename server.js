var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);


server.listen(process.env.PORT || 3000);

app.use(express.static("public"));

var online_users = 0;


io.sockets.on('connection', function(socket) {
    let is_user_logged_in = false; 
    var clientIp = socket.request.connection.remoteAddress;    

    console.log('New connection from ' + clientIp)   

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

    socket.on('clientMessage', function(message){
        console.log("Client: " + message);
        socket.broadcast.emit('serverMessage',"<div class='otherUsername'> <strong>" + socket.username + '</strong></div> ' + message);
    });

    socket.on('submitUsername', function(username){
        console.log(username + " Joined");
        online_users++;   
        is_user_logged_in = true;     
        io.emit('update_online_users', online_users);
        this.username = username;
        
    });

    socket.on('disconnect', function() {
        if(is_user_logged_in)
            online_users--;
        io.emit('update_online_users', online_users);
    });

});


