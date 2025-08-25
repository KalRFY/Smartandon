const express = require('express');
const lineController = require('../../controllers/smartandon/line.controller');

const router = express.Router();

router.get('/line', lineController.getLine);

module.exports = router;
