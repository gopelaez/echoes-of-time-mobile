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

