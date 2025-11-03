// const { Sequelize } = require('sequelize');

// const mariadbSequelize = new Sequelize('db_myopc_client', 'administrator', 'Toyota123456', {
//   host: '10.70.20.253',
//   port: 3306,
//   dialect: 'mariadb',
//   logging: false,
//   pool: {
//     max: 10,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// });

// module.exports = mariadbSequelize;

require('dotenv').config();
const { Sequelize } = require('sequelize');

const mariadbSequelize = new Sequelize(
  process.env.NAME_DB_NEW,
  process.env.USER_DB_NEW,
  process.env.PASSWORD_DB_NEW,
  {
    host: process.env.HOST_DB_NEW,
    port: process.env.DB_PORT || 3306,
    dialect: 'mariadb',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 10000,
    },
  }
);

module.exports = mariadbSequelize;