const socketio = require('socket.io')

module.exports.listen = (http) => { //(http, session)
  const io = socketio.listen(http);

  let users = 0;

  let getRoom = (socket) => {
    for (let key in socket.rooms) {
        if (key != socket.id) {
          return key;
        }
    }
  }

  let leaveRoom = (socket, cb) => {
    for (let key in socket.rooms) {
        if (key != socket.id) {
          socket.leave(key, () => {
            console.log("left "+key);
            typeof cb === 'function' && cb(key);
          });
        }
    }
  }

  io.on('connection', (socket) => {
    let addedUser = false;

    socket.on('new message', (data) => {
      socket.to(getRoom(socket)).emit('new message', {
        username: socket.username,
        message: data
      });
      console.log("sent to: "+getRoom(socket));
    });

    socket.on("join room", (room) => {
        leaveRoom(socket, () => {
            socket.join("room"+room);
            console.log("joined room"+room);
        })
    });

    socket.on('add user', (username) => {
      if (addedUser) return;

      socket.username = username;
      ++users;
      addedUser = true;
      socket.join("room1");

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
