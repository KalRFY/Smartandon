const express = require('express');

const router = express.Router();
const MTBFMTTRController = require('../../controllers/smartandon/MTBFMTTR.controller');

router.get('/', MTBFMTTRController.defaultController);
router.get('/mtbf', MTBFMTTRController.getMTBFController);
router.get('/mttr', MTBFMTTRController.getMTTRController);
router.get('/mtbfmttr', MTBFMTTRController.getMtBFMTTRController);

module.exports = router;
