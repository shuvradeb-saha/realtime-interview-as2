const Problem = require('../model/problem.model');

exports.createProblem = (req, res) => {
    const problem = extractProblem(req, res);
    problem.save()
        .then(data => {
            return res.redirect("/admin/home?success");
        }).catch(err => {
            res.status(400).send({
                message: err.message || "Some error occurred while creating the Problem."
            });
        });
};

exports.findAllProblem = (req, res) => {
    Problem.find()
        .then(problem => {

            res.send(problem);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

exports.getProblemToEdit = (req, res) => {
    Problem.findOne({
        _id: req.params.problemId,
        setterName: req.params.userName,
        status: true
    }, {
        input: 0,
        output: 0
    }).
    then(
        problem => {
            //console.log("problem == "+problem)
            res.render("view-problem", {
                problem: problem
            });
        }
    ).catch(
        err => {
            return res.status(404).send({
                message: "problem not found with id " + req.params.problemId
            });
        }
    );
};

exports.editProblem = (req, res) => {
    const problem = extractProblem(req, res);
    console.log("BODY: " + problem + " " + req.params.problemId);
    problem._id = req.params.problemId;
    console.log("Now: " + problem);

    Problem.findOneAndUpdate({
            _id: req.params.problemId
        }, problem)
        .then((data) => {
            console.log("updated = " + data);

            res.status(201).send("Problem has been Updated");
        }).catch(err => {
            console.log(err);
        });

};


function extractProblem(req, res) {
    const problem = new Problem({
        problemTitle: req.body.problemTitle,
        timeLimit: req.body.timeLimit,
        memoryLimit: req.body.memoryLimit,
        problemDetails: req.body.problemDetails,
        sampleInput: req.body.sampleInput,
        sampleOutput: req.body.sampleOutput,
        input: req.body.input,
        output: req.body.output,
        setterName: req.body.setterName
    });

    return problem;
}




exports.getProblem = (req, res) => {
    var short = req.query.short || false;
    if (!short) {
        getFullProblem(req, res);
    } else {
        getShortedProblem(req, res);
    }
};

function getShortedProblem(req, res) {
    Problem.findOne({
        _id: req.params.problemId,
        setterName: req.params.userName,
        status: true
    }, {
        input: 0,
        output: 0
    }).
    then(
        problem => {
            //console.log("problem == "+problem)
            res.render("view-problem", {
                problem: problem
            });
            // res.send(problem);
        }
    ).catch(
        err => {
            return res.status(404).send({
                message: "problem not found with id " + req.params.problemId
            });
        }
    );

}

function getFullProblem(req, res) {
    Problem.findOne({
        _id: req.params.problemId,
        setterName: req.params.userName,
        status: true
    }).
    then(
        problem => {
            console.log("problem == " + problem)
            // res.render("viewProblem",{problem:problem});
            res.send(problem);
        }
    ).catch(
        err => {
            return res.status(404).send({
                message: "problem not found with id " + req.params.problemId
            });
        }
    );

}