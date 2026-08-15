'use strict';

/**
 * Global test setup — runs ONCE before all tests.
 * Sets environment to test mode.
 */
module.exports = async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test_access_secret_32_chars_min_here';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_32_chars_min_hr';
  process.env.COOKIE_SECRET = 'test_cookie_secret_32_chars_min_hr';
  process.env.DATABASE_URL =
    process.env.DATABASE_URL_TEST ||
    'postgresql://career_user:career_secret_change_in_prod@localhost:5432/career_db_test';
  process.env.CORS_ORIGINS = 'http://localhost:5173';
  process.env.DEMO_MODE = 'true';
  process.env.PORT = '5001'; // Different port to avoid conflicts
  process.env.RATE_LIMIT_WINDOW_MS = '900000';
  process.env.RATE_LIMIT_MAX_GENERAL = '100';
  process.env.RATE_LIMIT_MAX_AUTH = '100'; // Relaxed for tests
  process.env.RATE_LIMIT_MAX_ANALYSIS = '100';
  process.env.UPLOAD_DIR = './test-uploads';
  process.env.MAX_FILE_SIZE_MB = '10';
  process.env.AGENTS_SERVICE_URL = 'http://localhost:8000';
};
