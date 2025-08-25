const express = require('express');
const summaryController = require('../../controllers/smartandon/summary.controller');

const router = express.Router();

router.get('/ltb-summary', summaryController.getLTBSummary);

module.exports = router;
