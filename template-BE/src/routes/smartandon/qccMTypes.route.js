const express = require('express');
const qccMTypesController = require('../../controllers/smartandon/qccMTypes.controller');

const router = express.Router();

router.get('/qcc-m-types', qccMTypesController.getQccMTypes);

module.exports = router;
