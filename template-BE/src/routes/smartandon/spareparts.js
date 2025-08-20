const express = require('express');
const router = express.Router();
const sparepartsController = require('../../controllers/smartandon/sparepart.controller');

router.get('/spareparts', sparepartsController.getSpareparts);

module.exports = router;