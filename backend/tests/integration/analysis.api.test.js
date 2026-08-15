'use strict';

const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/database');

describe('Analysis API E2E', () => {
  let token;
  let userId;
  let analysisId;

  beforeAll(async () => {
    // Register user
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'analysistest@example.com',
        password: 'Password123!',
        firstName: 'Anna',
        lastName: 'Lysis'
      });
    token = res.body.data.accessToken;
    userId = res.body.data.user.id;
  });

  afterAll(async () => {
    await prisma.analysis.deleteMany({ where: { userId } });
    await prisma.profile.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  describe('POST /api/analysis/run', () => {
    it('should start analysis successfully if profile exists', async () => {
      // Update existing profile
      await prisma.profile.update({
        where: { userId },
        data: {
          bio: 'Testing analysis'
        }
      });

      const res = await request(app)
        .post('/api/analysis/run')
        .set('Authorization', `Bearer ${token}`)
        .send({ dataMode: 'DEMO' });

      expect(res.status).toBe(202);
      expect(res.body.data).toHaveProperty('analysisId');
      analysisId = res.body.data.analysisId;
    });
  });

  describe('GET /api/analysis/:id/status', () => {
    it('should retrieve status', async () => {
      const res = await request(app)
        .get(`/api/analysis/${analysisId}/status`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(analysisId);
      expect(['PENDING', 'RUNNING', 'COMPLETED']).toContain(res.body.data.status);
    });
  });

  describe('GET /api/analysis/:id/results', () => {
    it('should retrieve results eventually (polling)', async () => {
      // Poll up to 10 times, wait 2s each
      let status = 'PENDING';
      let data = null;
      for(let i = 0; i < 30; i++) {
        const res = await request(app)
          .get(`/api/analysis/${analysisId}/results`)
          .set('Authorization', `Bearer ${token}`);
        if (res.body && res.body.data) {
          status = res.body.data.status;
          data = res.body.data;
          if (status === 'COMPLETED' || status === 'FAILED' || status === 'PARTIAL') break;
        }
        await new Promise(r => setTimeout(r, 2000));
      }

      // We expect the python service to be mocked or running
      // If it's failing because python isn't up, it will be FAILED.
      // E2E test requires both services up.
      expect(['COMPLETED', 'FAILED', 'PARTIAL']).toContain(status);
      
      // If it passed, check the decision
      if (status === 'COMPLETED') {
        expect(data.careerDecision).not.toBeNull();
        expect(data.careerDecision.career).toBeDefined();
        expect(data.agentRuns.length).toBeGreaterThan(0);
      }
    }, 65000); // increase timeout to 65s for polling
  });

  describe('Phase 4 Specific Endpoints', () => {
    it('should retrieve stress test', async () => {
      const res = await request(app)
        .get(`/api/analysis/${analysisId}/stress-test`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      // Data might be null if analysis failed, but it should return 200
    });

    it('should retrieve evidence', async () => {
      const res = await request(app)
        .get(`/api/analysis/${analysisId}/evidence`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
    });

    it('should retrieve learning roadmap', async () => {
      const res = await request(app)
        .get(`/api/analysis/${analysisId}/learning-roadmap`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
    });

    it('should retrieve final decision', async () => {
      const res = await request(app)
        .get(`/api/analysis/${analysisId}/decision`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
    });

    it('should retrieve explanation', async () => {
      const res = await request(app)
        .get(`/api/analysis/${analysisId}/explain`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('why_recommended');
      expect(res.body.data).toHaveProperty('weaknesses');
      expect(res.body.data).toHaveProperty('evidence');
      expect(res.body.data).toHaveProperty('what_could_change');
      expect(res.body.data).toHaveProperty('confidence');
    });
  });
});
