const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from_user: {
        type: String
    },
    room: {
        type: String
    },
    message: {
        type: String,
    },
    date :{
        type : Date,
        default : Date.now
    }
})

const msg = mongoose.model("msg", messageSchema);
module.exports = msg;

