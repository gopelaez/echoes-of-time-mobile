import { Protagonist, ProtagonistPageResponse, ProtagonistPageError, ProtagonistDetail, ProtagonistDetailResponse, ProtagonistDetailError, MontageScene, ChapterDetail, ChapterDetailResponse, ChapterDetailError } from '../types/protagonist';
import { SupportedLanguage, detectUserLanguage } from '../utils/languageDetection';

/**
 * Fetch protagonists for the Lives page
 * Returns recently added protagonists
 */
export async function fetchProtagonists(
  language?: SupportedLanguage,
  limit: number = 7
): Promise<Protagonist[]> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  console.log('🔗 API URL configured:', !!apiUrl, 'URL:', apiUrl);
  console.log('🌍 Language parameter:', language, 'type:', typeof language);
  console.log('📊 Limit:', limit);
  
  if (!apiUrl) {
    throw new Error('API URL not configured. Please set EXPO_PUBLIC_API_URL in your .env file.');
  }
  
  const targetLanguage = language || detectUserLanguage();
  console.log('🎯 Target language:', targetLanguage, 'type:', typeof targetLanguage);
  
  // Validate limit
  const validLimit = Math.max(1, Math.min(50, limit));
  
  try {
    const endpoint = `${apiUrl}/${targetLanguage}/app/protagonist-page?limit=${validLimit}`;
    console.log('🌐 Making API request to:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 API response status:', response.status, 'ok:', response.ok);
    
    // Handle 404 - endpoint not found
    if (response.status === 404) {
      throw new Error('Protagonist endpoint not found. Please check your API configuration.');
    }
    
    if (response.status === 400) {
      const errorData: ProtagonistPageError = await response.json();
      throw new Error(errorData.error || `Invalid request parameters.`);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ProtagonistPageResponse = await response.json();
    
    console.log(`✅ Fetched ${data.protagonists.length} protagonists (total: ${data.total})`);
    
    return data.protagonists;
  } catch (error) {
    console.error('Error fetching protagonists from API:', error);
    throw error;
  }
}

/**
 * Fetch detailed protagonist data including montage scenes
 * @param personId - The protagonist ID
 * @param language - Language code (optional, defaults to detected language)
 * @returns ProtagonistDetail with scenes array
 */
export async function fetchProtagonistDetail(
  personId: number,
  language?: SupportedLanguage
): Promise<ProtagonistDetail> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error('API URL not configured. Please set EXPO_PUBLIC_API_URL in your .env file.');
  }
  
  const targetLanguage = language || detectUserLanguage();
  
  try {
    const endpoint = `${apiUrl}/${targetLanguage}/person/${personId}`;
    console.log('🌐 Fetching protagonist detail from:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Protagonist detail response status:', response.status);
    
    if (response.status === 404) {
      const errorData: ProtagonistDetailError = await response.json();
      throw new Error(errorData.error || 'Protagonist not found');
    }
    
    if (response.status === 400) {
      const errorData: ProtagonistDetailError = await response.json();
      throw new Error(errorData.error || 'Invalid request parameters');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ProtagonistDetailResponse = await response.json();
    
    if (!data.success) {
      throw new Error('API returned unsuccessful response');
    }
    
    console.log(`✅ Fetched protagonist detail: ${data.person.name} (${data.person.scenes?.length || 0} scenes)`);
    
    return data.person;
  } catch (error) {
    console.error('Error fetching protagonist detail from API:', error);
    throw error;
  }
}

/**
 * Extract montage scenes from protagonist detail
 * Montage scenes are scenes where chapterId, decisionId, and eventId are all null
 * @param protagonist - ProtagonistDetail with scenes array
 * @returns Array of MontageScene sorted by orderIndex
 */
export function getMontageScenes(protagonist: ProtagonistDetail): MontageScene[] {
  if (!protagonist.scenes || protagonist.scenes.length === 0) {
    return [];
  }
  
  // Filter montage scenes (intro/historical context scenes)
  const montageScenes = protagonist.scenes.filter((scene) => 
    scene.chapterId === null && 
    scene.decisionId === null && 
    scene.eventId === null
  );
  
  // Sort by orderIndex
  return montageScenes.sort((a, b) => a.orderIndex - b.orderIndex);
}

/**
 * Combine all montage scene voiceover texts into a single paragraph
 * @param scenes - Array of MontageScene
 * @returns Combined text as a single paragraph
 */
export function combineVoiceoverText(scenes: MontageScene[]): string {
  if (!scenes || scenes.length === 0) {
    return '';
  }
  
  // Sort by orderIndex to ensure correct order
  const sortedScenes = [...scenes].sort((a, b) => a.orderIndex - b.orderIndex);
  
  // Extract voiceover text (prefer voiceover, fallback to text)
  const texts = sortedScenes
    .map((scene) => scene.voiceover || scene.text)
    .filter((text) => text && text.trim().length > 0);
  
  // Join with spaces to form a paragraph
  return texts.join(' ');
}

/**
 * Fetch chapter detail data including scenes, events, and decisions
 * @param personId - The protagonist ID
 * @param chapterNumber - The chapter number (1, 2, 3, etc.)
 * @param language - Language code (optional, defaults to detected language)
 * @returns ChapterDetailResponse with full chapter data
 */
export async function fetchChapterDetail(
  personId: number,
  chapterNumber: number,
  language?: SupportedLanguage
): Promise<ChapterDetailResponse> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error('API URL not configured. Please set EXPO_PUBLIC_API_URL in your .env file.');
  }
  
  const targetLanguage = language || detectUserLanguage();
  
  try {
    const endpoint = `${apiUrl}/${targetLanguage}/app/chapters/${personId}/${chapterNumber}`;
    console.log('🌐 Fetching chapter detail from:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Chapter detail response status:', response.status);
    
    if (response.status === 404) {
      const errorData: ChapterDetailError = await response.json();
      throw new Error(errorData.error || 'Chapter not found');
    }
    
    if (response.status === 400) {
      const errorData: ChapterDetailError = await response.json();
      throw new Error(errorData.error || 'Invalid request parameters');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ChapterDetailResponse = await response.json();
    
    if (!data.success) {
      throw new Error('API returned unsuccessful response');
    }
    
    console.log(`✅ Fetched chapter detail: Chapter ${data.chapterNumber} - ${data.chapter.title}`);
    
    return data;
  } catch (error) {
    console.error('Error fetching chapter detail from API:', error);
    throw error;
  }
}

