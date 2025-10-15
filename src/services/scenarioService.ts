import { Scenario } from '../types/scenario';

/**
 * Fetch scenario of the day from the API
 * Returns the scenario assigned for today (UTC timezone)
 */
export async function fetchScenarioOfTheDay(): Promise<Scenario> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error('API URL not configured. Please set EXPO_PUBLIC_API_URL in your .env file.');
  }
  
  try {
    const response = await fetch(`${apiUrl}/scenarios/today`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Handle 404 - no scenario assigned for today
    if (response.status === 404) {
      throw new Error('No scenario assigned for today. Please check back later.');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching scenario from API:', error);
    throw error;
  }
}

