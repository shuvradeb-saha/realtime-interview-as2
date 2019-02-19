const User = require('../model/user.model');
const Problem = require('../model/problem.model');


exports.create = (req, res) => {
    if (!req.body.userName) {
        return res.status(400).send({
            message: "User Name can not be empty"
        });
    }
    const user = new User({
        fullName: req.body.fullName,
        userName: req.body.userName,
        password: req.body.password,
        role: req.body.userRole
    });

    user.save()
        .then(data => {
            res.redirect('/');
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note."
            });
        });
};

exports.findAll = (req, res) => {
    User.find()
        .then(user => {
            res.send(user);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.findOne = (req, res) => {
    console.log('User name ' + req.params.userName);
    if (!req.params.userName) {
        console.log("Not found");
    }
    User.findOne({
            'userName': req.params.userName
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "Note not found with user name " + req.params.userName
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userName
                });
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + req.params.userName
            });
        });
};

exports.login = (req, res) => {
    if (!req.body.userName) {
        return res.status(400).send({
            message: "Enter all info correctly"
        });
    }
    User.findOne({
            'userName': req.body.userName
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with user name " + req.body.userName
                });
            }
            console.log(req.body.password + "user = " + user.password);
            if (user.password !== req.body.password) {
                console.log("error ");
                res.send("error ");
            } else {

                if (user.role == "admin") {
                    console.log("userName: " + user.userName);
                    var sess = req.session;
                    sess.userName = user.userName;
                    sess.role = user.role;
                    res.redirect('/admin/home');
                } else {
                    var sess = req.session;
                    sess.userName = user.userName;
                    sess.role = user.role;
                    res.render("candidate", {
                        data: req.session
                    });
                }
            }
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.body.userName
                });
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + req.body.userName
            });
        });

};

exports.renderAdminHome = (req, res) => {
    console.log("admin home" + req.session.userName);
    Problem.find({
            setterName: req.session.userName,
            status: true
        }, {
            problemTitle: 1
        })
        .then(problem => {
            console.log("problems : " + problem);
            res.render("admin", {
                userName: req.session.userName,
                problems: problem
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

exports.getAllRoomsByUser = (req, res) => {
    User.find({
        userName: req.params.userName
    }, {
        rooms: 1
    }).
    then(data => {
        res.send(data);
    }).catch(err => {
        res.status(400).send(err);
    });
};

exports.addRoomToUser = (req, res) => {
    User.updateOne({
        userName: req.params.userName
    }, {
        $addToSet: {
            rooms: req.body.roomId
        }
    }).then(() => {
        res.send("Room Added");
    }).catch(err => {
        res.status(400).send(err);
    });
};

exports.logout = (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
};