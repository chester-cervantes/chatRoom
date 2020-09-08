const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById("room-name");
const roomUsers = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    scrollDown();
});

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputRoomUsers(users);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);

    clearInput(e);
});


function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function scrollDown() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearInput (e) {
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputRoomUsers(users) {
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        roomUsers.appendChild(li);
    });
}

