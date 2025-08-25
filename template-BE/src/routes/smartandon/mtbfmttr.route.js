const express = require('express');
const MTBFMTTRController = require('../../controllers/smartandon/MTBFMTTR.controller');
const { authMiddleware } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, MTBFMTTRController.defaultController);
router.get('/mtbf', MTBFMTTRController.getMTBFController);
router.get('/mttr', MTBFMTTRController.getMTTRController);
router.get('/mtbfmttr', MTBFMTTRController.getMtBFMTTRController);
module.exports = router;
