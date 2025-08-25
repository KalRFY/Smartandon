const express = require('express');

const router = express.Router();
const memberController = require('../../controllers/smartandon/member.controller');

router.get('/member', memberController.getMember);

module.exports = router;
