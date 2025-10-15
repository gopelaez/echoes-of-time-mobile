export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  description: string;
  imageUrl: string;
  date: string; // ISO date string for the historical event
}

export interface ScenarioApiResponse {
  success: boolean;
  data?: Scenario;
  error?: string;
}

