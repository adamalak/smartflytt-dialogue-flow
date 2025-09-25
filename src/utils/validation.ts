/**
 * Validation utilities and Zod schemas for Smartflytt
 * Centralized validation logic with Swedish error messages
 */

import { z } from 'zod';

import { COPY } from '@/data/copy.sv';

// Swedish phone number validation
const swedishPhoneRegex = /^(\+46|0)([1-9]\d{1,2}[-\s]?\d{2,3}[-\s]?\d{2,3}|\d{2,3}[-\s]?\d{2,3}[-\s]?\d{2,3})$/;

// Swedish postal code validation (XXXXX or XXX XX format)
const swedishPostalRegex = /^\d{3}\s?\d{2}$/;

// Email validation schema
export const emailSchema = z
  .string()
  .trim()
  .min(1, COPY.VALIDATION.REQUIRED)
  .email(COPY.VALIDATION.EMAIL_INVALID)
  .max(255, 'E-postadressen får vara max 255 tecken');

// Swedish phone number schema
export const phoneSchema = z
  .string()
  .trim()
  .min(1, COPY.VALIDATION.REQUIRED)
  .regex(swedishPhoneRegex, COPY.VALIDATION.PHONE_INVALID);

// Swedish postal code schema
export const postalCodeSchema = z
  .string()
  .trim()
  .min(1, COPY.VALIDATION.REQUIRED)
  .regex(swedishPostalRegex, COPY.VALIDATION.POSTAL_INVALID);

// Date validation (must be in the future)
export const futureDateSchema = z
  .string()
  .min(1, COPY.VALIDATION.REQUIRED)
  .refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, COPY.VALIDATION.DATE_INVALID)
  .refine((date) => {
    const parsed = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return parsed >= today;
  }, COPY.VALIDATION.DATE_PAST);

// Volume validation
export const volumeSchema = z
  .number()
  .min(0.1, COPY.VALIDATION.VOLUME_INVALID)
  .max(1000, COPY.VALIDATION.VOLUME_TOO_HIGH);

// Name validation
export const nameSchema = z
  .string()
  .trim()
  .min(2, COPY.VALIDATION.NAME_TOO_SHORT)
  .max(100, COPY.VALIDATION.NAME_TOO_LONG);

// Address schema
export const addressSchema = z.object({
  street: z.string().trim().min(1, COPY.VALIDATION.REQUIRED),
  postal: postalCodeSchema,
  city: z.string().trim().min(1, COPY.VALIDATION.REQUIRED),
});

// Contact information schema
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

// Move quote data schema
export const moveQuoteSchema = z.object({
  moveType: z.enum(['bostad', 'kontor', 'annat']),
  date: futureDateSchema,
  from: addressSchema,
  to: addressSchema,
  rooms: z.enum(['1 rok', '2 rok', '3 rok', 'villa', 'annat']),
  volume: volumeSchema,
  elevator: z.enum(['båda', 'från', 'till', 'ingen']),
  contact: contactSchema,
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'Du måste samtycka för att fortsätta',
  }),
  additionalInfo: z
    .string()
    .max(2000, COPY.VALIDATION.ADDITIONAL_INFO_TOO_LONG)
    .optional(),
});

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

export const validateSwedishPhone = (phone: string): boolean => {
  try {
    phoneSchema.parse(phone);
    return true;
  } catch {
    return false;
  }
};

export const validatePostalCode = (postal: string): boolean => {
  try {
    postalCodeSchema.parse(postal);
    return true;
  } catch {
    return false;
  }
};

export const formatSwedishPhone = (phone: string): string => {
  // Remove all spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Convert 0XX to +46XX
  if (cleaned.startsWith('0')) {
    return `+46${cleaned.slice(1)}`;
  }
  
  return cleaned;
};

export const formatPostalCode = (postal: string): string => {
  // Remove spaces
  const cleaned = postal.replace(/\s/g, '');
  
  // Add space after 3rd digit if not present
  if (cleaned.length === 5 && !cleaned.includes(' ')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  
  return postal;
};

// Type exports for the schemas
export type EmailValidation = z.infer<typeof emailSchema>;
export type PhoneValidation = z.infer<typeof phoneSchema>;
export type PostalCodeValidation = z.infer<typeof postalCodeSchema>;
export type AddressValidation = z.infer<typeof addressSchema>;
export type ContactValidation = z.infer<typeof contactSchema>;
export const validatePhoneNumber = validateSwedishPhone;