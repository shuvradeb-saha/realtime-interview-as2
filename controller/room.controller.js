const Room = require('../model/room.model');
const Problem = require('../model/problem.model');
const Message = require('../model/message.model');
const Submission = require('../model/submission.model');
const Client = require('node-rest-client').Client;

exports.createRoom = (req, res) => {
    const room = new Room({
        roomName: req.body.roomName,
        problemTitle: req.body.problemTitle, //-----------
        problemId: req.body._id,
        setterName: req.params.userName
    });
    room.save()
        .then(roomData => {
            res.send(roomData);
            console.log("Room Created: " + roomData);
        }).catch(err => {
            res.status(400).send({
                message: err.message || "Some error occurred while creating the Room."
            });
        });
};

exports.showAllRooms = (req, res) => {
    console.log("user name ==== " + req.session.userName);
    Room.find({
            setterName: req.params.userName
        })
        .then(rooms => {
            // res.send(rooms);
            res.render("view-rooms", {
                rooms: rooms,
                userName: req.session.userName
            });
        }).catch(err => {

        });

};

exports.goToRoom = (req, res) => {
    // console.log("Params: " + req.query.room);
    // var roomProblem;
    console.log("roo m  :" + req.query.room);
    Room.findOne({
            _id: req.query.room
        })
        .then(room => {
            // console.log('Room: ' + room);

            Problem.findOne({
                    _id: room.problemId,
                    status: true
                })
                .then(problem => {
                    // console.log("Problem: " + problem);
                    res.render("welcome", {
                        problem: problem,
                        userName: req.session.userName,
                        role: req.session.role
                    });
                }).catch(() => {
                    res.status(404).send({
                        message: "Problem has been deleted for this room."
                    })
                });
        }).catch(() => {
            res.status(404).send({
                message: "Room not found."
            })
        })




};

exports.getResult = (req, res) => {
    console.log("ID " + req.body._id + " source " + req.body.sourceCode)
    Problem.findOne({
        _id: req.body._id,
        status: true
    }).then(problem => {
        console.log(problem._id + " ... " + problem.problemTitle);
        var client = new Client();

        var args = {
            data: {
                "source_code": req.body.sourceCode,
                "language_id": 29,
                "expected_output": Buffer.from(problem.output).toString('base64'),
                "stdin": Buffer.from(problem.input).toString('base64'),
                "cpu_time_limit": problem.timeLimit
            },
            headers: {
                "Content-Type": "application/json"
            }

        };
        const url = "https://api.judge0.com/submissions";
        console.log("URL ");
        client.post(url + "?base64_encoded=true", args, function (data, response) {
            // parsed response body as js object
            console.log("Data: " + data + " " + JSON.stringify(data));
            console.log("RESP: " + response);

            setTimeout(function () {

                client.get(url + "/" + data.token, function (data, response) {
                    // parsed response body as js object
                    console.log("GET DATA " + JSON.stringify(data));
                    // raw response
                    console.log("RESP GET DATA" + response);
                    res.status(201).send(data);
                });



            }, 2000)
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).send('Sorry. The compiler has faced an error')
    })
};

exports.getAllMessages = (req, res) => {
    console.log("room ------ " + req.params.id);
    Message.find({
            room: req.params.id
        }).sort({
            createdAt: -1
        })
        .then(messages => {
            res.send(messages);
        }).catch(err => {
            console.log(err);
        });
};

exports.addUserToRoom = (req, res) => {
    let objectForUpdate;

    if (req.body.collaborator) {
        objectForUpdate = {
            $addToSet: {
                collaborator: req.body.collaborator
            }
        };
        updateUserInRoom(req, res, objectForUpdate);
    }
    if (req.body.candidate) {
        Room.findOne({
            _id: req.params.id
        }, {
            status: 1
        }).then((data) => {
            console.log(data.status);
            if (data.status == "No Candidate Found") {
                objectForUpdate = {
                    candidateName: req.body.candidate,
                    status: "progress"
                };
                updateUserInRoom(req, res, objectForUpdate);
            } else {
                res.status(400).send("candidate already exists");
            }
        }).catch(err => {
            res.send(err);
        });
    }
};

function updateUserInRoom(req, res, objectForUpdate) {
    Room.updateOne({
        _id: req.params.id
    }, objectForUpdate).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(400).send(err);
    });
}

exports.getUsersFromRoom = (req, res) => {
    Room.findOne({
            _id: req.params.id
        },
        req.query
    ).
    then(data => {
        res.send(data);
    }).catch(err => {
        res.status(400).send(err);
    });
};

exports.addSubmission = (req, res) => {
    var submission = new Submission({
        submissionStatus: req.body.submissionStatus,
        roomId: req.params.id
    });

    submission.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(400).send(err);
    });
};

exports.getSubmissions = (req, res) => {
    Submission.find({
        roomId: req.params.id
    }).sort({
        createdAt: -1
    }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(400).send(err);
    })
};