export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  description: string;
  imageUrl: string | null;
  date: string; // ISO date string for the historical event
  language: string; // Language code (en, es, fr, de, zh)
}

export interface ScenarioApiResponse {
  success: boolean;
  data?: Scenario;
  error?: string;
}

