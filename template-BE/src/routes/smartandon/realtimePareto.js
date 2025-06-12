const express = require('express');
const router = express.Router();
const realtimeParetoController = require('../../controllers/smartandon/realtimePareto.controller');
router.get('/', realtimeParetoController.defaultController);
module.exports = router;
