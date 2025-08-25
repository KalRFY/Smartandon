const express = require('express');
const machineStopInputController = require('../../controllers/smartandon/machineStopInput.controller');

const router = express.Router();

router.get('/machineStopInput', machineStopInputController.getMachineStopInput);
router.get('/problemNameSuggestions', machineStopInputController.getProblemNameSuggestions);
router.put('/problemMachine', machineStopInputController.putMachineStopInput);

module.exports = router;
