// Set up global fetch for tests (if not already available)
global.fetch = global.fetch || jest.fn();

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true]),
}));

// Mock @expo-google-fonts
jest.mock('@expo-google-fonts/merriweather', () => ({
  useFonts: jest.fn(() => [true]),
  Merriweather_400Regular: 'Merriweather_400Regular',
  Merriweather_400Regular_Italic: 'Merriweather_400Regular_Italic',
  Merriweather_700Bold: 'Merriweather_700Bold',
  Merriweather_700Bold_Italic: 'Merriweather_700Bold_Italic',
}));

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

