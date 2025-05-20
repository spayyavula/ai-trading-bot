import '@types/jest';
import { performanceService } from '../services/performance';
import { apiClient } from '../client';

jest.mock('../client');

describe('Performance Service', () => {
  const mockPerformanceData = [
    {
      timestamp: '2024-01-01',
      traderPerformance: 100,
      sp500Performance: 100,
      nasdaqPerformance: 100,
      dowPerformance: 100
    },
    {
      timestamp: '2024-01-02',
      traderPerformance: 105,
      sp500Performance: 102,
      nasdaqPerformance: 103,
      dowPerformance: 101
    },
    {
      timestamp: '2024-01-03',
      traderPerformance: 110,
      sp500Performance: 104,
      nasdaqPerformance: 106,
      dowPerformance: 102
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPerformanceData', () => {
    it('should fetch performance data successfully', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockPerformanceData });

      const result = await performanceService.getPerformanceData('2024-01-01', '2024-01-03');
      
      expect(result).toEqual(mockPerformanceData);
      expect(apiClient.get).toHaveBeenCalledWith('/analytics/performance', {
        params: { startDate: '2024-01-01', endDate: '2024-01-03' }
      });
    });

    it('should handle API errors', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      await expect(performanceService.getPerformanceData('2024-01-01', '2024-01-03'))
        .rejects.toThrow('API Error');
    });
  });

  describe('getBenchmarkData', () => {
    it('should fetch and combine benchmark data successfully', async () => {
      (apiClient.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPerformanceData })
        .mockResolvedValueOnce({ data: [{ performance: 100 }, { performance: 102 }, { performance: 104 }] })
        .mockResolvedValueOnce({ data: [{ performance: 100 }, { performance: 103 }, { performance: 106 }] })
        .mockResolvedValueOnce({ data: [{ performance: 100 }, { performance: 101 }, { performance: 102 }] });

      const result = await performanceService.getBenchmarkData('2024-01-01', '2024-01-03');
      
      expect(result).toEqual(mockPerformanceData);
      expect(apiClient.get).toHaveBeenCalledTimes(4);
    });

    it('should handle API errors in benchmark data', async () => {
      (apiClient.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPerformanceData })
        .mockRejectedValueOnce(new Error('API Error'));

      await expect(performanceService.getBenchmarkData('2024-01-01', '2024-01-03'))
        .rejects.toThrow('API Error');
    });
  });

  describe('calculateMetrics', () => {
    it('should calculate metrics correctly', () => {
      const metrics = performanceService.calculateMetrics(mockPerformanceData);

      expect(metrics).toEqual({
        traderReturn: 10, // (110 - 100) / 100 * 100
        sp500Return: 4,   // (104 - 100) / 100 * 100
        nasdaqReturn: 6,  // (106 - 100) / 100 * 100
        dowReturn: 2,     // (102 - 100) / 100 * 100
        outperformance: 6, // 10 - 4
        sharpeRatio: expect.any(Number),
        maxDrawdown: 0
      });
    });

    it('should handle empty data', () => {
      const metrics = performanceService.calculateMetrics([]);

      expect(metrics).toEqual({
        traderReturn: 0,
        sp500Return: 0,
        nasdaqReturn: 0,
        dowReturn: 0,
        outperformance: 0,
        sharpeRatio: 0,
        maxDrawdown: 0
      });
    });

    it('should calculate drawdown correctly', () => {
      const dataWithDrawdown = [
        { timestamp: '2024-01-01', traderPerformance: 100, sp500Performance: 100, nasdaqPerformance: 100, dowPerformance: 100 },
        { timestamp: '2024-01-02', traderPerformance: 110, sp500Performance: 100, nasdaqPerformance: 100, dowPerformance: 100 },
        { timestamp: '2024-01-03', traderPerformance: 90, sp500Performance: 100, nasdaqPerformance: 100, dowPerformance: 100 }
      ];

      const metrics = performanceService.calculateMetrics(dataWithDrawdown);
      expect(metrics.maxDrawdown).toBeCloseTo(18.18, 2); // (110 - 90) / 110 * 100
    });
  });
}); 