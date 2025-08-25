const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('../config/config');
const swaggerDefinition = require('../docs/swaggerDef');

const dashboardRoutes = require('./smartandon/dashboard.route');
const qccMTypesRoutes = require('./smartandon/qccMTypes.route');
const lineRoutes = require('./smartandon/line.route');
const machineRoutes = require('./smartandon/machine.route');
const memberRoutes = require('./smartandon/member.route');
const machineStopInputRoutes = require('./smartandon/machineStopInput.route');
const problemRoutes = require('./smartandon/problem.route');
const oeeRoutes = require('./smartandon/OEE.route');
const mtbfmttrRoutes = require('./smartandon/mtbfmttr.route');
const realtimeParetoRoutes = require('./smartandon/realtimePareto.route');
const summaryRoutes = require('./smartandon/summary.route');
const cmFollowupRoutes = require('./smartandon/cmFollowup.route');
const downloadRoutes = require('./smartandon/download.route');
const authRoutes = require('./smartandon/auth.route');
const userRoutes = require('./smartandon/user.route');
const sparepartRoutes = require('./smartandon/spareparts.route');
const tambahAnalysis = require('./smartandon/tambahAnalysis.route');

const GaugeRoute = require('./qdc/Guage.route');
const CommonRoute = require('./qdc/Common.route');

const router = express.Router();

const smartAndonRoutes = [
  {
    path: '/dashboard',
    route: dashboardRoutes,
  },
  {
    path: '/qccMTypes',
    route: qccMTypesRoutes,
  },
  {
    path: '/line',
    route: lineRoutes,
  },
  {
    path: '/machine',
    route: machineRoutes,
  },
  {
    path: '/member',
    route: memberRoutes,
  },
  {
    path: '/machine-stop-input',
    route: machineStopInputRoutes,
  },
  {
    path: '/problem',
    route: problemRoutes,
  },
  {
    path: '/oee',
    route: oeeRoutes,
  },
  {
    path: '/mtbfmttr',
    route: mtbfmttrRoutes,
  },
  {
    path: '/realtime-pareto',
    route: realtimeParetoRoutes,
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
    path: '/download',
    route: downloadRoutes,
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
    path: '/sparepart',
    route: sparepartRoutes,
  },
  {
    path: '/tambahAnalysis',
    route: tambahAnalysis,
  },
];

const GaugeRoutes = [
  {
    path: '/gauge',
    route: GaugeRoute,
  },
  {
    path: '/common',
    route: CommonRoute,
  },
];

smartAndonRoutes.forEach((route) => {
  router.use(`/smartandon/${route.path}`, route.route);
});

GaugeRoutes.forEach((route) => {
  router.use(`/qdc/${route.path}`, route.route);
});

if (config.env === 'dev' || config.env === 'local') {
  const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: ['src/docs/*.yml', 'src/routes/**/*.route.js'],
  });
  router.use('/docs', swaggerUi.serve);
  router.get(
    '/docs',
    swaggerUi.setup(specs, {
      explorer: true,
    })
  );
}

module.exports = router;
