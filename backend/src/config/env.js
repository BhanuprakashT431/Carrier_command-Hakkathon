'use strict';

require('dotenv').config();

/**
 * Environment configuration with validation.
 * The application will not start if required variables are missing.
 */

const required = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Copy .env.example to .env and fill in all required values.'
    );
  }
}

validateEnv();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_URL_TEST: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

  // Cookie
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'fallback-cookie-secret-change-me',

  // CORS
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim()),

  // File upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || (process.env.VERCEL ? '/tmp' : './uploads'),
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10,

  // Agent service
  AGENTS_SERVICE_URL: process.env.AGENTS_SERVICE_URL || 'http://localhost:8000',

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX_GENERAL: parseInt(process.env.RATE_LIMIT_MAX_GENERAL, 10) || 100,
  RATE_LIMIT_MAX_AUTH: parseInt(process.env.RATE_LIMIT_MAX_AUTH, 10) || 10,
  RATE_LIMIT_MAX_ANALYSIS: parseInt(process.env.RATE_LIMIT_MAX_ANALYSIS, 10) || 5,

  // Demo / AI providers
  DEMO_MODE: process.env.DEMO_MODE === 'true',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',

  // Helpers
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
};

module.exports = env;
