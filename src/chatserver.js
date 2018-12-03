const socketio = require('socket.io');

const chatLogs = require('./models/chatLogs.js');
const eventLogs = require('./models/eventLogs.js');

//Remember to remove before becoming reliant
const fs = require('fs');

const checkLogsDir = () => {
  if(!fs.existsSync('Logs')) {
    fs.mkdir('./Logs', (err) => {
      if (err) console.log('Failed to creater ./Logs directory')
    })
  }
}
let getRoom = (socket) => {
  for (let key in socket.rooms) {
      if (key != socket.id) {
        return key;
      }
  }
}

//New Code for Chat Logging
  const chatLogger = (data, socket) => {
    checkLogsDir();
    if (fs.existsSync('./Logs/Roomlog_Chat_'+ getRoom(socket) +'.txt'))
    {
      //||<<-->>||
      //To be removed after testing
      //Chat logging into a file
      const date = new Date();
      fs.appendFile('./Logs/Roomlog_Chat_'+ getRoom(socket) +'.txt', '"' + data + '","' + socket.username + '",' + date.toISOString() + '\n', function (err) {
        if (err) console.log(err);
        //console.log('Message Logged')
      });
      //||<<-->>||
    } else {
      fs.appendFile('./Logs/Roomlog_Chat_'+ getRoom(socket) +'.txt', 'MESSAGE,USER,DATE' + '\n', function (err) {
        if (err) throw err;
        const date = new Date();
      fs.appendFile('./Logs/Roomlog_Chat_'+ getRoom(socket) +'.txt', '"' + data + '","' + socket.username + '",' + date.toISOString() + '\n', function (err) {
        if (err) console.log(err);
        //console.log('Message Logged')
      });
      })
      
    }
  
}

const eventTextLogger = (data, socket) => {
  checkLogsDir();
  if (fs.existsSync('./Logs/Roomlog_Events.txt'))
  {
    //||<<-->>||
    //To be removed after testing
    //Chat logging into a file
    const date = new Date();
    fs.appendFile('./Logs/Roomlog_Events.txt', '"' + data + '","' + socket.username + '",' + date.toISOString() + '\n', function (err) {
      if (err) console.log(err);
      //console.log('Event Logged')
    });
    //||<<-->>||
  } else {
    fs.appendFile('./Logs/Roomlog_Events.txt', 'EVENT,USER,DATE' + '\n', function (err) {
      if (err) throw err;
      const date = new Date();
    fs.appendFile('./Logs/Roomlog_Events.txt', '"' + data + '","' + socket.username + '",' + date.toISOString() + '\n', function (err) {
      if (err) console.log(err);
      //console.log('Event Logged')
    });
    })
    
  }
}
const eventDBLogger = (socket, event) => {
eventLogs.addLoggedMessage({
  user: socket.username,
  event: event,
},function(err) {
  if(err) console.log(err)
  //console.log('Event logged to DB');
})
}

module.exports.listen = (http) => { //(http, session)
  const io = socketio.listen(http);

  let users = 0;

  

  let leaveRoom = (socket, cb) => {
    for (let key in socket.rooms) {
        if (key != socket.id) {
          socket.leave(key, () => {
           // eventLogger('Left: ' + key, socket)
            eventDBLogger(socket, 'Left: ' + key);
            console.log(socket.username + " left "+key);
            typeof cb === 'function' && cb(key);
          });
        }
    }
  }

  



  io.on('connection', (socket) => {
    let addedUser = false;

    socket.on('new message', (data) => {
      //chatLogger(data, socket);
      chatLogs.addLoggedMessage({
        user: socket.username,
        message: data,
        room: getRoom(socket)
      },function(err,data) {
        if(err) console.log(err)
        //console.log('message logged to DB');
      })
      socket.to(getRoom(socket)).emit('new message', {
        username: socket.username,
        message: data
      });
      console.log("sent to: "+getRoom(socket));
      
    });

    socket.on("join room", (room) => {
        leaveRoom(socket, () => {
            socket.join(room);
            const data = 
            //eventLogger('Joined: ' + room,socket)
            eventDBLogger(socket, 'Joined: ' + room);
            //console.log(socket.username + " joined "+ room);
        })
    });

    socket.on('add user', (username) => {
      if (addedUser) return;

      socket.username = username;
      ++users;
      addedUser = true;
      socket.join("default_room");

      socket.emit('login', {
        numUsers: users
      });

      socket.to(getRoom(socket)).emit('user joined', {
        username: socket.username,
        numUsers: users
      });
    });


    socket.on('typing', () => {
      socket.to(getRoom(socket)).emit('typing', {
        username: socket.username
      });
    });


    socket.on('stop typing', () => {
      socket.to(getRoom(socket)).emit('stop typing', {
        username: socket.username
      });
    });

    socket.on('disconnect', () => {
      if (addedUser) {
        --users;

        socket.to(getRoom(socket)).emit('user left', {
          username: socket.username,
          numUsers: users
        });
      }
    });
  });



  return io;
}