const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
    roomName: String,
    collaborator: [{
        type: String,
    }],
    candidateName: String,
    problemTitle: String,
    problemId: {
        type: String,
        required: true
    },
    setterName: String,
    status: {
        type: String,
        default: "No Candidate Found"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema);