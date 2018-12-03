const mongoose = require('mongoose');

// chatLog Schema
const chatLogSchema = mongoose.Schema({
    
    ODid:{
        type: String
    },

    message:{
        type: String,
        required: true
    },

    user:{
        type: String,
        required: true
    },
    room:{
        type: String,
        require: true
    },

    date:{
        type: Date,
        default: Date.now,
        required: true
    }
});

const chatLog = module.exports = mongoose.model('chatLog', chatLogSchema);

module.exports.getMessageLog = (chatroom, limit, callback) => {
    chatLog.find({room: chatroom},{_id: 0, __v: 0})
    .sort({'date': -1})
    .limit(limit)
    .exec(callback);
}

module.exports.addLoggedMessage = (chatData, callback) => {
    chatLog.create(chatData, callback);
}