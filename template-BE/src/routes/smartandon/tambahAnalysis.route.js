const express = require('express');
const tambahAnalysisController = require('../../controllers/smartandon/tambahAnalysis.controller');

const router = express.Router();

router.get('/tambahAnalysis', tambahAnalysisController.getTambahAnalysis);

module.exports = router;
