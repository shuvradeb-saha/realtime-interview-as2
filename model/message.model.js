const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    message: String,
    userName: String,
    userRole: String,
    room: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);