import { ApiResponse } from '../../types';
import { generateMarketData, generateMarketDataBatch, generateOptionChain } from './marketData';
import { generateNewsBatch, generateSentimentBatch } from './newsData';

class MockApiClient {
  private marketData: Record<string, any> = {};
  private newsData: any[] = [];
  private sentimentData: Record<string, any> = {};
  private basePrices: Record<string, number> = {
    AAPL: 150.0,
    MSFT: 280.0,
    GOOGL: 2750.0,
    AMZN: 3300.0,
    TSLA: 800.0,
  };

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Initialize market data
    this.marketData = generateMarketDataBatch(
      Object.keys(this.basePrices),
      this.basePrices
    ).reduce((acc, data) => {
      acc[data.symbol] = data;
      return acc;
    }, {} as Record<string, any>);

    // Initialize news data
    this.newsData = generateNewsBatch(
      Object.keys(this.basePrices),
      this.marketData
    );

    // Initialize sentiment data
    this.sentimentData = generateSentimentBatch(
      Object.keys(this.basePrices),
      this.marketData,
      this.newsData
    );
  }

  private simulateNetworkDelay(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, Math.random() * 500 + 100); // 100-600ms delay
    });
  }

  private createResponse<T>(data: T): ApiResponse<T> {
    return {
      data,
      status: 200,
      message: 'Success',
    };
  }

  // Market Data Endpoints
  async getQuote(symbol: string): Promise<ApiResponse<any>> {
    await this.simulateNetworkDelay();
    if (!this.marketData[symbol]) {
      throw new Error(`Symbol ${symbol} not found`);
    }
    return this.createResponse(this.marketData[symbol]);
  }

  async getOptionChain(symbol: string, expirationDate: string): Promise<ApiResponse<any>> {
    await this.simulateNetworkDelay();
    if (!this.basePrices[symbol]) {
      throw new Error(`Symbol ${symbol} not found`);
    }
    return this.createResponse(
      generateOptionChain(symbol, this.basePrices[symbol], expirationDate)
    );
  }

  // News Endpoints
  async getNews(symbol?: string): Promise<ApiResponse<any[]>> {
    await this.simulateNetworkDelay();
    const news = symbol
      ? this.newsData.filter((item) => item.symbols.includes(symbol))
      : this.newsData;
    return this.createResponse(news);
  }

  // Sentiment Endpoints
  async getSentiment(symbol: string): Promise<ApiResponse<any>> {
    await this.simulateNetworkDelay();
    if (!this.sentimentData[symbol]) {
      throw new Error(`Symbol ${symbol} not found`);
    }
    return this.createResponse(this.sentimentData[symbol]);
  }

  // Trading Endpoints
  async getTrades(params?: Record<string, any>): Promise<ApiResponse<any[]>> {
    await this.simulateNetworkDelay();
    // Mock trades data
    const trades = [
      {
        id: '1',
        symbol: 'AAPL',
        type: 'CALL',
        status: 'OPEN',
        entryPrice: 2.5,
        quantity: 1,
        entryDate: new Date().toISOString(),
        notes: 'Test trade',
        tags: ['test'],
        userId: 'user1',
      },
    ];
    return this.createResponse(trades);
  }

  async createTrade(tradeData: any): Promise<ApiResponse<any>> {
    await this.simulateNetworkDelay();
    return this.createResponse({
      id: Math.random().toString(36).substring(7),
      ...tradeData,
      status: 'OPEN',
      entryDate: new Date().toISOString(),
    });
  }

  // User Endpoints
  async getProfile(): Promise<ApiResponse<any>> {
    await this.simulateNetworkDelay();
    return this.createResponse({
      id: 'user1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
    });
  }

  async getSettings(): Promise<ApiResponse<any>> {
    await this.simulateNetworkDelay();
    return this.createResponse({
      theme: 'LIGHT',
      notifications: {
        email: true,
        push: true,
        tradeAlerts: true,
      },
    });
  }

  // Simulate market data updates
  simulateMarketUpdate(): void {
    Object.keys(this.basePrices).forEach((symbol) => {
      this.marketData[symbol] = generateMarketData(symbol, this.basePrices[symbol]);
    });
    this.newsData = generateNewsBatch(Object.keys(this.basePrices), this.marketData);
    this.sentimentData = generateSentimentBatch(
      Object.keys(this.basePrices),
      this.marketData,
      this.newsData
    );
  }
}

// Create and export a singleton instance
export const mockApiClient = new MockApiClient();

// Export the class for testing purposes
export default MockApiClient; 