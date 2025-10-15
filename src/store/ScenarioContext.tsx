import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Scenario } from '../types/scenario';
import { fetchScenarioOfTheDay } from '../services/scenarioService';

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

  const fetchScenario = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchScenarioOfTheDay();
      setScenario(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load scenario';
      setError(errorMessage);
      console.error('Error fetching scenario:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchScenario = useCallback(async () => {
    await fetchScenario();
  }, [fetchScenario]);

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

