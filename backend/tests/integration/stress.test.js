'use strict';

const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/database');

describe('Stress Test E2E Verification', () => {
  let token;
  let userId;
  let analysisId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'stress-test@example.com',
        password: 'Password123!',
        firstName: 'Stress',
        lastName: 'Tester'
      });
    token = res.body.data.accessToken;
    userId = res.body.data.user.id;
  });

  afterAll(async () => {
    await prisma.analysis.deleteMany({ where: { userId } });
    await prisma.profile.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  });

  it('should run analysis and verify stress-adjusted score affects Final Decision', async () => {
    // 1. Update Profile
    await prisma.profile.update({
      where: { userId },
      data: {
        bio: 'Testing stress test adjustment'
      }
    });

    // 2. Start Analysis
    const startRes = await request(app)
      .post('/api/analysis/run')
      .set('Authorization', `Bearer ${token}`)
      .send({ dataMode: 'DEMO' });
    
    analysisId = startRes.body.data.analysisId;

    // 3. Poll for completion
    let status = 'PENDING';
    for(let i = 0; i < 30; i++) {
      const res = await request(app)
        .get(`/api/analysis/${analysisId}/status`)
        .set('Authorization', `Bearer ${token}`);
      if (res.body && res.body.data) {
        status = res.body.data.status;
        if (status === 'COMPLETED' || status === 'FAILED' || status === 'PARTIAL') break;
      }
      await new Promise(r => setTimeout(r, 2000));
    }

    expect(['COMPLETED', 'PARTIAL']).toContain(status);

    // 4. Retrieve Decision
    const decisionRes = await request(app)
      .get(`/api/analysis/${analysisId}/decision`)
      .set('Authorization', `Bearer ${token}`);

    expect(decisionRes.status).toBe(200);
    const decision = decisionRes.body.data;

    // 5. Verify Score Adjustments
    const original = decision.suitabilityScore;
    const adjusted = decision.stressAdjustedScore;

    // The demo provider sets 10 scenarios with -2.0 delta each.
    // So sum(deltas) = -20.0
    // Therefore adjusted should be original - 20 (bounded to 0)
    
    // In our tests, we will just prove that it is less than original, 
    // and specifically that it exactly equals original - 20 (if original >= 20).
    expect(adjusted).toBeLessThan(original);
    
    if (original >= 20) {
      expect(Math.abs(adjusted - (original - 20))).toBeLessThan(0.01);
    }
  }, 65000);
});
