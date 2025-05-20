/// <reference types="node" />

import { mockApiClient } from './apiClient';

type WebSocketMessage = {
  type: string;
  payload: any;
};

type EventHandler = (data: any) => void;

class MockWebSocketClient {
  private handlers: Map<string, EventHandler[]> = new Map();
  private isConnected: boolean = false;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeEventHandlers();
  }

  private initializeEventHandlers(): void {
    this.handlers.set('marketData', []);
    this.handlers.set('tradeUpdate', []);
    this.handlers.set('notification', []);
    this.handlers.set('chat', []);
  }

  connect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.startSimulation();
        resolve();
      }, 500);
    });
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  subscribe(channel: string, handler: EventHandler): void {
    const handlers = this.handlers.get(channel) || [];
    handlers.push(handler);
    this.handlers.set(channel, handlers);
  }

  unsubscribe(channel: string, handler: EventHandler): void {
    const handlers = this.handlers.get(channel) || [];
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
      this.handlers.set(channel, handlers);
    }
  }

  private startSimulation(): void {
    // Simulate market data updates every 2 seconds
    this.updateInterval = setInterval(() => {
      if (!this.isConnected) return;

      // Update market data
      mockApiClient.simulateMarketUpdate();

      // Emit market data updates
      this.emitMarketData();

      // Randomly emit other events
      if (Math.random() < 0.3) {
        this.emitTradeUpdate();
      }
      if (Math.random() < 0.2) {
        this.emitNotification();
      }
      if (Math.random() < 0.1) {
        this.emitChatMessage();
      }
    }, 2000);
  }

  private emitMarketData(): void {
    const handlers = this.handlers.get('marketData') || [];
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    
    symbols.forEach(symbol => {
      mockApiClient.getQuote(symbol).then(response => {
        const message: WebSocketMessage = {
          type: 'marketData',
          payload: {
            symbol,
            data: response.data
          }
        };
        handlers.forEach(handler => handler(message));
      });
    });
  }

  private emitTradeUpdate(): void {
    const handlers = this.handlers.get('tradeUpdate') || [];
    const message: WebSocketMessage = {
      type: 'tradeUpdate',
      payload: {
        id: Math.random().toString(36).substring(7),
        symbol: 'AAPL',
        type: Math.random() < 0.5 ? 'CALL' : 'PUT',
        status: 'FILLED',
        price: (Math.random() * 10).toFixed(2),
        quantity: Math.floor(Math.random() * 10) + 1,
        timestamp: new Date().toISOString()
      }
    };
    handlers.forEach(handler => handler(message));
  }

  private emitNotification(): void {
    const handlers = this.handlers.get('notification') || [];
    const types = ['INFO', 'WARNING', 'ERROR', 'SUCCESS'];
    const message: WebSocketMessage = {
      type: 'notification',
      payload: {
        id: Math.random().toString(36).substring(7),
        type: types[Math.floor(Math.random() * types.length)],
        title: 'Test Notification',
        message: 'This is a test notification',
        timestamp: new Date().toISOString()
      }
    };
    handlers.forEach(handler => handler(message));
  }

  private emitChatMessage(): void {
    const handlers = this.handlers.get('chat') || [];
    const message: WebSocketMessage = {
      type: 'chat',
      payload: {
        id: Math.random().toString(36).substring(7),
        userId: 'user1',
        username: 'TestUser',
        message: 'This is a test chat message',
        timestamp: new Date().toISOString()
      }
    };
    handlers.forEach(handler => handler(message));
  }

  // Simulate sending a message
  send(message: WebSocketMessage): void {
    if (!this.isConnected) {
      throw new Error('WebSocket is not connected');
    }
    // In a real implementation, this would send the message to the server
    console.log('Sending message:', message);
  }
}

// Create and export a singleton instance
export const mockWebSocketClient = new MockWebSocketClient();

// Export the class for testing purposes
export default MockWebSocketClient; 