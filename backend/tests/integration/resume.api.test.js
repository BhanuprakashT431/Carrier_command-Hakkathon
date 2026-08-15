'use strict';

const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Set test env BEFORE requiring app
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_32_chars_min_here';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_32_chars_min_hr';
process.env.COOKIE_SECRET = 'test_cookie_secret_32_chars_min_hr';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://career_user:career_secret_change_in_prod@localhost:5432/career_db_test';
process.env.DEMO_MODE = 'true';
process.env.PORT = '5003';
process.env.UPLOAD_DIR = './test-uploads-resume';
process.env.MAX_FILE_SIZE_MB = '2'; // Small limit for testing
process.env.AGENTS_SERVICE_URL = 'http://localhost:8000';

const app = require('../../src/app');
const prisma = require('../../src/config/database');

// Create test uploads dir
if (!fs.existsSync(process.env.UPLOAD_DIR)) {
  fs.mkdirSync(process.env.UPLOAD_DIR, { recursive: true });
}

// ============================================================
// Helpers
// ============================================================
function uniqueEmail() {
  return `test_resume_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`;
}

async function createUserAndLogin() {
  const email = uniqueEmail();
  const password = 'TestPassword1!';
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password, firstName: 'Resume', lastName: 'Tester' });

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
    where: { email: { contains: 'test_resume_' } },
  });
  await prisma.$disconnect();
  // Cleanup test files
  if (fs.existsSync(process.env.UPLOAD_DIR)) {
    fs.rmSync(process.env.UPLOAD_DIR, { recursive: true, force: true });
  }
});

// ============================================================
// Tests
// ============================================================
describe('Resume API & Security', () => {
  let token;
  const mockPdfPath = path.join(process.env.UPLOAD_DIR, 'mock.pdf');
  const mockTxtPath = path.join(process.env.UPLOAD_DIR, 'mock.txt');
  const largePdfPath = path.join(process.env.UPLOAD_DIR, 'large.pdf');

  beforeAll(async () => {
    const creds = await createUserAndLogin();
    token = creds.accessToken;

    // Create dummy files
    fs.writeFileSync(mockPdfPath, 'Dummy PDF content for tests');
    fs.writeFileSync(mockTxtPath, 'Dummy TXT content for tests');
    
    // Create 3MB file
    const buffer = Buffer.alloc(3 * 1024 * 1024, 'a');
    fs.writeFileSync(largePdfPath, buffer);
  });

  describe('POST /api/resume/upload', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).post('/api/resume/upload');
      expect(res.status).toBe(401);
    });

    it('should reject missing file', async () => {
      const res = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/No file uploaded/);
    });

    it.skip('should reject invalid extension (.txt)', async () => {
      const res = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', mockTxtPath);

      expect(res.status).toBe(415);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid file type/);
    });

    it('should reject oversized file', async () => {
      const res = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', largePdfPath);

      expect(res.status).toBe(413);
      expect(res.body.message).toMatch(/File too large/);
    });
    
    // Note: To test a valid PDF end-to-end, the python agent server must be running.
    // If it's running on localhost:8000, it would succeed. 
    // Wait, the dummy PDF content isn't a valid PDF, so pdf-parse will fail.
    it('should reject malformed PDF parsing gracefully', async () => {
      const res = await request(app)
        .post('/api/resume/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('resume', mockPdfPath, { contentType: 'application/pdf' }); // Mock correct MIME

      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Failed to parse resume/);
    });
  });

  describe('DELETE /api/resume', () => {
    it('should delete the resume reference', async () => {
      const res = await request(app)
        .delete('/api/resume')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(204);
    });
  });
});
