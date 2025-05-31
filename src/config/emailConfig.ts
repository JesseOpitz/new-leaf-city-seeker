
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
  
  console.log('=== COMPREHENSIVE ENVIRONMENT DEBUG ===');
  console.log('Current environment mode:', envVars.MODE);
  console.log('Is production build:', envVars.PROD);
  console.log('Is development build:', envVars.DEV);
  console.log('Base URL:', envVars.BASE_URL);
  
  console.log('Raw import.meta.env object:', envVars);
  console.log('All environment variable keys:', Object.keys(envVars));
  console.log('Keys containing VITE_:', Object.keys(envVars).filter(key => key.includes('VITE_')));
  
  console.log('Direct access attempts:');
  console.log('- import.meta.env.VITE_SENDGRID_API_KEY:', import.meta.env.VITE_SENDGRID_API_KEY);
  console.log('- import.meta.env.VITE_OPENAI_API_KEY:', import.meta.env.VITE_OPENAI_API_KEY);
  console.log('- import.meta.env.VITE_FROM_EMAIL:', import.meta.env.VITE_FROM_EMAIL);
  
  console.log('Checking for alternative naming patterns:');
  Object.keys(envVars).forEach(key => {
    if (key.includes('SENDGRID') || key.includes('OPENAI') || key.includes('EMAIL')) {
      console.log(`Found related key: ${key} = ${envVars[key]}`);
    }
  });
  
  console.log('Environment variable validation results:');
  requiredKeys.forEach(key => {
    const value = envVars[key];
    console.log(`${key}:`, value ? `SET (${value.length} chars)` : 'MISSING/UNDEFINED');
    if (value) {
      console.log(`${key} first 10 chars:`, value.substring(0, 10));
    }
  });
  
  console.log('EMAIL_CONFIG object values:');
  console.log('- SENDGRID_API_KEY present:', !!EMAIL_CONFIG.SENDGRID_API_KEY);
  console.log('- SENDGRID_API_KEY length:', EMAIL_CONFIG.SENDGRID_API_KEY?.length || 0);
  console.log('- FROM_EMAIL:', EMAIL_CONFIG.FROM_EMAIL);
  console.log('- FROM_NAME:', EMAIL_CONFIG.FROM_NAME);
  
  console.log('OPENAI_CONFIG object values:');
  console.log('- API_KEY present:', !!OPENAI_CONFIG.API_KEY);
  console.log('- API_KEY length:', OPENAI_CONFIG.API_KEY?.length || 0);
  
  console.log('Missing keys:', missingKeys);
  console.log('Configuration valid:', missingKeys.length === 0);
  console.log('=== END COMPREHENSIVE DEBUG ===');
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys
  };
};
