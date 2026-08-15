'use strict';

const { PrismaClient } = require('@prisma/client');
const env = require('./env');
const { handleMockQuery } = require('./mockData');

/**
 * Singleton Prisma client or Mock Proxy.
 * In DEMO_MODE, it returns a Proxy to completely bypass PostgreSQL.
 */

let prismaInstance;

function getMockPrisma() {
  const handler = {
    get(target, prop) {
      if (prop === '$connect' || prop === '$disconnect') return async () => {};
      
      // Handle $transaction by simply executing the callback with the proxy itself
      if (prop === '$transaction') {
        return async (callback) => {
          if (typeof callback === 'function') {
            return callback(proxyPrisma);
          }
          // Array of promises
          return Promise.all(callback);
        };
      }
      
      if (prop === '$queryRaw') return async () => [{ 1: 1 }];
      if (prop === '$executeRaw') return async () => 1;

      // Model proxy (e.g. prisma.user.findUnique)
      return new Proxy({}, {
        get(modelTarget, method) {
          return async (...args) => {
            return handleMockQuery(prop, method, args);
          };
        }
      });
    }
  };
  
  const proxyPrisma = new Proxy({}, handler);
  return proxyPrisma;
}

function getPrismaClient() {
  if (env.DEMO_MODE) {
    if (!prismaInstance) prismaInstance = getMockPrisma();
    return prismaInstance;
  }

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
