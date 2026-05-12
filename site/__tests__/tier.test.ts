// @ts-nocheck - Jest types will be available after npm install
import { getTier, canAccessFull, canDownloadPdf, canAccessStarter, TIER_COOKIE } from '@/lib/tier';
import { cookies } from 'next/headers';

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('Tier Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    process.env.PAYWALL_DISABLED = 'false';
    process.env.NEXT_PUBLIC_DEV_UNLOCK = 'false';
  });

  describe('getTier', () => {
    it('should return full in development mode', () => {
      process.env.NODE_ENV = 'development';
      (cookies as jest.Mock).mockReturnValue({
        get: jest.fn(),
      });
      
      const tier = getTier();
      expect(tier).toBe('full');
    });

    it('should return full when PAYWALL_DISABLED is true', () => {
      process.env.PAYWALL_DISABLED = 'true';
      (cookies as jest.Mock).mockReturnValue({
        get: jest.fn(),
      });
      
      const tier = getTier();
      expect(tier).toBe('full');
    });

    it('should return full when NEXT_PUBLIC_DEV_UNLOCK is true', () => {
      process.env.NEXT_PUBLIC_DEV_UNLOCK = 'true';
      (cookies as jest.Mock).mockReturnValue({
        get: jest.fn(),
      });
      
      const tier = getTier();
      expect(tier).toBe('full');
    });

    it('should return tier from cookie in production', () => {
      process.env.NODE_ENV = 'production';
      (cookies as jest.Mock).mockReturnValue({
        get: jest.fn((name: string) => {
          if (name === TIER_COOKIE) return { value: 'pdf' };
          return undefined;
        }),
      });
      
      const tier = getTier();
      expect(tier).toBe('pdf');
    });

    it('should return none when no cookie and not in dev mode', () => {
      process.env.NODE_ENV = 'production';
      (cookies as jest.Mock).mockReturnValue({
        get: jest.fn(() => undefined),
      });
      
      const tier = getTier();
      expect(tier).toBe('none');
    });

    it('should return none for invalid cookie value', () => {
      process.env.NODE_ENV = 'production';
      (cookies as jest.Mock).mockReturnValue({
        get: jest.fn((name: string) => {
          if (name === TIER_COOKIE) return { value: 'invalid-tier' };
          return undefined;
        }),
      });
      
      const tier = getTier();
      expect(tier).toBe('none');
    });
  });

  describe('canAccessFull', () => {
    it('should return true for full tier', () => {
      expect(canAccessFull('full')).toBe(true);
    });

    it('should return false for other tiers', () => {
      expect(canAccessFull('none')).toBe(false);
      expect(canAccessFull('starter')).toBe(false);
      expect(canAccessFull('pdf')).toBe(false);
    });
  });

  describe('canDownloadPdf', () => {
    it('should return true for pdf tier', () => {
      expect(canDownloadPdf('pdf')).toBe(true);
    });

    it('should return true for full tier', () => {
      expect(canDownloadPdf('full')).toBe(true);
    });

    it('should return false for other tiers', () => {
      expect(canDownloadPdf('none')).toBe(false);
      expect(canDownloadPdf('starter')).toBe(false);
    });
  });

  describe('canAccessStarter', () => {
    it('should return true for starter tier', () => {
      expect(canAccessStarter('starter')).toBe(true);
    });

    it('should return true for pdf tier', () => {
      expect(canAccessStarter('pdf')).toBe(true);
    });

    it('should return true for full tier', () => {
      expect(canAccessStarter('full')).toBe(true);
    });

    it('should return false for none tier', () => {
      expect(canAccessStarter('none')).toBe(false);
    });
  });
});
