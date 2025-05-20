import { apiClient } from '../client';
import { ANALYTICS_ENDPOINTS } from '../endpoints';

export interface PerformanceData {
  timestamp: string;
  traderPerformance: number;
  sp500Performance: number;
  nasdaqPerformance: number;
  dowPerformance: number;
}

export interface PerformanceMetrics {
  traderReturn: number;
  sp500Return: number;
  nasdaqReturn: number;
  dowReturn: number;
  outperformance: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export const performanceService = {
  getPerformanceData: async (startDate: string, endDate: string): Promise<PerformanceData[]> => {
    const response = await apiClient.get(ANALYTICS_ENDPOINTS.PERFORMANCE, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  getBenchmarkData: async (startDate: string, endDate: string): Promise<PerformanceData[]> => {
    // Fetch trader's performance data
    const traderData = await performanceService.getPerformanceData(startDate, endDate);
    
    // Fetch index data (S&P 500, NASDAQ, Dow Jones)
    const indexData = await Promise.all([
      apiClient.get('/market/indices/sp500', { params: { startDate, endDate } }),
      apiClient.get('/market/indices/nasdaq', { params: { startDate, endDate } }),
      apiClient.get('/market/indices/dow', { params: { startDate, endDate } })
    ]);

    // Combine the data
    return traderData.map((data, index) => ({
      timestamp: data.timestamp,
      traderPerformance: data.traderPerformance,
      sp500Performance: indexData[0].data[index].performance,
      nasdaqPerformance: indexData[1].data[index].performance,
      dowPerformance: indexData[2].data[index].performance
    }));
  },

  calculateMetrics: (data: PerformanceData[]): PerformanceMetrics => {
    if (data.length === 0) {
      return {
        traderReturn: 0,
        sp500Return: 0,
        nasdaqReturn: 0,
        dowReturn: 0,
        outperformance: 0,
        sharpeRatio: 0,
        maxDrawdown: 0
      };
    }

    const calculateReturn = (values: number[]): number => {
      const startValue = values[0];
      const endValue = values[values.length - 1];
      return ((endValue - startValue) / startValue) * 100;
    };

    const calculateSharpeRatio = (returns: number[]): number => {
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const stdDev = Math.sqrt(
        returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length
      );
      return avgReturn / stdDev;
    };

    const calculateMaxDrawdown = (values: number[]): number => {
      let maxDrawdown = 0;
      let peak = values[0];

      for (const value of values) {
        if (value > peak) {
          peak = value;
        }
        const drawdown = (peak - value) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }

      return maxDrawdown * 100;
    };

    const traderReturn = calculateReturn(data.map(d => d.traderPerformance));
    const sp500Return = calculateReturn(data.map(d => d.sp500Performance));
    const nasdaqReturn = calculateReturn(data.map(d => d.nasdaqPerformance));
    const dowReturn = calculateReturn(data.map(d => d.dowPerformance));

    const traderReturns = data.map((d, i) => 
      i > 0 ? (d.traderPerformance - data[i-1].traderPerformance) / data[i-1].traderPerformance : 0
    );

    return {
      traderReturn,
      sp500Return,
      nasdaqReturn,
      dowReturn,
      outperformance: traderReturn - sp500Return,
      sharpeRatio: calculateSharpeRatio(traderReturns),
      maxDrawdown: calculateMaxDrawdown(data.map(d => d.traderPerformance))
    };
  }
}; 