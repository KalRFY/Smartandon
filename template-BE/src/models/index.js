/* eslint-disable global-require */
/* eslint-disable security/detect-non-literal-require */
/* eslint-disable import/no-dynamic-require */
const Sequelize = require('sequelize');
const { qdc_db } = require('../config/config');

const sequelize = new Sequelize(qdc_db.database, qdc_db.username, qdc_db.password, qdc_db);

const models = {
  sequelize,
  Sequelize,
/*define other in here*/
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
