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
process.env.CORS_ORIGINS = 'http://localhost:5173';
process.env.DEMO_MODE = 'true';
process.env.PORT = '5001';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_GENERAL = '1000';
process.env.RATE_LIMIT_MAX_AUTH = '1000';
process.env.RATE_LIMIT_MAX_ANALYSIS = '1000';
process.env.UPLOAD_DIR = './test-uploads';
process.env.MAX_FILE_SIZE_MB = '10';
process.env.AGENTS_SERVICE_URL = 'http://localhost:8000';

const app = require('../../src/app');
const prisma = require('../../src/config/database');

// ============================================================
// Test data helpers
// ============================================================
function uniqueEmail() {
  return `test_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`;
}

const validPassword = 'TestPass1!';

// ============================================================
// Setup / teardown
// ============================================================
beforeAll(async () => {
  // Ensure DB is reachable
  await prisma.$connect();
});

afterAll(async () => {
  // Clean up test users created during this run
  await prisma.refreshToken.deleteMany({
    where: { user: { email: { contains: 'test_' } } },
  });
  await prisma.user.deleteMany({
    where: { email: { contains: 'test_' } },
  });
  await prisma.$disconnect();
});

// ============================================================
// Health Check
// ============================================================
describe('GET /api/health', () => {
  it('should return 200 with status ok or degraded', async () => {
    const res = await request(app).get('/api/health');
    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty('service', 'career-command-center-backend');
    expect(res.body).toHaveProperty('demoMode', true);
  });
});

// ============================================================
// Auth — Registration
// ============================================================
describe('POST /api/auth/register', () => {
  it('should register a new user and return accessToken + user', async () => {
    const email = uniqueEmail();
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: validPassword, firstName: 'Test', lastName: 'User' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data.user).toHaveProperty('email', email);
    expect(res.body.data.user).not.toHaveProperty('passwordHash');
    expect(res.body.data.user.role).toBe('USER');
    // Should set httpOnly cookie
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'].some((c) => c.includes('refreshToken'))).toBe(true);
    expect(res.headers['set-cookie'].some((c) => c.includes('HttpOnly'))).toBe(true);
  });

  it('should reject duplicate email registration', async () => {
    const email = uniqueEmail();
    await request(app)
      .post('/api/auth/register')
      .send({ email, password: validPassword });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: validPassword });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: validPassword });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('should reject weak password (no uppercase)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: uniqueEmail(), password: 'weakpass1' });

    expect(res.status).toBe(422);
    expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
  });

  it('should reject weak password (too short)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: uniqueEmail(), password: 'Ab1' });

    expect(res.status).toBe(422);
  });

  it('should reject missing password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: uniqueEmail() });

    expect(res.status).toBe(422);
  });

  it('should normalize email to lowercase', async () => {
    const email = uniqueEmail().toUpperCase();
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: validPassword });

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe(email.toLowerCase());
  });

  it('should not expose passwordHash in response', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: uniqueEmail(), password: validPassword });

    expect(res.status).toBe(201);
    expect(JSON.stringify(res.body)).not.toContain('passwordHash');
  });
});

// ============================================================
// Auth — Login
// ============================================================
describe('POST /api/auth/login', () => {
  let testEmail;

  beforeAll(async () => {
    testEmail = uniqueEmail();
    await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: validPassword });
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: validPassword });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('user');
    expect(res.headers['set-cookie'].some((c) => c.includes('refreshToken'))).toBe(true);
  });

  it('should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'WrongPass1!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: validPassword });

    expect(res.status).toBe(401);
  });

  it('should reject missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail });

    expect(res.status).toBe(422);
  });

  it('should not expose passwordHash', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: validPassword });

    expect(JSON.stringify(res.body)).not.toContain('passwordHash');
  });
});

// ============================================================
// Auth — Refresh Token
// ============================================================
describe('POST /api/auth/refresh', () => {
  let refreshTokenCookie;

  beforeAll(async () => {
    const email = uniqueEmail();
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: validPassword });
    refreshTokenCookie = res.headers['set-cookie'];
  });

  it('should issue new accessToken with valid refresh token cookie', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', refreshTokenCookie);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    // Should rotate refresh token cookie
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should reject request with no cookie', async () => {
    const res = await request(app).post('/api/auth/refresh');
    expect(res.status).toBe(401);
  });

  it('should reject invalid/fake refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', ['refreshToken=fake-invalid-token; HttpOnly; Path=/api/auth']);

    expect(res.status).toBe(401);
  });
});

// ============================================================
// Auth — Logout
// ============================================================
describe('POST /api/auth/logout', () => {
  it('should logout successfully and clear cookie', async () => {
    const email = uniqueEmail();
    const loginRes = await request(app)
      .post('/api/auth/register')
      .send({ email, password: validPassword });

    const cookie = loginRes.headers['set-cookie'];

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookie);

    expect(res.status).toBe(204);

    // After logout, refresh should fail
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookie);

    expect(refreshRes.status).toBe(401);
  });

  it('should return 204 even without a cookie (idempotent)', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(204);
  });
});

// ============================================================
// Auth — GET /me
// ============================================================
describe('GET /api/auth/me', () => {
  let accessToken;

  beforeAll(async () => {
    const email = uniqueEmail();
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: validPassword });
    accessToken = res.body.data.accessToken;
  });

  it('should return current user when authenticated', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('email');
    expect(res.body.data).not.toHaveProperty('passwordHash');
  });

  it('should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('should reject invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(401);
  });
});

// ============================================================
// RBAC — Admin routes
// ============================================================
describe('RBAC - Admin Routes', () => {
  let userToken;

  beforeAll(async () => {
    const email = uniqueEmail();
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: validPassword });
    userToken = res.body.data.accessToken;
  });

  it('should reject USER role from admin endpoint', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should reject unauthenticated request to admin', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.status).toBe(401);
  });
});

// ============================================================
// Input Validation / Security
// ============================================================
describe('Security — Input Validation', () => {
  it('should strip $-prefixed keys from body', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ $where: 'attack', email: 'x@y.com', password: 'Test123' });

    // Should not crash — just validate normally
    expect([401, 422]).toContain(res.status);
  });

  it('should reject oversized JSON body (> 1mb)', async () => {
    const bigPayload = { data: 'x'.repeat(1100000) };
    const res = await request(app)
      .post('/api/auth/register')
      .send(bigPayload)
      .set('Content-Type', 'application/json');

    expect([413, 422, 400]).toContain(res.status);
  });
});

// ============================================================
// 404 Handler
// ============================================================
describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
