const chatMessage = document.querySelector('.chat-messages')
const chatForm = document.getElementById('chat-form');
const RoomName = document.getElementById('room-name');
const UserList = document.getElementById('users');

// Get username and chatroom from URL

const { username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});
const socket = io();

//Join chatroom
socket.emit('joinRoom', {username, room} );

//Get room and Users
socket.on('roomUsers', ({room, users}) =>{
    outputRoomName(room);
    outputUsers(users);
});

//message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll down function
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

//Message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //get message text
    const msg = e.target.elements.msg.value;
    // console.log(msg);
     //emit message to server
    socket.emit('chatMessage', msg); 

    // clear input field
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

// output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);

}

//Add RoomName to Dom
function outputRoomName(room) {
    RoomName.innerHTML = room;
    
}

//Add users to DOM
function outputUsers(users) {
    UserList.innerHTML=`
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
    
}