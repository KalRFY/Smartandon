const express = require('express');
const oeeController = require('../../controllers/smartandon/oee.controller');

const router = express.Router();

router.get('/oee', oeeController.getOEE);
router.get('/oeeDataSmartandon', oeeController.getOEESmartandon);
router.get('/oeeView', oeeController.getOEEView);
router.get('/oeeTarget', oeeController.getOEETarget);
router.get('/oeeActual', oeeController.getOEEActual);
router.get('/oeePlan', oeeController.getOEEPlan);

module.exports = router;
