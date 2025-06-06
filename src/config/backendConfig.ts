
// Backend configuration for API calls
const isDevelopment = import.meta.env.DEV;

export const BACKEND_CONFIG = {
  // Use localhost in development, Render URL in production
  baseUrl: isDevelopment 
    ? 'http://localhost:8080' 
    : 'https://new-leaf-net.onrender.com',
  
  endpoints: {
    generatePlan: '/api/generate-plan',
    health: '/health'
  }
};

export const getApiUrl = (endpoint: string) => {
  return `${BACKEND_CONFIG.baseUrl}${endpoint}`;
};

// Log the current configuration for debugging
console.log('🔧 Backend Config:', {
  isDevelopment,
  baseUrl: BACKEND_CONFIG.baseUrl,
  currentUrl: window.location.origin
});
