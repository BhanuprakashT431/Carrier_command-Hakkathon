'use strict';

const { Router } = require('express');
const prisma = require('../config/database');
const env = require('../config/env');
const { success } = require('../utils/response');

const router = Router();

/**
 * GET /api/health
 * Public health check endpoint.
 * Returns system status including DB connectivity and demo mode flag.
 */
router.get('/', async (req, res) => {
  const health = {
    status: 'ok',
    service: 'career-command-center-backend',
    version: '1.0.0',
    environment: env.NODE_ENV,
    demoMode: env.DEMO_MODE,
    aiProvider: getActiveProvider(),
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: 'checking',
  };

  // Check DB connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.database = 'connected';
  } catch {
    health.database = 'disconnected';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  return res.status(statusCode).json({
    success: health.status !== 'error',
    ...health,
  });
});

/**
 * GET /api/health/ready
 * Readiness probe for Kubernetes/Docker.
 * Checks DB and Python service.
 */
router.get('/ready', async (req, res) => {
  const axios = require('axios');
  let dbOk = false;
  let pyOk = false;
  const errors = [];

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (err) {
    errors.push(`DB Error: ${err.message}`);
  }

  try {
    await axios.get(`${env.AGENTS_SERVICE_URL}/health`, { timeout: 3000 });
    pyOk = true;
  } catch (err) {
    errors.push(`Python Service Error: ${err.message}`);
  }

  const ready = dbOk && pyOk;
  return res.status(ready ? 200 : 503).json({
    ready,
    db: dbOk,
    pythonService: pyOk,
    errors: errors.length > 0 ? errors : undefined
  });
});

function getActiveProvider() {
  if (env.DEMO_MODE) return 'demo';
  if (env.GEMINI_API_KEY) return 'gemini';
  if (env.OPENAI_API_KEY) return 'openai';
  return 'demo'; // Fallback to demo if no keys
}

module.exports = router;
