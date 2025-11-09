import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupportedLanguage, detectUserLanguage, isSupportedLanguage } from '../utils/languageDetection';
import i18n from '../i18n/config';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const LANGUAGE_STORAGE_KEY = '@echoes_of_time_language';

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  console.log('🌍 LanguageProvider render - language:', language, 'isLoading:', isLoading);

  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

        if (savedLanguage && isSupportedLanguage(savedLanguage)) {
          console.log('🌍 Using saved language:', savedLanguage);
          setLanguageState(savedLanguage);
          // Initialize i18next with saved language
          await i18n.changeLanguage(savedLanguage);
          console.log('🌍 i18next initialized with saved language:', savedLanguage);
        } else {
          console.log('🌍 No saved language, detecting...');
          const detectedLanguage = detectUserLanguage();
          console.log('🌍 Setting detected language:', detectedLanguage);
          setLanguageState(detectedLanguage);
          // Initialize i18next with detected language
          await i18n.changeLanguage(detectedLanguage);
          console.log('🌍 i18next initialized with detected language:', detectedLanguage);
        }
      } catch (error) {
        console.warn('Error loading language preference:', error);
        const detectedLanguage = detectUserLanguage();
        setLanguageState(detectedLanguage);
        // Initialize i18next with detected language even on error
        await i18n.changeLanguage(detectedLanguage);
        console.log('🌍 i18next initialized with detected language (error case):', detectedLanguage);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguagePreference();
  }, []);

  const setLanguage = useCallback(async (newLanguage: SupportedLanguage) => {
    console.log('🌍 setLanguage called with:', newLanguage);
    console.log('🌍 Current language before change:', language);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguageState(newLanguage);
      console.log('🌍 Language state updated to:', newLanguage);
      // Sync with i18next
      await i18n.changeLanguage(newLanguage);
      console.log('🌍 i18next language changed to:', newLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
      setLanguageState(newLanguage);
    }
  }, [language]);

  const value: LanguageContextType = useMemo(() => ({
    language,
    setLanguage,
    isLoading,
  }), [language, setLanguage, isLoading]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}