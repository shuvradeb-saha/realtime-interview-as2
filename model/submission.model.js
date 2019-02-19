const mongoose = require('mongoose');

const SubmisssionSchema = mongoose.Schema({
    submissionStatus: String,
    roomId: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('SubmisssionSchema', SubmisssionSchema);