const express = require('express');
const router = express.Router();
const machineController = require('../../controllers/smartandon/machine.controller');

router.get('/machine', machineController.getMachine);

module.exports = router;
