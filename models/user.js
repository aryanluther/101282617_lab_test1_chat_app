const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please Enter the Username'],
        trim: true,
        index: {unique: true},
        lowercase: true
    },
    firstname: {
        type: String,
        required: [true, 'Please enter the first name'],
        trim: true,
        lowercase: true
    },
    lastname: {
        type: String,
        required: [true, 'Please enter the last name'],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a unique password'],
        trim: true
    },
    date :{
        type : Date,
        default : Date.now
    }

})

const user = mongoose.model("user", userSchema);
module.exports = user;

