
// Email and API Configuration
const getEnvVar = (key: string, fallback: string = ''): string => {
  // In Vite, env vars are injected at build time
  const value = import.meta.env[key];
  console.log(`Environment variable ${key}:`, value ? 'SET' : 'NOT SET');
  return value || fallback;
};

export const EMAIL_CONFIG = {
  // SendGrid Configuration
  SENDGRID_API_KEY: getEnvVar('VITE_SENDGRID_API_KEY'),
  FROM_EMAIL: getEnvVar('VITE_FROM_EMAIL', 'noreply@your-domain.com'),
  FROM_NAME: getEnvVar('VITE_FROM_NAME', 'New Leaf City Seeker'),
};

export const OPENAI_CONFIG = {
  API_KEY: getEnvVar('VITE_OPENAI_API_KEY'),
  MODEL: 'gpt-4o', // Best model for comprehensive content generation
  MAX_TOKENS: 4000, // Allows for detailed 2000+ word plans
  TEMPERATURE: 0.7, // Balanced creativity and consistency
};

// Validation function to check if all required configs are set
export const validateConfiguration = (): { isValid: boolean; missingKeys: string[] } => {
  console.log('=== ENVIRONMENT VARIABLE VALIDATION ===');
  
  // Check what's actually available in import.meta.env
  console.log('Available import.meta.env keys:', Object.keys(import.meta.env));
  console.log('All import.meta.env:', import.meta.env);
  
  const requiredConfigs = [
    { key: 'VITE_SENDGRID_API_KEY', value: EMAIL_CONFIG.SENDGRID_API_KEY },
    { key: 'VITE_OPENAI_API_KEY', value: OPENAI_CONFIG.API_KEY },
    { key: 'VITE_FROM_EMAIL', value: EMAIL_CONFIG.FROM_EMAIL },
  ];
  
  const missingKeys: string[] = [];
  
  requiredConfigs.forEach(({ key, value }) => {
    console.log(`Checking ${key}:`, value ? `SET (${value.length} chars)` : 'MISSING');
    if (!value || value.trim() === '') {
      missingKeys.push(key);
    }
  });
  
  console.log('Missing keys:', missingKeys);
  console.log('Configuration valid:', missingKeys.length === 0);
  console.log('=== END VALIDATION ===');
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys
  };
};
