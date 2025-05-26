const express = require('express');
const router = express.Router();
const problemController = require('../../controllers/smartandon/problem.controller');

router.get('/problem', problemController.getProblem);

module.exports = router;
