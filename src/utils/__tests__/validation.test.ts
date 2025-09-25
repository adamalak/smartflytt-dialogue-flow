/**
 * Unit tests for validation utilities
 * Tests Zod schemas and validation functions for Swedish data formats
 */

import { describe, it, expect } from 'vitest';

import {
  validateEmail,
  validateSwedishPhone,
  validatePostalCode,
  formatSwedishPhone,
  formatPostalCode,
  emailSchema,
  phoneSchema,
  postalCodeSchema,
  futureDateSchema,
  volumeSchema,
  nameSchema,
  addressSchema,
  contactSchema,
  moveQuoteSchema,
} from '../validation';

describe('Validation Utilities', () => {
  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.org')).toBe(true);
      expect(validateEmail('smartflytt@gmail.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
    });
  });

  describe('Swedish Phone Validation', () => {
    it('should validate correct Swedish phone numbers', () => {
      expect(validateSwedishPhone('070-123 45 67')).toBe(true);
      expect(validateSwedishPhone('08-123 456 78')).toBe(true);
      expect(validateSwedishPhone('+46 70 123 45 67')).toBe(true);
      expect(validateSwedishPhone('0701234567')).toBe(true);
      expect(validateSwedishPhone('+46701234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validateSwedishPhone('')).toBe(false);
      expect(validateSwedishPhone('123')).toBe(false);
      expect(validateSwedishPhone('00701234567')).toBe(false);
      expect(validateSwedishPhone('+47701234567')).toBe(false); // Norwegian
    });

    it('should format phone numbers correctly', () => {
      expect(formatSwedishPhone('070-123 45 67')).toBe('+46701234567');
      expect(formatSwedishPhone('08-123 456 78')).toBe('+46812345678');
      expect(formatSwedishPhone('+46 70 123 45 67')).toBe('+46701234567');
    });
  });

  describe('Swedish Postal Code Validation', () => {
    it('should validate correct postal codes', () => {
      expect(validatePostalCode('123 45')).toBe(true);
      expect(validatePostalCode('12345')).toBe(true);
      expect(validatePostalCode('111 11')).toBe(true);
    });

    it('should reject invalid postal codes', () => {
      expect(validatePostalCode('')).toBe(false);
      expect(validatePostalCode('1234')).toBe(false);
      expect(validatePostalCode('123456')).toBe(false);
      expect(validatePostalCode('ABC 45')).toBe(false);
    });

    it('should format postal codes correctly', () => {
      expect(formatPostalCode('12345')).toBe('123 45');
      expect(formatPostalCode('123 45')).toBe('123 45');
    });
  });

  describe('Schema Validation', () => {
    it('should validate future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      expect(() => futureDateSchema.parse(tomorrowStr)).not.toThrow();
      expect(() => futureDateSchema.parse('2024-01-01')).toThrow(); // Past date
      expect(() => futureDateSchema.parse('invalid-date')).toThrow();
    });

    it('should validate volume', () => {
      expect(() => volumeSchema.parse(25)).not.toThrow();
      expect(() => volumeSchema.parse(0.5)).not.toThrow();
      expect(() => volumeSchema.parse(0)).toThrow(); // Too small
      expect(() => volumeSchema.parse(1001)).toThrow(); // Too large
    });

    it('should validate names', () => {
      expect(() => nameSchema.parse('Anna Andersson')).not.toThrow();
      expect(() => nameSchema.parse('A')).toThrow(); // Too short
      expect(() => nameSchema.parse('A'.repeat(101))).toThrow(); // Too long
    });

    it('should validate addresses', () => {
      const validAddress = {
        street: 'Testgatan 123',
        postal: '123 45',
        city: 'Stockholm',
      };

      expect(() => addressSchema.parse(validAddress)).not.toThrow();
      
      const invalidAddress = {
        street: '',
        postal: 'invalid',
        city: 'Stockholm',
      };

      expect(() => addressSchema.parse(invalidAddress)).toThrow();
    });

    it('should validate contact information', () => {
      const validContact = {
        name: 'Test Andersson',
        email: 'test@example.com',
        phone: '070-123 45 67',
      };

      expect(() => contactSchema.parse(validContact)).not.toThrow();
      
      const invalidContact = {
        name: 'T',
        email: 'invalid-email',
        phone: '123',
      };

      expect(() => contactSchema.parse(invalidContact)).toThrow();
    });

    it('should validate complete move quote', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const validQuote = {
        moveType: 'bostad' as const,
        date: tomorrowStr,
        from: {
          street: 'Gamla gatan 1',
          postal: '111 11',
          city: 'Stockholm',
        },
        to: {
          street: 'Nya gatan 2',
          postal: '222 22',
          city: 'Göteborg',
        },
        rooms: '2 rok' as const,
        volume: 25,
        elevator: 'båda' as const,
        contact: {
          name: 'Test Andersson',
          email: 'test@example.com',
          phone: '070-123 45 67',
        },
        gdprConsent: true,
        additionalInfo: 'Test info',
      };

      expect(() => moveQuoteSchema.parse(validQuote)).not.toThrow();
      
      const invalidQuote = {
        ...validQuote,
        gdprConsent: false,
        volume: -1,
        date: '2020-01-01', // Past date
      };

      expect(() => moveQuoteSchema.parse(invalidQuote)).toThrow();
    });
  });
});