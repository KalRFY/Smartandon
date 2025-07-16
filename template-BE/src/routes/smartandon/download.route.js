const express = require('express');
const downloadController = require('../../controllers/smartandon/download.controller');

const router = express.Router();

router.get('/download-report', downloadController.downloadReport);

module.exports = router;
