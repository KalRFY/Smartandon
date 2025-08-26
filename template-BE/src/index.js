const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { connectToMySQL } = require('./config/mysql');
const { connectToMariaDB } = require('./config/mariadb');
const { connectToPostgres } = require('./config/postgres');

const startServer = async () => {
  try {
    // Test database connection
    await connectToMySQL();
    await connectToPostgres();
    // await connectToMariaDB();

    // Sync models
    // logger.info('Syncing database models...');
    // await sequelize.sync({ alter: true });
    // logger.info('Database models synced successfully.');

    // Seed initial data
    // await seedDashboardData();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Listening on port ${config.port}`);
    });

    // Graceful shutdown
    const shutdown = (code = 1) => {
      if (server.close) {
        server.close(() => {
          logger.info('Server closed');
          process.exit(code);
        });
      } else {
        process.exit(code);
      }
    };

    // Handle errors
    const handleUnexpectedError = (error) => {
      logger.error(error);
      shutdown(1);
    };

    process.on('uncaughtException', handleUnexpectedError);
    process.on('unhandledRejection', handleUnexpectedError);

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received');
      shutdown(0);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
