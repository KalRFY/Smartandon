const express = require('express');
const machineController = require('../../controllers/smartandon/machine.controller');

const router = express.Router();

router.get('/machine', machineController.getMachine);

module.exports = router;
