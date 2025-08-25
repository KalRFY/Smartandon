const express = require('express');
const sparepartsController = require('../../controllers/smartandon/sparepart.controller');

const router = express.Router();

router.get('/spareparts', sparepartsController.getSpareparts);

module.exports = router;
