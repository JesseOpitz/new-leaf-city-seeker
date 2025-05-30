
// Email and API Configuration
// You'll need to provide these values in your environment or directly here

export const EMAIL_CONFIG = {
  // SMTP Configuration - you'll need to set these up
  SMTP_HOST: process.env.REACT_APP_SMTP_HOST || '',
  SMTP_PORT: process.env.REACT_APP_SMTP_PORT || '587',
  SMTP_USER: process.env.REACT_APP_SMTP_USER || '',
  SMTP_PASS: process.env.REACT_APP_SMTP_PASS || '',
  FROM_EMAIL: process.env.REACT_APP_FROM_EMAIL || '',
  FROM_NAME: process.env.REACT_APP_FROM_NAME || 'New Leaf City Seeker',
  
  // Email service provider options:
  // 1. Gmail SMTP: smtp.gmail.com:587 (requires app password)
  // 2. SendGrid SMTP: smtp.sendgrid.net:587
  // 3. Mailgun SMTP: smtp.mailgun.org:587
  // 4. Outlook/Hotmail: smtp-mail.outlook.com:587
};

export const OPENAI_CONFIG = {
  API_KEY: process.env.REACT_APP_OPENAI_API_KEY || '',
  MODEL: 'gpt-4o', // Best model for comprehensive content generation
  MAX_TOKENS: 4000, // Allows for detailed 2000+ word plans
  TEMPERATURE: 0.7, // Balanced creativity and consistency
};

// Validation function to check if all required configs are set
export const validateConfiguration = (): { isValid: boolean; missingKeys: string[] } => {
  const requiredKeys = [
    'REACT_APP_OPENAI_API_KEY',
    'REACT_APP_SMTP_HOST',
    'REACT_APP_SMTP_USER',
    'REACT_APP_SMTP_PASS',
    'REACT_APP_FROM_EMAIL'
  ];
  
  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys
  };
};
