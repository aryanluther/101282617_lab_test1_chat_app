const express = require("express");
const userModel = require('../models/user');
const bodyParser = require("body-parser");
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app)
const io = socketio(server)





app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))


app.get('/', async (req, res) =>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('signup.html')
})

app.post('/signup', async (req,res) =>{

    console.log(req.body)
    const user = new userModel(req.body);

    if (!username || typeof username !== 'string'){
        return res.json({status: 'error', error: 'Invalid username'})
    }

    try{
        await user.save((err) =>{
            if(err){
                res.send(err)
            }else{
                res.send(user)
            }
        });
    }catch(err) {
        if(err.code = 11000){
            return res.json({status:'error', error: "Username already in use" })
        }
        res.status(500);
        res.send(err);
    }
    return res.redirect('login.html')
})

app.post('/login', async(req,res) =>{
    try{
        const { username, password } = req.body
        const user = await userModel.findOne({username, password})
        if(!user){
            return res.json({status: 'error', error:'Invalid username/password'})
        }else{
            return res.json({status: 'ok'})
        }
    }catch(err){
        res.status(500).send(err)
    }
    return res.redirect('chat.html')
})

app.get('/login', async (req, res) =>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('login.html')
})


module.exports = app; 