const express = require('express');
const docsRoute = require('./docs.route');
const config = require('../config/config');

const PORT = 5432;

const dashboardRoutes = require('./routes/smartandon/dashboard')
const mtbfmttrRoutes = require('./routes/smartandon/mtbfmttr')

const GaugeRoute = require('./qdc/Guage.route');
const CommonRoute = require('./qdc/Common.route');
/*define const other in here*/

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
  //===//

/*define other in here*/
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
