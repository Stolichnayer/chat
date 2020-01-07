const socket = io.connect();


function sendMessage(){
    var text = document.getElementsByClassName("message_input")[0].value;
    document.getElementsByClassName("message_input")[0].value = "";

    if(text.replace(/\s/g, '') == "")       
        return;

    addToMessages(text, true);
    
    // Send to server
    socket.emit('clientMessage', text);
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
    username = document.getElementsByClassName("message_input2")[0].value;

    if(username.replace(/\s/g, '') == "")       
        return;

    socket.emit('submitUsername', username);
    document.getElementsByClassName("start_page")[0].style.display = "none";
    document.getElementsByClassName("chat_window")[0].style.display = "block";
}

function addToMessages(message, mine) {
    var ul = document.getElementsByClassName("messages");

    if(mine){
        ul[0].innerHTML += "<li class=\"message left appeared\"> <div class=\"avatar\"></div> <div class=\"text_wrapper\"> " + 
        "<div class='myUsername'> <strong>" + username + "</strong> </div> <div class=\"text\">" + message + "</div> </div></li>";
    }
    else{
        ul[0].innerHTML += "<li class=\"message other appeared\"> <div class=\"avatar\"></div> <div class=\"text_wrapper\"> <div class=\"text\">" + 
        message + "</div> </div></li>";
    }


    ul[0].scrollTo(100,ul[0].scrollHeight);  
}

socket.on('serverMessage', (message) => {
    addToMessages(message, false);
});

socket.on('update_online_users', function(online_users){
    document.getElementById("num_users").innerHTML = online_users;
});