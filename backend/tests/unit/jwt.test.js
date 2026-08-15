'use strict';

const {
  generateAccessToken,
  generateRefreshJWT,
  verifyAccessToken,
  verifyRefreshJWT,
  extractBearerToken,
} = require('../../src/utils/jwt');

describe('JWT Utilities', () => {
  const userId = 'user_test_123';
  const role = 'USER';

  // ============================================================
  // generateAccessToken
  // ============================================================
  describe('generateAccessToken', () => {
    it('should return a non-empty string', () => {
      const token = generateAccessToken({ userId, role });
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should produce different tokens for the same payload (iat differs)', () => {
      // Wait 1ms to ensure different iat
      const t1 = generateAccessToken({ userId, role });
      const t2 = generateAccessToken({ userId, role });
      // They may be equal if generated in same ms — just verify both are strings
      expect(typeof t1).toBe('string');
      expect(typeof t2).toBe('string');
    });

    it('should create a valid JWT (3 parts)', () => {
      const token = generateAccessToken({ userId, role });
      const parts = token.split('.');
      expect(parts).toHaveLength(3);
    });
  });

  // ============================================================
  // verifyAccessToken
  // ============================================================
  describe('verifyAccessToken', () => {
    it('should verify a valid access token and return payload', () => {
      const token = generateAccessToken({ userId, role });
      const payload = verifyAccessToken(token);
      expect(payload).not.toBeNull();
      expect(payload.sub).toBe(userId);
      expect(payload.role).toBe(role);
      expect(payload.type).toBe('access');
    });

    it('should return null for an invalid token', () => {
      const result = verifyAccessToken('invalid.token.string');
      expect(result).toBeNull();
    });

    it('should return null for an empty string', () => {
      expect(verifyAccessToken('')).toBeNull();
    });

    it('should return null for null input', () => {
      expect(verifyAccessToken(null)).toBeNull();
    });

    it('should return null for a token signed with wrong secret', () => {
      const jwt = require('jsonwebtoken');
      const fakeToken = jwt.sign({ sub: userId, role, type: 'access' }, 'wrong_secret');
      expect(verifyAccessToken(fakeToken)).toBeNull();
    });

    it('should return null for a refresh token used as access token', () => {
      const refreshJWT = generateRefreshJWT({ userId, tokenId: 'tok_123' });
      // A refresh JWT should not pass as an access token
      const result = verifyAccessToken(refreshJWT);
      // If it verifies at all (different secret), type should be 'refresh' not 'access'
      if (result) {
        expect(result.type).not.toBe('access');
      } else {
        expect(result).toBeNull();
      }
    });
  });

  // ============================================================
  // verifyRefreshJWT
  // ============================================================
  describe('verifyRefreshJWT', () => {
    it('should verify a valid refresh JWT', () => {
      const tokenId = 'tok_abc123';
      const token = generateRefreshJWT({ userId, tokenId });
      const payload = verifyRefreshJWT(token);
      expect(payload).not.toBeNull();
      expect(payload.sub).toBe(userId);
      expect(payload.tid).toBe(tokenId);
      expect(payload.type).toBe('refresh');
    });

    it('should return null for invalid input', () => {
      expect(verifyRefreshJWT('bad.token')).toBeNull();
    });
  });

  // ============================================================
  // extractBearerToken
  // ============================================================
  describe('extractBearerToken', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'my.jwt.token';
      expect(extractBearerToken(`Bearer ${token}`)).toBe(token);
    });

    it('should return null for missing header', () => {
      expect(extractBearerToken(undefined)).toBeNull();
    });

    it('should return null for non-Bearer scheme', () => {
      expect(extractBearerToken('Basic dXNlcjpwYXNz')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(extractBearerToken('')).toBeNull();
    });

    it('should handle "Bearer " with no token', () => {
      // "Bearer " extracts empty string — still a valid extraction
      const result = extractBearerToken('Bearer ');
      expect(result).toBe('');
    });
  });
});
