module.exports = (app) => {

    const problems = require('../controller/problem.controller');

    app.get('/problems', problems.findAllProblem);
    app.post('/admin/:userName/problems', problems.createProblem);
    app.get('/admin/:userName/problems/:problemId', problems.getProblem);
    app.put('/admin/:userName/problems/:problemId', problems.editProblem);

}