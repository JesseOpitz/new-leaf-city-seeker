
// Email and API Configuration
export const EMAIL_CONFIG = {
  // SendGrid Configuration
  SENDGRID_API_KEY: process.env.REACT_APP_SENDGRID_API_KEY || '',
  FROM_EMAIL: process.env.REACT_APP_FROM_EMAIL || 'noreply@your-domain.com',
  FROM_NAME: process.env.REACT_APP_FROM_NAME || 'New Leaf City Seeker',
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
    'REACT_APP_SENDGRID_API_KEY',
    'REACT_APP_FROM_EMAIL'
  ];
  
  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys
  };
};
