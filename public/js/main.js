const client = io()

var cookieArray = document.cookie.split('=')
document.getElementById('username').value = cookieArray[1]
client.on('newMsg', (newMessage) => {
    printMsg(newMessage)
})

function joinRoom () {
    var currentUser = document.getElementById('username').value
    var currentRoom = document.getElementById('room').value

    tempData = {
        room: currentRoom,
        username: currentUser 
    }

    client.emit('joinRoom', tempData)
    printMsg(`${currentUser} has joined room: ${currentRoom}.`)
}

function leaveRoom () {
    var currentUser = document.getElementById('username').value
    var currentRoom = document.getElementById('room').value

    tempData = {
        room: currentRoom,
        username: currentUser
    }

        client.emit('leaveRoom', tempData)
        printMsg(`${currentUser} has left room: ${currentRoom}.`)
    }

function sendMsg() {
    var currentUser = document.getElementById('username').value
    var currentMsg = document.getElementById('msg').value
    var currentRoom = document.getElementById('room').value
            
    tempMsg = {
        username: currentUser,
        room: currentRoom,
        message: currentMsg
    }
            
    client.emit('sendMsg', tempMsg)
    printMsg(`${new Date().toLocaleTimeString()} - ${currentUser}: ${currentMsg}`)
    document.getElementById('msg').value = ""
}

function printMsg (newMessage) {
    document.getElementById('messageBox').innerHTML += '<div>' + newMessage + '</div>'
}

function logout() {
    document.cookie = "username=;"
    window.location.replace("http://localhost:3000");
}

client.on('getTyping', (status) => {
    if (status == true) {
        document.getElementById('typing').style.visibility = "visible"
    } else {
        document.getElementById('typing').style.visibility = "hidden"
    }
}) 

function typing (typingStatus) {
    var currentRoom = document.getElementById('room').value
    client.emit('typing', {room: currentRoom, status: typingStatus})
}
