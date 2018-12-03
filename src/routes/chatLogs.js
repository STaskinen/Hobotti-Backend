const express = require('express');
const chatLogs = express.Router();


const DBchatLogs = require('../models/chatLogs.js');
const DBeventLogs = require('../models/eventLogs.js');

const verifyToken = require('../auth/VerifyToken.js');

chatLogs.get('/chat/:roomname', verifyToken, (req, res, next) => {
    let limit;
    if (!req.query.log_size) { limit = 20} 
    else {limit = parseInt(req.query.log_size)};
    DBchatLogs.getMessageLog(req.params.roomname, limit, (err, logs) => {
        if (err) res.status(500).send({ message: "Something went wrong while searching the logs. Please try again later."});
        else if (logs.length == 0) res.status(404).send({ message: "No messages found in the logs of the provided chatroom. Check if you provided the name of the right chatroom."});
        else res.status(200).send(logs);
    })
})

chatLogs.get('/events/:username', verifyToken, (req, res, next) => {
    let limit;
    if (!req.query.log_size) { limit = 20} 
    else {limit = parseInt(req.query.log_size)};
    DBeventLogs.getMessageLog(req.params.username, limit, (err, logs) => {
        if (err) res.status(500).send({message: "Something went wrong while searching the logs. Please try again later."});
        else if ( logs.length == 0) res.status(404).send({ message: "No events found in the logs for the provided user. Check that you provided the right username."});
        else res.status(200).send(logs);
    })
})

module.exports = chatLogs;