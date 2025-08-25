const express = require('express');
const userController = require('../../controllers/smartandon/user.controller');
const { authMiddleware } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', userController.defaultController);
router.get('/user', authMiddleware, userController.getCurrentUserController);

module.exports = router;
