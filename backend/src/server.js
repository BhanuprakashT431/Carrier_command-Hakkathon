'use strict';

const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/database');
const logger = require('./utils/logger');

let server;

async function start() {
  try {
    // Verify DB connection before starting
    await prisma.$connect();
    logger.info('Database connected');

    server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`Demo mode: ${env.DEMO_MODE}`);
      logger.info(`AI provider: ${getActiveProvider()}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
}

async function shutdown() {
  logger.info('Shutting down gracefully...');
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Server and database connections closed');
      process.exit(0);
    });
  } else {
    await prisma.$disconnect();
    process.exit(0);
  }
}

function getActiveProvider() {
  if (env.DEMO_MODE) return 'demo (synthetic data)';
  if (env.GEMINI_API_KEY) return 'gemini';
  if (env.OPENAI_API_KEY) return 'openai';
  return 'demo (no API keys configured)';
}

start();
