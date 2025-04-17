const Sequelize = require('sequelize');
const { qdc_db, platform_db } = require('../config/config');

const qdc_sequelize = new Sequelize(qdc_db.database, qdc_db.username, qdc_db.password, qdc_db);

//https://github.com/tagomoris/presto-client-node
const presto = require('presto-client');
const prestoClient = new presto.Client(
    {   user: platform_db.username,host :platform_db.host,port:platform_db.port,
        basic_auth: {user: platform_db.username, password: platform_db.password} });
//https://github.com/tagomoris/presto-client-node
// const presto = require('presto-client');
// // const platform_presto = null;
// const platform_presto = new presto.Client(
//     {   user: platform_db.username,host :platform_db.host,port:platform_db.port,
//         basic_auth: {user: platform_db.username, password: platform_db.password} });

module.exports.GaugeService = require('./qdc/Gauge.service')(qdc_sequelize,Sequelize);
module.exports.CommonService = require('./qdc/Common.service')(qdc_sequelize,Sequelize);
/*define other in here*/