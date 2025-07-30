const express = require('express');
const router = express.Router();
const oeeController = require('../../controllers/smartandon/oee.controller');

router.get('/oee', oeeController.getOEE);
router.get('/oeeView', oeeController.getOEEView);
router.get('/oeeTarget', oeeController.getOEETarget);
router.get('/oeeActual', oeeController.getOEEActual);
router.get('/oeePlan', oeeController.getOEEPlan);

module.exports = router;