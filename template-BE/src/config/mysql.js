/* eslint-disable no-console */
const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('./logger');

const env = process.env.NODE_ENV || 'dev';
const dbConfig = config.qdc_db;

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  logging: env === 'dev' ? console.log : false,
});

const connectToMySQL = async () => {
  try {
    logger.info('Testing MySQL database connection...');
    await sequelize.authenticate();
    logger.info('MySQL Database connection established successfully ✅');
  } catch (error) {
    logger.error('Unable to connect to the MySQL database ❌:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectToMySQL,
};
