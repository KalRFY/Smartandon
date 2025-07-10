const express = require('express');
const router = express.Router();
const oeeController = require('../../controllers/smartandon/oee.controller');

router.get('/oee', oeeController.getOEE);
router.get('/oeeView', oeeController.getOEEView);

module.exports = router;
