module.exports = (app) => {
    const rooms = require('../controller/room.controller');

    app.post('/admin/:userName/rooms', rooms.createRoom);
    app.get('/admin/:userName/rooms', rooms.showAllRooms);
    app.get('/room', rooms.goToRoom);
    app.post('/submission', rooms.getResult);
    app.get('/room/:id/messages', rooms.getAllMessages);
    app.put('/room/:id', rooms.addUserToRoom);
    app.get('/room/:id/users', rooms.getUsersFromRoom);
    app.post('/room/:id/submissions', rooms.addSubmission);
    app.get('/room/:id/submissions', rooms.getSubmissions);
}