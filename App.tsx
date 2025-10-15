import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, Merriweather_400Regular, Merriweather_400Regular_Italic, Merriweather_700Bold, Merriweather_700Bold_Italic } from '@expo-google-fonts/merriweather';
import { ThemeProvider } from './src/theme';
import { ScenarioProvider, useScenario } from './src/store/ScenarioContext';
import SplashScreen from './src/screens/SplashScreen';
import TabNavigator from './src/navigation/TabNavigator';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { fetchScenario, loading: scenarioLoading, error: scenarioError } = useScenario();
  
  let [fontsLoaded] = useFonts({
    Merriweather_400Regular,
    Merriweather_400Regular_Italic,
    Merriweather_700Bold,
    Merriweather_700Bold_Italic,
  });

  useEffect(() => {
    // Fetch scenario data when app loads
    fetchScenario();
  }, [fetchScenario]);

  useEffect(() => {
    // Hide splash screen after:
    // 1. Fonts are loaded
    // 2. Scenario is loaded (or failed with error)
    // 3. Minimum splash duration of 3 seconds
    if (fontsLoaded && !scenarioLoading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000); // Minimum 3 seconds to match progress bar

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, scenarioLoading]);

  // Don't render until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {showSplash ? <SplashScreen /> : <TabNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider initialTheme="dark">
      <ScenarioProvider>
        <AppContent />
      </ScenarioProvider>
    </ThemeProvider>
  );
}