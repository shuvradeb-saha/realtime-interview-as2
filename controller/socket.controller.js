const Message = require('../model/message.model');
const User = require('../model/user.model');
const Room = require('../model/room.model');
module.exports = (server) => {
    const io = require("socket.io")(server);
    io.on('connection', (socket) => {

        function getStatus(userName) {
            io.of('/').in(userName).clients((error, clients) => {
                if (clients.length == 0) return 'inactive-user';
                return 'active-user';
            });
        }

        socket.on('create', function (room) {
            socket.userName = room.userName;
            console.log(room.room)
            socket.join(room.room);
            socket.join(socket.userName);
            let role = room.userRole;
            Room.findOne({
                _id: room.room
            }).then((data) => {
                console.log("Data: " + data);
                let setterStatus = getStatus(data.setterName);
                let candidateStatus = getStatus(data.candidateName);
                let collaboratorStatus = [];
                data.collaborator.forEach(function (c) {
                    collaboratorStatus.push({
                        name: c,
                        status: getStatus(c)
                    });
                })

                socket.emit('private', {
                    candidateName: data.candidateName,
                    setterName: data.setterName,
                    setterStatus: setterStatus,
                    candidateStatus: candidateStatus,
                    collaboratorStatus: collaboratorStatus
                });
            }).catch(err => {
                console.log("Error in Room: " + err);
            });

            io.of('/').in(socket.userName).clients((error, clients) => {
                if (error) {
                    console.log('Error: ' + error);
                }
                if (clients.length == 1) {
                    console.log('Client Joined: ' + socket.userName);
                    let rooms;
                    User.findOne({
                        userName: socket.userName
                    }, {
                        rooms: 1
                    }).then(data => {
                        rooms = data;
                        //console.log("Rooms: " + rooms);
                        rooms.rooms.forEach(function (room) {
                            console.log(room);
                            io.sockets.in(room).emit('user_has_become_online', {
                                userName: socket.userName,
                                userRole: role
                            });
                        })
                        //res.send(data);
                    }).catch(err => {
                        console.log("Error: " + err);
                    })

                }
            });
        });
        console.log('New user connected');
        socket.on('new_message', (data) => {
            const message = new Message({
                room: data.room,
                message: data.message,
                userName: data.userName,
                userRole: data.userRole
            });
            message.save();
            io.sockets.in(data.room).emit('new_message', data);
        })

        socket.on('result', function (data) {
            io.sockets.in(data.room).emit('result', data);
        });

        socket.on('disconnect', () => {

            console.log("Disconnect: " + socket.userName);
            io.of('/').in(socket.userName).clients((error, clients) => {
                if (error) throw error;
                console.log("Length: " + clients.length);
                if (clients.length == 0) {
                    console.log('Client Disconnected: ' + socket.userName);

                    let rooms;
                    User.findOne({
                        userName: socket.userName
                    }, {
                        rooms: 1
                    }).then(data => {
                        rooms = data;
                        //console.log("Rooms: " + rooms);
                        rooms.rooms.forEach(function (room) {
                            //  console.log(room);
                            io.sockets.in(room).emit('user_has_become_offline', {
                                userName: socket.userName
                            });
                        })
                        //res.send(data);
                    }).catch(err => {
                        console.log("Error: " + err);
                    })
                }
            });
        })

        //listen on typing
        // socket.on('typing', (data) => {
        //     socket.broadcast.emit('typing', {
        //         username: socket.username
        //     })
        // })
    })
};