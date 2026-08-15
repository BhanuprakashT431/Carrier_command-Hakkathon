// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterFramework: [],
  globalSetup: './tests/globalSetup.js',
  globalTeardown: './tests/globalTeardown.js',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/**',
  ],
  coverageReporters: ['text', 'lcov'],
  verbose: true,
};
