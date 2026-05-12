// @ts-nocheck - Jest types will be available after npm install
import { localizeRemedy, clearRemedyCache } from '@/lib/content';
import type { Remedy } from '@/lib/content';

describe('Content Functions', () => {
  const testRemedy: Remedy = {
    slug: 'test-remedy',
    number: 1,
    region: 'India',
    name: 'Ashwagandha',
    latin: 'Withania somnifera',
    benefit: 'Reduces stress and anxiety',
    recipe: 'Take 1-2g powder with warm milk',
    sourcing: 'Available in Ayurvedic stores',
    extras: [],
    raw: '## 1. Ashwagandha',
    confidence: 'traditional',
    attribution: 'Traditional Ayurvedic text',
    tags: ['adaptogen'],
    i18n: {
      es: {
        name: 'Ashwagandha',
        benefit: 'Reduce el estrés y la ansiedad',
        recipe: 'Tome 1-2g de polvo con leche tibia',
        sourcing: 'Disponible en tiendas ayurvédicas'
      },
      ja: {
        name: 'アシュワガンダ',
        benefit: 'ストレスと不安を軽減',
        recipe: '温かい牛乳と1-2gの粉末を服用'
      }
    }
  };

  describe('localizeRemedy', () => {
    it('should return original remedy for English locale', () => {
      const localized = localizeRemedy(testRemedy, 'en');
      expect(localized.name).toBe('Ashwagandha');
      expect(localized.benefit).toBe('Reduces stress and anxiety');
    });

    it('should apply Spanish translations', () => {
      const localized = localizeRemedy(testRemedy, 'es');
      expect(localized.name).toBe('Ashwagandha');
      expect(localized.benefit).toBe('Reduce el estrés y la ansiedad');
      expect(localized.recipe).toBe('Tome 1-2g de polvo con leche tibia');
      expect(localized.sourcing).toBe('Disponible en tiendas ayurvédicas');
    });

    it('should apply Japanese translations', () => {
      const localized = localizeRemedy(testRemedy, 'ja');
      expect(localized.name).toBe('アシュワガンダ');
      expect(localized.benefit).toBe('ストレスと不安を軽減');
      expect(localized.recipe).toBe('温かい牛乳と1-2gの粉末を服用');
    });

    it('should fallback to English for missing translation fields', () => {
      const localized = localizeRemedy(testRemedy, 'ja');
      expect(localized.sourcing).toBe('Available in Ayurvedic stores'); // No Japanese sourcing
    });

    it('should return original remedy for unsupported locale', () => {
      const localized = localizeRemedy(testRemedy, 'fr');
      expect(localized.name).toBe('Ashwagandha');
      expect(localized.benefit).toBe('Reduces stress and anxiety');
    });

    it('should return original remedy if no i18n data exists', () => {
      const remedyWithoutI18n: Remedy = { ...testRemedy, i18n: undefined };
      const localized = localizeRemedy(remedyWithoutI18n, 'es');
      expect(localized.name).toBe('Ashwagandha');
      expect(localized.benefit).toBe('Reduces stress and anxiety');
    });
  });

  describe('clearRemedyCache', () => {
    it('should be a function that can be called', () => {
      expect(() => clearRemedyCache()).not.toThrow();
    });
  });
});
