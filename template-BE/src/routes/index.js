const express = require('express');
const docsRoute = require('./docs.route');
const config = require('../config/config');

const dashboardRoutes = require('./smartandon/dashboard');
const qccMTypesRoutes = require('./smartandon/qccMTypes');
const lineRoutes = require('./smartandon/line');
const machineRoutes = require('./smartandon/machine');
const memberRoutes = require('./smartandon/member');
const machineStopInputRoutes = require('./smartandon/machineStopInput.controller');

const problemRoutes = require('./smartandon/problem');
const oeeRoutes = require('./smartandon/OEE');
const mtbfmttrRoutes = require('./smartandon/mtbfmttr');
const realtimeParetoRoutes = require('./smartandon/realtimePareto');
const summaryRoutes = require('./smartandon/summary');
const cmFollowupRoutes = require('./smartandon/cmFollowup');
const downloadRoutes = require('./smartandon/download.route');

const tambahAnalysis = require('./smartandon/tambahAnalysis');

const authRoutes = require('./smartandon/auth');
const userRoutes = require('./smartandon/user');

const GaugeRoute = require('./qdc/Guage.route');
const CommonRoute = require('./qdc/Common.route');
const { path } = require('../app');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/gauge',
    route: GaugeRoute,
  },
  {
    path: '/common',
    route: CommonRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoutes,
  },
  {
    path: '/smartandon',
    route: qccMTypesRoutes,
  },
  {
    path: '/smartandon',
    route: lineRoutes,
  },
  {
    path: '/smartandon',
    route: machineRoutes,
  },
  {
    path: '/smartandon',
    route: problemRoutes,
  },
  {
    path: '/smartandon',
    route: downloadRoutes,
  },
  {
    path: '/realtime-pareto',
    route: realtimeParetoRoutes,
  },
  {
    path: '/mtbfmttr',
    route: mtbfmttrRoutes,
  },
  {
    path: '/smartandon',
    route: oeeRoutes,
  },
  {
    path: '/smartandon',
    route: memberRoutes,
  },
  {
    path: '/summary',
    route: summaryRoutes,
  },
  {
    path: '/cm-followup',
    route: cmFollowupRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/smartandon',
    route: machineStopInputRoutes,
  },
  {
    path: '/smartandon',
    route: tambahAnalysis,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'dev' || config.env === 'local') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
