const express = require('express');
const docsRoute = require('./docs.route');
const config = require('../config/config');

const PORT = 5432;
const dashboardRoutes = require('./smartandon/dashboard');
const qccMTypesRoutes = require('./smartandon/qccMTypes');
const lineRoutes = require('./smartandon/line');
const machineRoutes = require('./smartandon/machine');
const problemRoutes = require('./smartandon/problem');
const mtbfmttrRoutes = require('./smartandon/mtbfmttr');
const realtimeParetoRoutes = require('./smartandon/realtimePareto');


const GaugeRoute = require('./qdc/Guage.route');
const CommonRoute = require('./qdc/Common.route');

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
    path: '/realtime-pareto',
    route: realtimeParetoRoutes,
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
if (config.env === 'dev' || config.env === 'local' ) {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
