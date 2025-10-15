import { getScenarioOfTheDay, getScenarioById } from '../mockScenarioApi';

describe('mockScenarioApi', () => {
  describe('getScenarioOfTheDay', () => {
    it('should return a successful response with scenario data', async () => {
      const response = await getScenarioOfTheDay();
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('subtitle');
      expect(response.data).toHaveProperty('location');
      expect(response.data).toHaveProperty('description');
      expect(response.data).toHaveProperty('imageUrl');
      expect(response.data).toHaveProperty('date');
    });

    it('should return the same scenario for the same date', async () => {
      const response1 = await getScenarioOfTheDay();
      const response2 = await getScenarioOfTheDay();
      
      expect(response1.data?.id).toBe(response2.data?.id);
    });

    it('should take at least 500ms to respond (simulates network delay)', async () => {
      const startTime = Date.now();
      await getScenarioOfTheDay();
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(500);
    });
  });

  describe('getScenarioById', () => {
    it('should return a scenario when valid ID is provided', async () => {
      const response = await getScenarioById('1');
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.id).toBe('1');
    });

    it('should return error when invalid ID is provided', async () => {
      const response = await getScenarioById('invalid-id');
      
      expect(response.success).toBe(false);
      expect(response.error).toBe('Scenario not found');
      expect(response.data).toBeUndefined();
    });
  });
});

