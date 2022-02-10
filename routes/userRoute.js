const express = require("express");
const userModel = require('../models/user');
const messageModel = require('../models/message')
const bodyParser = require("body-parser");
const path = require('path');
const sep = path.sep;

const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(`public${sep}index.html`))
})

app.get('/signup', (req, res) => {
    res.sendFile(path.resolve(`public${sep}signup.html`))
})
app.post('/signup', async (req,res) =>{

    console.log(req.body)
    const user = new userModel(req.body);

    try{
        await user.save((err) =>{
            if(err){
                res.send(err)
            }else{
                res.send(user)
                res.save(user)
            }
        });
    }catch (err) {
        if(err.code = 11000){
            return res.json({status:'error', error: "Username already in use" })
        }
        res.status(500);
        res.send(err);
    }
    return res.redirect('http://localhost:3000')
})

app.post('/login', async(req,res) =>{
    try{
        const { username, password } = req.body
        const user = await userModel.findOne({username, password})
        if(!user){
            return res.json({status: 'error', error:'Invalid username/password'})
        }else{
            return res.redirect(`http://localhost:3000/roomchat`)
        }
    }catch(err){
        res.status(500).send(err)
    }
})

app.get('/login', (req, res) => {
    res.sendFile(path.resolve(`public${sep}login.html`))
})

app.get('/roomchat', (req, res) => {
    res.sendFile(path.resolve(`public${sep}roomchat.html`))
})

// -- SOCKET IO --
io.on('connection', (socket) => {
    console.log('Connected: ' + socket.id)

    socket.on('joinRoom', (data) => {
        socket.join(data.room)
        socket.broadcast.to(data.room).emit('newMsg', `${data.username} has joined room: ${data.room}.`)
    })

    socket.on('leaveRoom', (data) => {
        socket.leave(data.room)
        socket.broadcast.to(data.room).emit('newMsg', `${data.username} has left room: ${data.room}.`)
    })

    socket.on('sendMsg', async (messageData) => {

        const msg = new messageModel()
        let newDate = new Date()
        msg.from_user = messageData.username
        msg.room = messageData.room
        msg.message = messageData.message
        msg.date_sent = newDate.toLocaleString('en-US')
        
        await msg.save()

        let clientMsg = `${newDate.toLocaleTimeString()} - ${messageData.username}: ${messageData.message}`

        socket.broadcast.to(messageData.room).emit('newMsg', clientMsg)
    })

    socket.on('typing', (data) => {
        socket.broadcast.to(data.room).emit('getTyping', data.status)
    })

    socket.on('disconnect', () => {
        console.log('Disconnected')
    })
    
})

module.exports = app; 