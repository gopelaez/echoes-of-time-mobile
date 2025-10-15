import { Scenario, ScenarioApiResponse } from '../types/scenario';

// Mock database of historical scenarios
const SCENARIOS: Scenario[] = [
  {
    id: '1',
    title: 'The Fall of\nthe Bastille',
    subtitle: 'Paris, 1789',
    location: 'Paris',
    description: 'A guard must choose between duty and revolution.',
    imageUrl: 'bastille',
    date: '1789-07-14',
  },
  {
    id: '2',
    title: 'The Signing of the\nDeclaration',
    subtitle: 'Philadelphia, 1776',
    location: 'Philadelphia',
    description: 'A delegate faces the weight of treason and freedom.',
    imageUrl: 'bastille', // Reusing for now
    date: '1776-07-04',
  },
  {
    id: '3',
    title: 'Crossing the\nRubicon',
    subtitle: 'Roman Republic, 49 BC',
    location: 'Italy',
    description: 'Caesar makes a decision that will change history forever.',
    imageUrl: 'bastille',
    date: '-0049-01-10',
  },
  {
    id: '4',
    title: 'The Moon\nLanding',
    subtitle: 'Sea of Tranquility, 1969',
    location: 'Moon',
    description: 'One small step for man, one giant leap for mankind.',
    imageUrl: 'bastille',
    date: '1969-07-20',
  },
  {
    id: '5',
    title: 'The Berlin\nWall Falls',
    subtitle: 'Berlin, 1989',
    location: 'Berlin',
    description: 'A border guard must decide: follow orders or make history.',
    imageUrl: 'bastille',
    date: '1989-11-09',
  },
  {
    id: '6',
    title: 'The Battle\nof Hastings',
    subtitle: 'England, 1066',
    location: 'Hastings',
    description: 'A Saxon warrior stands at the turning point of English history.',
    imageUrl: 'bastille',
    date: '1066-10-14',
  },
  {
    id: '7',
    title: 'The Printing\nPress',
    subtitle: 'Mainz, 1440',
    location: 'Mainz',
    description: 'Gutenberg unveils an invention that will change the world.',
    imageUrl: 'bastille',
    date: '1440-01-01',
  },
];

/**
 * Deterministically selects a scenario based on the current date
 * Same date = same scenario for all users
 */
function getScenarioIndexForDate(date: Date): number {
  // Create a seed from the date (YYYYMMDD format)
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Simple deterministic hash: combine year, month, day
  const seed = year * 10000 + month * 100 + day;
  
  // Use modulo to get an index within our scenarios array
  return seed % SCENARIOS.length;
}

/**
 * Simulates fetching the scenario of the day from an API
 * Returns the same scenario for the same date
 */
export async function getScenarioOfTheDay(): Promise<ScenarioApiResponse> {
  // Simulate network delay (500-1000ms)
  const delay = Math.random() * 500 + 500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate occasional errors (5% chance)
  if (Math.random() < 0.05) {
    return {
      success: false,
      error: 'Failed to fetch scenario. Please try again.',
    };
  }

  // Get today's scenario
  const today = new Date();
  const scenarioIndex = getScenarioIndexForDate(today);
  const scenario = SCENARIOS[scenarioIndex];

  return {
    success: true,
    data: scenario,
  };
}

/**
 * Get a specific scenario by ID (for testing)
 */
export async function getScenarioById(id: string): Promise<ScenarioApiResponse> {
  const delay = Math.random() * 300 + 200;
  await new Promise(resolve => setTimeout(resolve, delay));

  const scenario = SCENARIOS.find(s => s.id === id);
  
  if (!scenario) {
    return {
      success: false,
      error: 'Scenario not found',
    };
  }

  return {
    success: true,
    data: scenario,
  };
}

