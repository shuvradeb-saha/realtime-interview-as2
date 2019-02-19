const express = require('express');
const bodyParser = require('body-parser');
let session = require('express-session');
const app = express();
let morgan = require('morgan');


app.use(session({
    secret: 'ssshhhhh'
}));
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static('static'));
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.use(morgan("combined"));

const dbConfig = require('./config/database.config');
const mongoose = require('mongoose');


mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./routes/user.routes')(app);
require('./routes/problem.routes')(app);
require('./routes/room.routes')(app);

server = app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
require('./controller/socket.controller')(server)
