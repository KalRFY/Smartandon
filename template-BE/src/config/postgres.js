/* eslint-disable no-console */
const { Sequelize } = require('sequelize');
const config = require('./config');
const logger = require('./logger');

const env = process.env.NODE_ENV || 'dev';
const dbConfig = config.postgres;

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  pool: dbConfig.pool,
  logging: env === 'dev' ? console.log : false,
});

const connectToPostgres = async () => {
  try {
    logger.info('Testing Postgres database connection...');
    await sequelize.authenticate();
    logger.info('Postgres Database connection established successfully ✅');
  } catch (error) {
    logger.error('Unable to connect to the Postgres database ❌:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectToPostgres,
};
