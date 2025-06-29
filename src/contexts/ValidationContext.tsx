
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationContextType {
  errors: ValidationError[];
  addError: (field: string, message: string) => void;
  removeError: (field: string) => void;
  clearErrors: () => void;
  hasErrors: () => boolean;
  getError: (field: string) => string | undefined;
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

export const useValidation = () => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
};

interface ValidationProviderProps {
  children: ReactNode;
}

export const ValidationProvider: React.FC<ValidationProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const addError = (field: string, message: string) => {
    setErrors(prev => {
      const filtered = prev.filter(error => error.field !== field);
      return [...filtered, { field, message }];
    });
  };

  const removeError = (field: string) => {
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const hasErrors = () => {
    return errors.length > 0;
  };

  const getError = (field: string) => {
    const error = errors.find(error => error.field === field);
    return error?.message;
  };

  return (
    <ValidationContext.Provider value={{
      errors,
      addError,
      removeError,
      clearErrors,
      hasErrors,
      getError
    }}>
      {children}
    </ValidationContext.Provider>
  );
};
