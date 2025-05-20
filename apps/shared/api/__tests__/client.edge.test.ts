import { apiClient } from '../client';
import { mockApiResponse, mockApiError } from '../../test-utils/testUtils';

describe('ApiClient Edge Cases', () => {
  describe('Error Handling', () => {
    it('handles network timeout', async () => {
      jest.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('Network timeout'));
      await expect(apiClient.getQuote('AAPL')).rejects.toThrow('Network timeout');
    });

    it('handles malformed response', async () => {
      jest.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: null, status: 200 });
      const response = await apiClient.getQuote('AAPL');
      expect(response.data).toBeNull();
    });

    it('handles empty response array', async () => {
      jest.spyOn(apiClient, 'get').mockResolvedValueOnce(mockApiResponse([]));
      const response = await apiClient.getTrades();
      expect(response.data).toEqual([]);
    });
  });

  describe('Input Validation', () => {
    it('handles empty symbol', async () => {
      await expect(apiClient.getQuote('')).rejects.toThrow('Invalid symbol');
    });

    it('handles invalid expiration date', async () => {
      await expect(apiClient.getOptionChain('AAPL', 'invalid-date')).rejects.toThrow('Invalid expiration date');
    });

    it('handles negative quantity in trade', async () => {
      const tradeData = {
        symbol: 'AAPL',
        type: 'CALL',
        strikePrice: 150.0,
        expirationDate: '2024-01-19',
        quantity: -1,
      };
      await expect(apiClient.createTrade(tradeData)).rejects.toThrow('Invalid quantity');
    });
  });

  describe('Rate Limiting', () => {
    it('handles rate limit exceeded', async () => {
      jest.spyOn(apiClient, 'get').mockRejectedValueOnce(mockApiError('Rate limit exceeded', 429));
      await expect(apiClient.getQuote('AAPL')).rejects.toThrow('Rate limit exceeded');
    });

    it('retries after rate limit', async () => {
      const mockGet = jest.spyOn(apiClient, 'get')
        .mockRejectedValueOnce(mockApiError('Rate limit exceeded', 429))
        .mockResolvedValueOnce(mockApiResponse({ symbol: 'AAPL', price: 150.0 }));
      
      const response = await apiClient.getQuote('AAPL');
      expect(mockGet).toHaveBeenCalledTimes(2);
      expect(response.data.price).toBe(150.0);
    });
  });

  describe('Batch Operations', () => {
    it('handles partial batch failure', async () => {
      const symbols = ['AAPL', 'INVALID', 'MSFT'];
      const response = await apiClient.getQuotes(symbols);
      expect(response.data).toHaveLength(2);
      expect(response.errors).toHaveLength(1);
    });

    it('handles empty batch request', async () => {
      const response = await apiClient.getQuotes([]);
      expect(response.data).toEqual([]);
      expect(response.errors).toEqual([]);
    });
  });

  describe('WebSocket Integration', () => {
    it('handles WebSocket disconnection during request', async () => {
      jest.spyOn(apiClient, 'get').mockImplementationOnce(() => {
        throw new Error('WebSocket disconnected');
      });
      await expect(apiClient.getQuote('AAPL')).rejects.toThrow('WebSocket disconnected');
    });

    it('handles reconnection after WebSocket failure', async () => {
      const mockGet = jest.spyOn(apiClient, 'get')
        .mockRejectedValueOnce(new Error('WebSocket disconnected'))
        .mockResolvedValueOnce(mockApiResponse({ symbol: 'AAPL', price: 150.0 }));
      
      const response = await apiClient.getQuote('AAPL');
      expect(mockGet).toHaveBeenCalledTimes(2);
      expect(response.data.price).toBe(150.0);
    });
  });
}); 