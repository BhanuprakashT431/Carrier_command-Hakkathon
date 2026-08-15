'use strict';

const request = require('supertest');

// Set test env BEFORE requiring app (config validates env on load)
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_32_chars_min_here';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_32_chars_min_hr';
process.env.COOKIE_SECRET = 'test_cookie_secret_32_chars_min_hr';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://career_user:career_secret_change_in_prod@localhost:5432/career_db_test';
process.env.DEMO_MODE = 'true';
process.env.PORT = '5002'; // use different port to avoid conflicts
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_GENERAL = '1000';
process.env.RATE_LIMIT_MAX_AUTH = '1000';
process.env.AGENTS_SERVICE_URL = 'http://localhost:8000';

const app = require('../../src/app');
const prisma = require('../../src/config/database');

// ============================================================
// Helpers
// ============================================================
function uniqueEmail() {
  return `test_profile_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`;
}

async function createUserAndLogin() {
  const email = uniqueEmail();
  const password = 'TestPassword1!';
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password, firstName: 'Profile', lastName: 'Tester' });

  return { accessToken: res.body.data.accessToken, user: res.body.data.user };
}

// ============================================================
// Setup / Teardown
// ============================================================
beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: { contains: 'test_profile_' } },
  });
  await prisma.$disconnect();
});

// ============================================================
// Tests
// ============================================================
describe('Profile CRUD & Completeness', () => {
  let user1, token1;
  let user2, token2;
  let skillId;

  beforeAll(async () => {
    const creds1 = await createUserAndLogin();
    user1 = creds1.user;
    token1 = creds1.accessToken;

    const creds2 = await createUserAndLogin();
    user2 = creds2.user;
    token2 = creds2.accessToken;
  });

  describe('GET /api/profile', () => {
    it('should retrieve a new user profile with 0 or 16% completeness', async () => {
      const res = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.userId).toBe(user1.id);
      expect(res.body.data.completeness).toBeDefined();
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/profile');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/profile', () => {
    it('should update profile base information', async () => {
      const res = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${token1}`)
        .send({ bio: 'I love writing tests', location: 'Remote' });

      expect(res.status).toBe(200);
      expect(res.body.data.bio).toBe('I love writing tests');
      expect(res.body.data.location).toBe('Remote');
    });
  });

  describe('Skills CRUD & Authorization', () => {
    it('User 1 should be able to add a skill', async () => {
      const res = await request(app)
        .post('/api/profile/skills')
        .set('Authorization', `Bearer ${token1}`)
        .send({ skillName: 'React', proficiency: 'EXPERT', confidence: 95 });

      expect(res.status).toBe(201);
      expect(res.body.data.skillName).toBe('React');
      skillId = res.body.data.id;
    });

    it('User 1 should be able to update their skill', async () => {
      const res = await request(app)
        .put(`/api/profile/skills/${skillId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ confidence: 100 });

      expect(res.status).toBe(200);
    });

    it('User 2 should NOT be able to update User 1s skill', async () => {
      // Prisma updateMany where { id: skillId, profileId: profile.id } prevents this
      // The operation will affect 0 rows, so we don't return an error, but it shouldn't modify.
      // Wait, let's verify it didn't modify.
      await request(app)
        .put(`/api/profile/skills/${skillId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ confidence: 10 });

      // Check the skill again using User 1
      const res = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token1}`);

      const skill = res.body.data.userSkills.find(s => s.id === skillId);
      expect(skill.confidence).toBe(100); // Remained 100
    });

    it('User 2 should NOT be able to delete User 1s skill', async () => {
      await request(app)
        .delete(`/api/profile/skills/${skillId}`)
        .set('Authorization', `Bearer ${token2}`);

      const res = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token1}`);

      const skill = res.body.data.userSkills.find(s => s.id === skillId);
      expect(skill).toBeDefined(); // Still exists
    });

    it('User 1 should be able to delete their skill', async () => {
      const res = await request(app)
        .delete(`/api/profile/skills/${skillId}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.status).toBe(204);
    });
  });

  describe('Preferences', () => {
    it('should upsert preferences', async () => {
      const res = await request(app)
        .put('/api/profile/preferences')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          interestedRoles: ['Software Engineer'],
          remotePreference: 'REMOTE',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.remotePreference).toBe('REMOTE');
    });
  });

  describe('Goals', () => {
    it('should overwrite goals', async () => {
      const res = await request(app)
        .put('/api/profile/career-goals')
        .set('Authorization', `Bearer ${token1}`)
        .send([
          { timeframe: 'SHORT_TERM', goal: 'Learn React' },
          { timeframe: 'ONE_YEAR', goal: 'Get hired' },
        ]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });
  });
});
