/* eslint-disable global-require */
/* eslint-disable security/detect-non-literal-require */
/* eslint-disable import/no-dynamic-require */

const Sequelize = require('sequelize');
const { qdc_pg_db, qdc_db } = require('../config/config');

// PostgreSQL connection (commented out)
// const sequelize = new Sequelize(qdc_pg_db.database, qdc_pg_db.username, qdc_pg_db.password, qdc_pg_db);

// MySQL connection
const sequelize = new Sequelize(qdc_db.database, qdc_db.username, qdc_db.password, qdc_db);

const QccMTypes = require('./QccMTypes')(sequelize);
const newMachineInput = require('./newMachineInput')(sequelize);

const models = {
  sequelize,
  Sequelize,
  QccMTypes,
  newMachineInput,
  // define other models here
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;

