/**
 * Protagonist Types
 * Data structures for protagonist (Lives) feature
 */

export interface Period {
  id: number;
  slug: string;
  name: string;
  description: string;
}

export interface Archetype {
id: number;
  slug: string;
  name: string;
  description: string;
}

export interface PersonArchetype {
  archetype: Archetype;
}

export type ProtagonistScope = 'world_known' | 'regional' | 'national' | 'local';

export interface Protagonist {
  id: number;
  name: string;
  birthYear: number | null;
  deathYear: number | null;
  description: string;
  coverImage: string | null;
  protagonistPortraitUrl: string | null;
  worldImageUrl: string | null;
  scope: ProtagonistScope;
  primaryRegion: string | null;
  primaryCountry: string | null;
  enabledAt: string;
  period: Period | null;
  personArchetypes: PersonArchetype[];
  chapterCount?: number;
  chapters?: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export interface ProtagonistPageResponse {
  success: boolean;
  protagonists: Protagonist[];
  total: number;
  limit: number;
  language: string;
}

export interface ProtagonistPageError {
  success: false;
  error: string;
  message?: string;
}

/**
 * Montage Scene - Historical context/intro scene
 */
export interface MontageScene {
  id: number;
  personId: number;
  chapterId: number | null;
  decisionId: number | null;
  eventId: number | null;
  orderIndex: number;
  imageUrl: string | null;
  audioUrl: string | null;
  voiceover: string | null;
  text: string;
  animation: string | null;
  year: number | null;
  durationMs: number | null;
  language: string;
}

/**
 * Chapter - Chapter data structure
 */
export interface Chapter {
  id: number;
  chapterNumber: number;
  title: string;
  figurineUrl?: string | null;
  figurinePrompt?: string | null;
  scenes?: MontageScene[];
  decisions?: any[];
}

/**
 * Full Chapter Detail - Complete chapter data from API
 */
export interface ChapterDetail {
  id: number;
  chapterNumber: number;
  title: string;
  yearsCovered: string | null;
  chapterDescription: string | null;
  historicalContext: string | null;
  finalWords: string | null;
  cinematicMetadata: {
    voiceoverSummary: string | null;
    musicBrief: string | null;
  } | null;
  storyBeats: Array<{
    index: number;
    type: 'cinematic' | 'historicalEvent' | 'decision';
    sceneId?: number;
    eventId?: number;
    decisionId?: number;
  }> | null;
  figurinePrompt: string | null;
  figurineUrl: string | null;
  status: string;
  language: string;
  scenes: MontageScene[];
  historicalEvents: HistoricalEvent[];
  decisions: Decision[];
  sceneImages: Array<{
    sceneIndex: number;
    sceneId: number;
    imageUrl: string;
  }>;
  sceneAudio: Array<{
    sceneIndex: number;
    audioUrl: string;
  }>;
}

export interface HistoricalEvent {
  id: number;
  title: string;
  year: number;
  month: number | null;
  day: number | null;
  locations: string[];
  description: string | null;
  coverImage: string | null;
  coverPrompt: string | null;
  historicalEventId: string | null;
  historicalEventTitle: string | null;
  chapterOrder: number | null;
  historicalContextMetadata: {
    imageStyle: string | null;
    totalDurationMs: number | null;
  } | null;
  scenes: MontageScene[];
}

export interface Decision {
  id: number;
  title: string;
  year: number;
  month: number | null;
  day: number | null;
  locations: string[];
  description: string | null;
  coverImage: string | null;
  coverPrompt: string | null;
  historicalContextMetadata: {
    imageStyle: string | null;
    totalDurationMs: number | null;
    musicBrief: string | null;
  } | null;
  voiceType: string | null;
  reflectionQuestion: string | null;
  sourceType: string;
  sourceChapterId: number | null;
  historicalEventId: string | null;
  sourceEventId: number | null;
  status: string;
  choices: Choice[];
  citations: Citation[];
  scenes: MontageScene[];
}

export interface Choice {
  id: string;
  text: string;
  description: string;
  consequences: string;
  orderIndex: number;
  immediateOutcome: string | null;
  longTermImpact: string | null;
  historicalChoice: boolean;
  realityCheck: string | null;
  whatIf: string | null;
  imagePrompt: string | null;
  imageUrl: string | null;
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  description: string;
  reliability: 'high' | 'medium' | 'low';
}

export interface ChapterDetailResponse {
  success: true;
  chapter: ChapterDetail;
  personId: number;
  chapterNumber: number;
  language: string;
  protagonist: {
    id: number;
    name: string;
    birthYear: number | null;
    deathYear: number | null;
    protagonistPortraitUrl: string | null;
    worldImageUrl: string | null;
  };
}

export interface ChapterDetailError {
  success: false;
  error: string;
  message?: string;
  personId?: number;
  chapterNumber?: number;
}

/**
 * Protagonist Detail - Full protagonist data with scenes
 */
export interface ProtagonistDetail extends Protagonist {
  scenes: MontageScene[];
  chapters?: Chapter[];
}

/**
 * Protagonist Detail API Response
 */
export interface ProtagonistDetailResponse {
  success: boolean;
  person: ProtagonistDetail;
}

/**
 * Protagonist Detail API Error
 */
export interface ProtagonistDetailError {
  success: false;
  error: string;
  message?: string;
}

