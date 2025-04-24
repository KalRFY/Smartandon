const express = require('express');
const routes = express.Router();
const dashboardController = require('../../controllers/smartandon/dashboard.controller');

routes.get('/data', dashboardController.getDashboardData);

module.exports = routes;
