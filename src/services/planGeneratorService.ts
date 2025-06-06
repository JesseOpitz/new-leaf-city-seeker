
import { getApiUrl } from '@/config/backendConfig';

export interface PlanGenerationRequest {
  city: string;
  email?: string;
  questionnaire: {
    movingDate: string;
    budget: string | number;
    householdSize: number;
    income: string | number;
    reason: string;
  };
}

export interface PlanGenerationResponse {
  success: boolean;
  message: string;
  downloadUrl?: string;
  city: string;
  filename?: string;
}

export const generateMovingPlan = async (
  request: PlanGenerationRequest
): Promise<PlanGenerationResponse> => {
  const apiUrl = getApiUrl('/api/generate-plan');
  
  console.log('📤 Making API request to:', apiUrl);
  console.log('📤 Request payload:', JSON.stringify(request, null, 2));
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Success Response:', data);
    return data;

  } catch (error) {
    console.error('❌ Network/Fetch Error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    
    throw error;
  }
};

// Health check function for debugging
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const healthUrl = getApiUrl('/health');
    console.log('🏥 Checking backend health at:', healthUrl);
    
    const response = await fetch(healthUrl);
    const isHealthy = response.ok;
    
    console.log('🏥 Backend health check:', isHealthy ? 'HEALTHY' : 'UNHEALTHY');
    console.log('🏥 Health response status:', response.status);
    
    return isHealthy;
  } catch (error) {
    console.error('🏥 Health check failed:', error);
    return false;
  }
};
