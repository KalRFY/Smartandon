const express = require('express');
const router = express.Router();
const kyMachineController = require('../../controllers/smartandon/kyMachine.controller');
const upload = require('../../middlewares/upload');

router.get('/ky-lines', kyMachineController.getLines);
router.get('/ky-machines', kyMachineController.getMachines);
router.get('/ky-data', kyMachineController.getKYMachineData);
router.get('/ky-colordash', kyMachineController.getColorDash);

router.post('/ky-add', upload.single('ilustration'), kyMachineController.addKY);
router.put('/ky-edit', upload.single('ilustration'), kyMachineController.editKY);
router.delete('/ky-delete/:id', kyMachineController.deleteKY);

module.exports = router;
