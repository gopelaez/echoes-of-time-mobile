/**
 * Simple Node.js script to test the scenario API functionality
 * Run with: node scripts/test-scenario-api.js
 */

const mockScenarios = [
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
    imageUrl: 'bastille',
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

function getScenarioIndexForDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const seed = year * 10000 + month * 100 + day;
  return seed % mockScenarios.length;
}

function getScenarioOfTheDay(date = new Date()) {
  const index = getScenarioIndexForDate(date);
  return mockScenarios[index];
}

// Test with today's date
console.log('=== Testing Scenario of the Day ===\n');
console.log('Today:', new Date().toLocaleDateString());
const todayScenario = getScenarioOfTheDay();
console.log('Scenario:', todayScenario.title.replace(/\\n/g, ' '));
console.log('Location:', todayScenario.subtitle);
console.log('Description:', todayScenario.description);
console.log('\n');

// Test determinism (same date should give same scenario)
console.log('=== Testing Determinism ===');
const testDate = new Date('2024-01-15');
const scenario1 = getScenarioOfTheDay(testDate);
const scenario2 = getScenarioOfTheDay(testDate);
console.log('Same date gives same scenario:', scenario1.id === scenario2.id ? '✅ PASS' : '❌ FAIL');
console.log('\n');

// Test different dates give (potentially) different scenarios
console.log('=== Testing Different Dates ===');
const dates = [
  new Date('2024-01-01'),
  new Date('2024-01-02'),
  new Date('2024-01-03'),
  new Date('2024-01-04'),
  new Date('2024-01-05'),
];

dates.forEach(date => {
  const scenario = getScenarioOfTheDay(date);
  console.log(`${date.toLocaleDateString()}: ${scenario.title.replace(/\\n/g, ' ')}`);
});

console.log('\n=== All Tests Complete ===');

