import { Scenario } from '../types/scenario';
import { SupportedLanguage, detectUserLanguage } from '../utils/languageDetection';

interface CalendarApiResponse {
  date: string;
  eventId: number;
  event: {
    id: number;
    title: string;
    year: number;
    month: number;
    day: number;
    locations: string[];
    description: string;
    coverImage: string;
    historicalContextData?: any;
    keyPeople?: any[];
  };
}

/**
 * Transform API response to Scenario format
 */
function transformApiResponse(apiData: CalendarApiResponse, targetLanguage: SupportedLanguage): Scenario {
  const { event } = apiData;
  
  // Format the date as YYYY-MM-DD
  const eventDate = `${event.year}-${String(event.month).padStart(2, '0')}-${String(event.day).padStart(2, '0')}`;
  
  // Join locations with bullet points
  const location = event.locations.join(' • ');
  
  // Create subtitle from location and date
  const subtitle = `${location} • ${eventDate}`;
  
  // Build full image URL if it's a relative path
  const imageUrl = event.coverImage && event.coverImage.startsWith('http') 
    ? event.coverImage 
    : event.coverImage 
      ? `${process.env.EXPO_PUBLIC_API_URL}${event.coverImage}`
      : null;
  
  return {
    id: event.id.toString(),
    title: event.title,
    subtitle: subtitle,
    location: location,
    description: event.description,
    imageUrl: imageUrl,
    date: eventDate,
    language: targetLanguage,
  };
}

/**
 * Fetch scenario of the day from the API
 * Returns the scenario assigned for today (UTC timezone)
 */
export async function fetchScenarioOfTheDay(language?: SupportedLanguage): Promise<Scenario> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  console.log('🔗 API URL configured:', !!apiUrl, 'URL:', apiUrl);
  console.log('🌍 Language parameter:', language, 'type:', typeof language);
  
  if (!apiUrl) {
    throw new Error('API URL not configured. Please set EXPO_PUBLIC_API_URL in your .env file.');
  }
  
  const targetLanguage = language || detectUserLanguage();
  console.log('🎯 Target language:', targetLanguage, 'type:', typeof targetLanguage);
  
  try {
    const endpoint = `${apiUrl}/api/${targetLanguage}/calendar/today`;
    console.log('🌐 Making API request to:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 API response status:', response.status, 'ok:', response.ok);
    
    // Handle 404 - no scenario assigned for today
    if (response.status === 404) {
      throw new Error('No scenario assigned for today. Please check back later.');
    }
    
    if (response.status === 400) {
      throw new Error(`Language '${targetLanguage}' is not supported.`);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiData: CalendarApiResponse = await response.json();
    const scenario = transformApiResponse(apiData, targetLanguage);
    
    return scenario;
  } catch (error) {
    console.error('Error fetching scenario from API:', error);
    throw error;
  }
}

