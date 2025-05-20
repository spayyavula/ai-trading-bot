import axios from 'axios';
import { RSI, MACD } from 'technicalindicators';

export interface OptionChain {
  symbol: string;
  strike: number;
  expiration: string;
  type: 'call' | 'put';
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  rsi: number;
  macd: {
    MACD: number;
    signal: number;
    histogram: number;
  };
  support: {
    s1: number;
    s2: number;
  };
  resistance: {
    r1: number;
    r2: number;
  };
}

class OptionsAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.polygon.io';
  }

  async getOptionsChain(symbol: string, expiration: string): Promise<OptionChain[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/v3/reference/options/contracts`, {
        params: {
          underlying_ticker: symbol,
          expiration_date: expiration,
          apiKey: this.apiKey
        }
      });

      return response.data.results;
    } catch (error) {
      console.error('Error fetching options chain:', error);
      throw error;
    }
  }

  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      // Get price data
      const priceResponse = await axios.get(`${this.baseUrl}/v2/last/trade/${symbol}`, {
        params: {
          apiKey: this.apiKey
        }
      });

      // Get historical data for indicators
      const historicalResponse = await axios.get(`${this.baseUrl}/v2/aggs/ticker/${symbol}/range/1/day/2023-01-01/2023-12-31`, {
        params: {
          apiKey: this.apiKey
        }
      });

      const prices = historicalResponse.data.results.map((r: any) => r.c);
      
      // Calculate RSI
      const rsi = RSI.calculate({
        values: prices,
        period: 14
      });

      // Calculate MACD
      const macd = MACD.calculate({
        values: prices,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9
      });

      // Calculate Support/Resistance levels
      const { s1, s2, r1, r2 } = this.calculateSupportResistance(prices);

      return {
        symbol,
        price: priceResponse.data.results.p,
        change: priceResponse.data.results.c,
        changePercent: priceResponse.data.results.cp,
        volume: priceResponse.data.results.s,
        rsi: rsi[rsi.length - 1],
        macd: macd[macd.length - 1],
        support: { s1, s2 },
        resistance: { r1, r2 }
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  private calculateSupportResistance(prices: number[]): { s1: number; s2: number; r1: number; r2: number } {
    const recentPrices = prices.slice(-20);
    const min = Math.min(...recentPrices);
    const max = Math.max(...recentPrices);
    const range = max - min;

    return {
      s1: min + range * 0.236,
      s2: min + range * 0.382,
      r1: max - range * 0.236,
      r2: max - range * 0.382
    };
  }
}

export default OptionsAPI; 