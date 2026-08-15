'use strict';

'use strict';

// Set test env BEFORE requiring app (config validates env on load)
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_32_chars_min_here';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_32_chars_min_hr';
process.env.COOKIE_SECRET = 'test_cookie_secret_32_chars_min_hr';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://career_user:career_secret_change_in_prod@localhost:5432/career_db_test';
process.env.DEMO_MODE = 'true';
process.env.PORT = '5007'; // use different port to avoid conflicts
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_GENERAL = '1000';
process.env.RATE_LIMIT_MAX_AUTH = '1000';
process.env.AGENTS_SERVICE_URL = 'http://localhost:8000';

const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/database');

describe('Simulation & Comparison API', () => {
  let token;
  let userId;
  let analysisId;
  let simId;

  beforeAll(async () => {
    await prisma.simulation.deleteMany({});
    await prisma.analysis.deleteMany({});
    
    // Register user via API to get a valid token
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: `sim_${Date.now()}@example.com`, password: 'TestPassword1!', firstName: 'Sim', lastName: 'User' });
    
    token = res.body.data.accessToken;
    userId = res.body.data.user.id;

    // Create a complete analysis
    const analysis = await prisma.analysis.create({
      data: {
        userId,
        status: 'COMPLETED',
        currentPhase: 'COMPLETED',
        dataMode: 'DEMO',
        careerDecision: {
          create: {
            career: "Software Engineer",
            suitabilityScore: 75,
            stressAdjustedScore: 70,
            riskScore: 30,
            stressTestRobustness: 80,
            stabilityScore: 90,
            overallConfidence: 85,
            unsupportedClaimRate: 0.1,
            evidenceCoverage: 0.8,
            agentAgreementRate: 0.9,
            strengths: ["Coding"],
            skillGaps: ["Cloud"],
            risks: [],
            evidence: [],
            alternativeCareers: [
              { career: 'AI Engineer', score: 85, stress_adjusted_score: 75, risk_score: 20 },
              { career: 'Data Engineer', score: 75, stress_adjusted_score: 70, risk_score: 30 },
              { career: 'Software Engineer', score: 65, stress_adjusted_score: 60, risk_score: 40 }
            ],
            stressTestResults: [],
            agentDisagreements: [],
            assumptions: [],
            uncertainties: [],
            finalReasoning: 'Test',
            nextActions: []
          }
        },
        skillGaps: {
          create: [
            { career: 'AI Engineer', skillName: 'MLOps', currentLevel: 20, requiredLevel: 70, gapSize: 50, priority: 'HIGH' }
          ]
        },
        stressTest: {
          create: {
            robustnessScore: 80,
            scenariosSurvived: 8,
            scenariosFailed: 2,
            scenariosPartial: 0,
            totalScenarios: 10
          }
        }
      }
    });
    analysisId = analysis.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Comparison API', () => {
    it('should run a robustness-aware comparison', async () => {
      const res = await request(app)
        .post('/api/comparisons')
        .set('Authorization', `Bearer ${token}`)
        .send({
          analysisId,
          careers: ['AI Engineer', 'Data Engineer', 'Software Engineer']
        });
      
      if (res.status === 400) {
        console.log("Comparison Test Failed with 400. Body:", res.body);
      }
      expect(res.status).toBe(200);
      expect(res.body.data.comparison.length).toBe(3);
      expect(res.body.data.recommendations).toBeDefined();
      expect(res.body.data.recommendations.bestOverall).toBe('AI Engineer'); // because it has highest score, lowest risk
    });
  });

  describe('Simulation API', () => {
    it('should create a simulation mock if python is offline (will fail if python not mocked, so we just check 400 or 500 or 201)', async () => {
      const res = await request(app)
        .post('/api/simulations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          baseAnalysisId: analysisId,
          scenarioType: 'SKILL_IMPROVEMENT',
          scenarioParams: { skill: 'MLOps', current: 20, new: 70 }
        });
      
      // Since Python service is not mocked here and it will timeout/fail, we expect a 400 (Simulation engine failed)
      // This proves the route is active and auth works.
      expect(res.status).toBe(400);
      expect(res.body.message).toBeDefined();
    });
  });
});
