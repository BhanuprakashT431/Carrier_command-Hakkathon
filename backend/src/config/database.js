'use strict';

const { PrismaClient } = require('@prisma/client');
const env = require('./env');

/**
 * Singleton Prisma client.
 * In test mode, a separate DB URL is used.
 */

let prismaInstance;

function getPrismaClient() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      datasources: {
        db: {
          url: env.isTest ? env.DATABASE_URL_TEST : env.DATABASE_URL,
        },
      },
      log: env.isDevelopment
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
    });
  }
  return prismaInstance;
}

const prisma = getPrismaClient();

module.exports = prisma;
