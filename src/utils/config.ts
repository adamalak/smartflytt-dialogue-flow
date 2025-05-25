
interface Config {
  sendgridApiKey: string | undefined;
  adminEmailRecipient: string;
  isProduction: boolean;
}

export const config: Config = {
  sendgridApiKey: import.meta.env.VITE_SENDGRID_API_KEY,
  adminEmailRecipient: import.meta.env.VITE_ADMIN_EMAIL_RECIPIENT || 'info@smartflytt.se',
  isProduction: import.meta.env.PROD
};

export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.sendgridApiKey) {
    errors.push('VITE_SENDGRID_API_KEY environment variable is required for email functionality');
  }

  if (!config.adminEmailRecipient.includes('@')) {
    errors.push('VITE_ADMIN_EMAIL_RECIPIENT must be a valid email address');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getConfigStatus = () => {
  const validation = validateConfig();
  return {
    ...validation,
    emailEnabled: !!config.sendgridApiKey,
    environment: config.isProduction ? 'production' : 'development'
  };
};
