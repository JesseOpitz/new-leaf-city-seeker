
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
  
  console.log('=== DETAILED ENVIRONMENT VARIABLE DEBUG ===');
  console.log('process.env object keys containing REACT_APP:', Object.keys(process.env).filter(key => key.includes('REACT_APP')));
  console.log('All process.env keys:', Object.keys(process.env));
  console.log('Environment variable validation:');
  requiredKeys.forEach(key => {
    const value = process.env[key];
    console.log(`${key}:`, value ? `SET (${value.length} chars)` : 'MISSING');
    console.log(`${key} raw value:`, value);
  });
  
  console.log('EMAIL_CONFIG.SENDGRID_API_KEY:', EMAIL_CONFIG.SENDGRID_API_KEY);
  console.log('EMAIL_CONFIG.FROM_EMAIL:', EMAIL_CONFIG.FROM_EMAIL);
  console.log('OPENAI_CONFIG.API_KEY:', OPENAI_CONFIG.API_KEY);
  console.log('=== END DEBUG ===');
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys
  };
};
