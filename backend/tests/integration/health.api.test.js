'use strict';

const request = require('supertest');
const app = require('../../src/app');

describe('Health API E2E', () => {
  describe('GET /api/health/ready', () => {
    it('should return readiness status', async () => {
      const res = await request(app).get('/api/health/ready');
      // Depending on whether services are running, it could be 200 or 503.
      expect([200, 503]).toContain(res.status);
      expect(res.body).toHaveProperty('ready');
      expect(res.body).toHaveProperty('db');
      expect(res.body).toHaveProperty('pythonService');
    });
  });
});
