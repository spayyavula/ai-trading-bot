import { ApiClient } from '../client';
import { mockApiResponse, mockApiError } from '../../test-utils/testUtils';

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
  });

  describe('getQuote', () => {
    it('fetches quote data successfully', async () => {
      const mockData = {
        symbol: 'AAPL',
        price: 150.0,
        change: 2.5,
        volume: 1000000,
      };

      jest.spyOn(apiClient, 'get').mockResolvedValueOnce(mockApiResponse(mockData));

      const response = await apiClient.getQuote('AAPL');

      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
    });

    it('handles API errors', async () => {
      jest.spyOn(apiClient, 'get').mockRejectedValueOnce(mockApiError('API Error'));

      await expect(apiClient.getQuote('AAPL')).rejects.toThrow('API Error');
    });
  });

  describe('getOptionChain', () => {
    it('fetches option chain data successfully', async () => {
      const mockData = {
        symbol: 'AAPL',
        expirationDate: '2024-01-19',
        calls: [],
        puts: [],
      };

      jest.spyOn(apiClient, 'get').mockResolvedValueOnce(mockApiResponse(mockData));

      const response = await apiClient.getOptionChain('AAPL', '2024-01-19');

      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
    });

    it('handles API errors', async () => {
      jest.spyOn(apiClient, 'get').mockRejectedValueOnce(mockApiError('API Error'));

      await expect(apiClient.getOptionChain('AAPL', '2024-01-19')).rejects.toThrow('API Error');
    });
  });

  describe('createTrade', () => {
    it('creates a trade successfully', async () => {
      const tradeData = {
        symbol: 'AAPL',
        type: 'CALL',
        strikePrice: 150.0,
        expirationDate: '2024-01-19',
        quantity: 1,
      };

      const mockResponse = {
        id: '1',
        ...tradeData,
        status: 'OPEN',
        entryDate: new Date().toISOString(),
      };

      jest.spyOn(apiClient, 'post').mockResolvedValueOnce(mockApiResponse(mockResponse));

      const response = await apiClient.createTrade(tradeData);

      expect(response.data).toEqual(mockResponse);
      expect(response.status).toBe(200);
    });

    it('handles API errors', async () => {
      const tradeData = {
        symbol: 'AAPL',
        type: 'CALL',
        strikePrice: 150.0,
        expirationDate: '2024-01-19',
        quantity: 1,
      };

      jest.spyOn(apiClient, 'post').mockRejectedValueOnce(mockApiError('API Error'));

      await expect(apiClient.createTrade(tradeData)).rejects.toThrow('API Error');
    });
  });

  describe('getTrades', () => {
    it('fetches trades successfully', async () => {
      const mockData = [
        {
          id: '1',
          symbol: 'AAPL',
          type: 'CALL',
          status: 'OPEN',
          entryPrice: 2.5,
          quantity: 1,
          entryDate: new Date().toISOString(),
        },
      ];

      jest.spyOn(apiClient, 'get').mockResolvedValueOnce(mockApiResponse(mockData));

      const response = await apiClient.getTrades();

      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
    });

    it('handles API errors', async () => {
      jest.spyOn(apiClient, 'get').mockRejectedValueOnce(mockApiError('API Error'));

      await expect(apiClient.getTrades()).rejects.toThrow('API Error');
    });
  });

  describe('getProfile', () => {
    it('fetches user profile successfully', async () => {
      const mockData = {
        id: 'user1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
      };

      jest.spyOn(apiClient, 'get').mockResolvedValueOnce(mockApiResponse(mockData));

      const response = await apiClient.getProfile();

      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
    });

    it('handles API errors', async () => {
      jest.spyOn(apiClient, 'get').mockRejectedValueOnce(mockApiError('API Error'));

      await expect(apiClient.getProfile()).rejects.toThrow('API Error');
    });
  });

  describe('getSettings', () => {
    it('fetches user settings successfully', async () => {
      const mockData = {
        theme: 'LIGHT',
        notifications: {
          email: true,
          push: true,
          tradeAlerts: true,
        },
      };

      jest.spyOn(apiClient, 'get').mockResolvedValueOnce(mockApiResponse(mockData));

      const response = await apiClient.getSettings();

      expect(response.data).toEqual(mockData);
      expect(response.status).toBe(200);
    });

    it('handles API errors', async () => {
      jest.spyOn(apiClient, 'get').mockRejectedValueOnce(mockApiError('API Error'));

      await expect(apiClient.getSettings()).rejects.toThrow('API Error');
    });
  });
}); 