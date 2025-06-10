
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^07[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime()) && dateObj > new Date();
};

export const validatePostalCode = (postalCode: string): boolean => {
  const postalRegex = /^[0-9]{3}\s?[0-9]{2}$/;
  return postalRegex.test(postalCode);
};
