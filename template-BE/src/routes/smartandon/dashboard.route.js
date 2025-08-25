const express = require('express');

const router = express.Router();
const dashboardController = require('../../controllers/smartandon/dashboard.controller');

router.get('/', dashboardController.defaultController);
router.get('/data', dashboardController.getDashboardData);
router.post('/machine-stop-input', dashboardController.saveMachineStopInput);

module.exports = router;
