const express = require('express');
const router = express.Router();
const problemController = require('../../controllers/smartandon/problem.controller');

router.get('/problem', problemController.getProblem);
router.get('/problemView', problemController.getProblemView);
router.get('/problemId/:fid', problemController.getProblemById);
router.get('/problemUpdate', problemController.getProblem);
router.put('/update', problemController.updateProblem);

module.exports = router;