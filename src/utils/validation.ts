
import { CHATBOT_CONSTANTS } from '@/data/constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateInput = (type: string, value: string): ValidationResult => {
  const trimmedValue = value.trim();

  switch (type) {
    case 'date':
      return validateDate(trimmedValue);
    case 'postal':
      return validatePostal(trimmedValue);
    case 'phone':
      return validatePhone(trimmedValue);
    case 'email':
      return validateEmail(trimmedValue);
    case 'name':
      return validateName(trimmedValue);
    case 'city':
      return validateCity(trimmedValue);
    default:
      return { isValid: true };
  }
};

const validateDate = (value: string): ValidationResult => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(value)) {
    return {
      isValid: false,
      error: CHATBOT_CONSTANTS.VALIDATION_MESSAGES.INVALID_DATE
    };
  }

  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    return {
      isValid: false,
      error: CHATBOT_CONSTANTS.VALIDATION_MESSAGES.INVALID_DATE
    };
  }

  return { isValid: true };
};

const validatePostal = (value: string): ValidationResult => {
  const postalRegex = /^\d{5}$/;
  
  if (!postalRegex.test(value)) {
    return {
      isValid: false,
      error: CHATBOT_CONSTANTS.VALIDATION_MESSAGES.INVALID_POSTAL
    };
  }

  return { isValid: true };
};

const validatePhone = (value: string): ValidationResult => {
  const phoneRegex = /^(07\d{8}|(\+46|0046)7\d{8})$/;
  const cleanPhone = value.replace(/[\s-]/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      error: CHATBOT_CONSTANTS.VALIDATION_MESSAGES.INVALID_PHONE
    };
  }

  return { isValid: true };
};

const validateEmail = (value: string): ValidationResult => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(value)) {
    return {
      isValid: false,
      error: CHATBOT_CONSTANTS.VALIDATION_MESSAGES.INVALID_EMAIL
    };
  }

  return { isValid: true };
};

const validateName = (value: string): ValidationResult => {
  if (value.length < 2) {
    return {
      isValid: false,
      error: CHATBOT_CONSTANTS.VALIDATION_MESSAGES.MIN_LENGTH(2)
    };
  }

  return { isValid: true };
};

const validateCity = (value: string): ValidationResult => {
  if (value.length < 2) {
    return {
      isValid: false,
      error: CHATBOT_CONSTANTS.VALIDATION_MESSAGES.MIN_CITY_LENGTH
    };
  }

  return { isValid: true };
};
