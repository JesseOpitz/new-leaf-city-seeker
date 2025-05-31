
// Email and API Configuration
export const EMAIL_CONFIG = {
  // SendGrid Configuration
  SENDGRID_API_KEY: import.meta.env.VITE_SENDGRID_API_KEY || '',
  FROM_EMAIL: import.meta.env.VITE_FROM_EMAIL || 'noreply@your-domain.com',
  FROM_NAME: import.meta.env.VITE_FROM_NAME || 'New Leaf City Seeker',
};

export const OPENAI_CONFIG = {
  API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  MODEL: 'gpt-4o', // Best model for comprehensive content generation
  MAX_TOKENS: 4000, // Allows for detailed 2000+ word plans
  TEMPERATURE: 0.7, // Balanced creativity and consistency
};

// Validation function to check if all required configs are set
export const validateConfiguration = (): { isValid: boolean; missingKeys: string[] } => {
  const requiredKeys = [
    'VITE_OPENAI_API_KEY',
    'VITE_SENDGRID_API_KEY',
    'VITE_FROM_EMAIL'
  ];
  
  const envVars = import.meta.env;
  const missingKeys = requiredKeys.filter(key => !envVars[key]);
  
  console.log('=== DETAILED ENVIRONMENT VARIABLE DEBUG ===');
  console.log('import.meta.env object keys containing VITE_:', Object.keys(envVars).filter(key => key.includes('VITE_')));
  console.log('All import.meta.env keys:', Object.keys(envVars));
  console.log('Environment variable validation:');
  requiredKeys.forEach(key => {
    const value = envVars[key];
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
