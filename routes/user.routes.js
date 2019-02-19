module.exports = (app) => {
    const users = require('../controller/user.controller');

    app.post('/users', users.create);
    app.get('/users', users.findAll);
    app.get('/users/:userName', users.findOne);
    app.post('/admin/home', users.login);
    app.get('/logout', users.logout);
    app.get('/admin/home', users.renderAdminHome);

    app.put('/users/:userName/rooms', users.addRoomToUser);
    app.get('/users/:userName/rooms', users.getAllRoomsByUser);

    app.get('/', (req, res) => {
        res.render("login");
    });

    app.get('/register', (req, res) => {
        res.render("register");
    });

}