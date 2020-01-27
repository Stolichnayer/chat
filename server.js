var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

server.listen(process.env.PORT || 3000);

app.use(express.static("public"));

var online_users = 0;

var users = [];

io.sockets.on('connection', function(socket) {

    let is_user_logged_in = false; 
    
    socket.emit('update_online_users', online_users);    

    socket.on('clientMessage', function(message, username){
        console.log("Client: " + message);
        
        // Case of timeout disconnect
        if(socket.username === undefined){
            is_user_logged_in = true;
            socket.username = username;
            online_users++;  
            
            users.push({id: socket.id, name: username });
            
            socket.broadcast.emit('join_text', username);
            io.emit('update_online_users', online_users);
            socket.broadcast.emit('add_to_userlist', { id: socket.id, name: username });
            socket.emit('update_local_userlist', users);
        }            
        socket.broadcast.emit('serverMessage',"<div class='otherUsername'> <strong>" + socket.username + '</strong></div> ' + message);
    });

    socket.on('submitUsername', function(username){
        users.push({id: socket.id, name: username });
        
        console.log(username + " Joined");
        online_users++;   
        is_user_logged_in = true;  
        socket.broadcast.emit('join_text', username);
        io.emit('update_online_users', online_users);
        this.username = username;
        
        socket.broadcast.emit('add_to_userlist', { id: socket.id, name: username });
        socket.emit('update_local_userlist', users);        
    });

    socket.on('disconnect', function() {
        if(is_user_logged_in){
            users.splice(users.findIndex(obj => obj.id == socket.id), 1);
            online_users--;
            socket.broadcast.emit('leave_text', { id: socket.id, username: socket.username });
            socket.broadcast.emit('update_online_users', online_users);   
        }        
    });
});