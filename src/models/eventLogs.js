const mongoose = require('mongoose');

// chat eventLog Schema
const eventLogSchema = mongoose.Schema({
    
    ODid:{
        type: String
    },

    event:{
        type: String,
        required: true
    },

    user:{
        type: String,
        required: true
    },

    date:{
        type: Date,
        default: Date.now,
        required: true
    }
});

const eventLog = module.exports = mongoose.model('eventLog', eventLogSchema);

// Function to retrieve chat events that have happened on the server 
// and been recorded in the database.
module.exports.getMessageLog = ( username, limit, callback) => {
    eventLog.find({user: username},{_id: 0, __v: 0})
    .sort({'date': -1})
    .limit(limit)
    .exec(callback);
}

module.exports.addLoggedMessage = (chatData, callback) => {
    eventLog.create(chatData, callback);
}