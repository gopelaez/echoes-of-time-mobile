import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { ScenarioProvider, useScenario } from '../ScenarioContext';
import * as scenarioService from '../../services/scenarioService';

// Mock the scenarioService
jest.mock('../../services/scenarioService');

describe('ScenarioContext', () => {
  const mockScenario = {
    id: '1',
    title: 'Test Scenario',
    subtitle: 'Test Location, 2024',
    location: 'Test Location',
    description: 'Test description',
    imageUrl: 'test',
    date: '2024-01-01',
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ScenarioProvider>{children}</ScenarioProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide initial state', () => {
    const { result } = renderHook(() => useScenario(), { wrapper });

    expect(result.current.scenario).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should fetch scenario successfully', async () => {
    (scenarioService.fetchScenarioOfTheDay as jest.Mock).mockResolvedValue(mockScenario);

    const { result } = renderHook(() => useScenario(), { wrapper });

    await act(async () => {
      await result.current.fetchScenario();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.scenario).toEqual(mockScenario);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Failed to load scenario';
    (scenarioService.fetchScenarioOfTheDay as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useScenario(), { wrapper });

    await act(async () => {
      await result.current.fetchScenario();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.scenario).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });

  it('should refetch scenario when refetchScenario is called', async () => {
    (scenarioService.fetchScenarioOfTheDay as jest.Mock).mockResolvedValue(mockScenario);

    const { result } = renderHook(() => useScenario(), { wrapper });

    await act(async () => {
      await result.current.fetchScenario();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear mock to verify refetch
    (scenarioService.fetchScenarioOfTheDay as jest.Mock).mockClear();

    await act(async () => {
      await result.current.refetchScenario();
    });

    expect(scenarioService.fetchScenarioOfTheDay).toHaveBeenCalledTimes(1);
  });

  it('should throw error when useScenario is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useScenario());
    }).toThrow('useScenario must be used within a ScenarioProvider');

    consoleSpy.mockRestore();
  });
});

