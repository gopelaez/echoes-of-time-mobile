import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Merriweather_400Regular, Merriweather_400Regular_Italic, Merriweather_700Bold, Merriweather_700Bold_Italic } from '@expo-google-fonts/merriweather';
import { ThemeProvider } from './src/theme';
import { LanguageProvider, useLanguage } from './src/store/LanguageContext';
import { ScenarioProvider, useScenario } from './src/store/ScenarioContext';
import SplashScreen from './src/screens/SplashScreen';
import TabNavigator from './src/navigation/TabNavigator';
import './src/i18n/config'; // Initialize i18next
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n/config';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { fetchScenario, loading: scenarioLoading, error: scenarioError } = useScenario();
  const { language, isLoading: languageLoading } = useLanguage();
  
  console.log('📱 AppContent - language:', language, 'languageLoading:', languageLoading);
  
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
    // 2. Language is loaded
    // 3. Scenario is loaded (or failed with error)
    // 4. Minimum splash duration of 3 seconds
    if (fontsLoaded && !languageLoading && !scenarioLoading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000); // Minimum 3 seconds to match progress bar

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, languageLoading, scenarioLoading]);

  // Don't render until fonts and language are loaded
  if (!fontsLoaded || languageLoading) {
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
    <SafeAreaProvider>
      <ThemeProvider initialTheme="dark">
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
            <ScenarioProvider>
              <AppContent />
            </ScenarioProvider>
          </LanguageProvider>
        </I18nextProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}