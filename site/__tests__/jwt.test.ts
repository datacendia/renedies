// @ts-nocheck - Jest types will be available after npm install
import { signUnlockToken, verifyUnlockToken } from '@/lib/jwt';
import type { Tier } from '@/lib/tier';

describe('JWT Functions', () => {
  const testPayload = {
    email: 'test@example.com',
    tier: 'full' as Tier,
    orderId: '12345'
  };

  beforeEach(() => {
    // Set a test JWT secret
    process.env.JWT_SECRET = 'test-secret-key-for-testing-min-32-bytes-long';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('signUnlockToken', () => {
    it('should sign a token with valid payload', async () => {
      const token = await signUnlockToken(testPayload);
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should throw error in production without JWT_SECRET', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      delete process.env.JWT_SECRET;

      await expect(signUnlockToken(testPayload)).rejects.toThrow(
        'JWT_SECRET environment variable is required in production'
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should work in development without JWT_SECRET (with warning)', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      delete process.env.JWT_SECRET;

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const token = await signUnlockToken(testPayload);
      
      expect(token).toBeDefined();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Using weak JWT secret for development only')
      );

      consoleWarnSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('verifyUnlockToken', () => {
    it('should verify a valid token', async () => {
      const token = await signUnlockToken(testPayload);
      const payload = await verifyUnlockToken(token);

      expect(payload).not.toBeNull();
      expect(payload?.email).toBe(testPayload.email);
      expect(payload?.tier).toBe(testPayload.tier);
      expect(payload?.orderId).toBe(testPayload.orderId);
    });

    it('should return null for invalid token', async () => {
      const payload = await verifyUnlockToken('invalid-token-string');
      expect(payload).toBeNull();
    });

    it('should return null for token signed with different secret', async () => {
      const token = await signUnlockToken(testPayload);
      delete process.env.JWT_SECRET;
      process.env.JWT_SECRET = 'different-secret-key-min-32-bytes-long';

      const payload = await verifyUnlockToken(token);
      expect(payload).toBeNull();
    });
  });
});
