// Connect to server
var socket = io.connect({transports: ['websocket']},{ forceNew: true });

// ------------------ EVENTS ---------------------------------------------------
socket.on('reconnect_attempt', () => {
  socket.io.opts.transports = ['polling', 'websocket'];
});

socket.on('serverMessage', (message) => {
    addToMessages(message, false);
});

socket.on('update_online_users', function(online_users){
    console.log("update users " + online_users);
    document.getElementById("num_users").innerHTML = online_users;
});

socket.on('join_text', function(user){
   let ul =  document.getElementsByClassName("messages");
   ul[0].innerHTML += "<div class=\"join_text\"><div style=\"color: blue;display: inline;\">"
   + "<img style=\"position: relative;bottom: 1px;\" src=\"connect.png\"> <strong>" + user + "</strong>"  + "</div>" + " connected. " + "</div>";
      ul[0].scrollTo(100,ul[0].scrollHeight);
});

socket.on('leave_text', function(user){
   let ul =  document.getElementsByClassName("messages");
   ul[0].innerHTML += "<div class=\"join_text\"><div style=\"color: blue;display: inline;\">"
   + "<img style=\"position: relative;bottom: 2px;\" src=\"disconnect.png\"> <strong>" + user.username + "</strong>" + "</div>" + " disconnected. " + "</div>";
   ul[0].scrollTo(100,ul[0].scrollHeight);  
   
   let user_div =  document.getElementById(user.id);
   if(user_div !== null && user_div !== undefined)
        user_div.remove();
});

socket.on('add_to_userlist', function(data){
  let userlist = document.getElementsByClassName("usernames");
  var iDiv = document.createElement('div');
  iDiv.id = data.id;
  iDiv.innerHTML = data.name;
  userlist[0].appendChild(iDiv);
});

socket.on('update_local_userlist', function(data){
    console.log(data);
  let userlist = document.getElementsByClassName("usernames");
  userlist[0].innerHTML = "";
  
  for( let i = 0; i < data.length; i++){

    var iDiv = document.createElement('div');
    iDiv.id = data[i].id;
    iDiv.innerHTML = data[i].name;
    userlist[0].appendChild(iDiv);
  }

});
// -----------------------------------------------------------------------------

function sendMessage(){
    var text = encodeHTML(document.getElementsByClassName("message_input")[0].value);
    document.getElementsByClassName("message_input")[0].value = "";

    if(text.replace(/\s/g, '') === "")       
        return;

    addToMessages(text, true);
    
    // Send to server
    socket.emit('clientMessage', text, username);
}

function sendMessageKey(event){
    if(event.keyCode == 13)
        sendMessage();
}

function submitKey(event){
    if(event.keyCode == 13)
        submit();
}

var username;
function submit(){
    username = encodeHTML(document.getElementsByClassName("message_input2")[0].value);

    if(username.replace(/\s/g, '') === "")       
        return;

    socket.emit('submitUsername', username);
    document.getElementsByClassName("start_page")[0].style.display = "none";
    document.getElementsByClassName("chat_window")[0].style.display = "block";
}

function addToMessages(message, mine) {
    var ul = document.getElementsByClassName("messages");
    var time = new Date().toLocaleTimeString('en-US', { hour12: false, 
                                             hour: "numeric", 
                                             minute: "numeric"});
    
    if(mine){
        ul[0].innerHTML += "<li class=\"message left appeared\"> <div class=\"avatar\"></div> <div class=\"text_wrapper\"> " + "<div class=\"time_text\" style=\"font-size: 15px; position: absolute;top: 2px;    left: 20px;\">" + time + " </div>" + 
        "<div class='myUsername'> <strong>" + username + "</strong> </div> <div class=\"text\">" + message + "</div> </div></li>";
    }
    else{
        ul[0].innerHTML += "<li class=\"message other appeared\"> <div class=\"avatar\"></div> <div class=\"text_wrapper\"> <div class=\"time_text\" style=\"font-size: 15px; position: absolute;top: 2px;    left: 20px;\">" + time +"</div>" + "<div class=\"text\">" + 
        message + "</div> </div></li>";
    }


    ul[0].scrollTo(100,ul[0].scrollHeight);  
}


if(username !== null && username !== undefined)
    socket.emit('submitUsername', username);


function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

var is_hidden = false;
function show_list(){
    
    if(is_hidden){
        document.getElementsByClassName("userlist")[0].style.display = "initial";
        document.getElementById("arrow").style.transform = "scaleX(1)";
    }
    else{
        document.getElementsByClassName("userlist")[0].style.display = "none";
        document.getElementById("arrow").style.transform = "scaleX(-1)";
    }
    
    is_hidden = !is_hidden;
}