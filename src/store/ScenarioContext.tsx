import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Scenario } from '../types/scenario';
import { fetchScenarioOfTheDay } from '../services/scenarioService';
import { useLanguage } from './LanguageContext';

interface ScenarioContextType {
  scenario: Scenario | null;
  loading: boolean;
  error: string | null;
  fetchScenario: () => Promise<void>;
  refetchScenario: () => Promise<void>;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

interface ScenarioProviderProps {
  children: ReactNode;
}

export function ScenarioProvider({ children }: ScenarioProviderProps) {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchScenario = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching scenario with language:', language, 'type:', typeof language);
      console.log('🔄 Previous scenario language:', scenario?.language);
      
      // Always fetch when language changes or no scenario exists
      const data = await fetchScenarioOfTheDay(language);
      setScenario(data);
      console.log('✅ Scenario fetched successfully for language:', language);
      console.log('📊 New scenario language:', data.language);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load scenario';
      setError(errorMessage);
      console.error('❌ Error fetching scenario for language:', language, err);
    } finally {
      setLoading(false);
    }
  }, [language]);

  const refetchScenario = useCallback(async () => {
    await fetchScenario();
  }, [fetchScenario]);

  // Fetch scenario when language changes (includes initial mount)
  React.useEffect(() => {
    if (language) {
      console.log('🌍 Language changed to:', language, 'fetching scenario...');
      console.log('🌍 Current scenario language before fetch:', scenario?.language);
      fetchScenario();
    }
  }, [language]);

  // Debug: Log when language changes
  React.useEffect(() => {
    console.log('🌍 LanguageContext language changed:', language);
  }, [language]);

  const value: ScenarioContextType = {
    scenario,
    loading,
    error,
    fetchScenario,
    refetchScenario,
  };

  return (
    <ScenarioContext.Provider value={value}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario(): ScenarioContextType {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context;
}

