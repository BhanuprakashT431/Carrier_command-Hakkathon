'use strict';

/**
 * Global test teardown — runs ONCE after all tests complete.
 */
module.exports = async () => {
  // Cleanup: disconnect Prisma to avoid open handles
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$disconnect();
  } catch {
    // Ignore disconnect errors in teardown
  }
};
