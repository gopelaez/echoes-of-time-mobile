import { fetchScenarioOfTheDay } from '../scenarioService';
import * as mockScenarioApi from '../mockScenarioApi';

// Mock the mockScenarioApi module
jest.mock('../mockScenarioApi');

describe('scenarioService', () => {
  describe('fetchScenarioOfTheDay', () => {
    it('should return scenario data when API call is successful', async () => {
      const mockScenario = {
        id: '1',
        title: 'Test Scenario',
        subtitle: 'Test Location, 2024',
        location: 'Test Location',
        description: 'Test description',
        imageUrl: 'test',
        date: '2024-01-01',
      };

      (mockScenarioApi.getScenarioOfTheDay as jest.Mock).mockResolvedValue({
        success: true,
        data: mockScenario,
      });

      const result = await fetchScenarioOfTheDay();
      
      expect(result).toEqual(mockScenario);
      expect(mockScenarioApi.getScenarioOfTheDay).toHaveBeenCalledTimes(1);
    });

    it('should throw error when API call fails', async () => {
      (mockScenarioApi.getScenarioOfTheDay as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Network error',
      });

      await expect(fetchScenarioOfTheDay()).rejects.toThrow('Network error');
    });

    it('should throw error when API returns no data', async () => {
      (mockScenarioApi.getScenarioOfTheDay as jest.Mock).mockResolvedValue({
        success: true,
        data: null,
      });

      await expect(fetchScenarioOfTheDay()).rejects.toThrow('Failed to fetch scenario');
    });
  });
});

