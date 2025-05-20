import { WEBSOCKET_ENDPOINTS } from './endpoints';
import { AUTH_TOKEN_KEY } from '../constants';
import { AppError, handleError } from '../utils';

type WebSocketMessage = {
  type: string;
  payload: any;
};

type WebSocketEventHandler = (data: any) => void;

class WebSocketClient {
  private connections: Map<string, WebSocket> = new Map();
  private eventHandlers: Map<string, Set<WebSocketEventHandler>> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 second

  constructor() {
    this.setupGlobalErrorHandling();
  }

  private setupGlobalErrorHandling(): void {
    window.addEventListener('online', () => {
      this.reconnectAll();
    });

    window.addEventListener('offline', () => {
      this.closeAll();
    });
  }

  private createWebSocket(endpoint: string): WebSocket {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const wsUrl = `${WEBSOCKET_ENDPOINTS[endpoint]}?token=${token}`;
    return new WebSocket(wsUrl);
  }

  private setupWebSocket(endpoint: string, ws: WebSocket): void {
    ws.onopen = () => {
      console.log(`WebSocket connected: ${endpoint}`);
      this.reconnectAttempts.set(endpoint, 0);
    };

    ws.onclose = () => {
      console.log(`WebSocket disconnected: ${endpoint}`);
      this.handleReconnect(endpoint);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error: ${endpoint}`, error);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(endpoint, message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  private handleReconnect(endpoint: string): void {
    const attempts = this.reconnectAttempts.get(endpoint) || 0;
    if (attempts < this.maxReconnectAttempts) {
      this.reconnectAttempts.set(endpoint, attempts + 1);
      setTimeout(() => {
        this.connect(endpoint);
      }, this.reconnectDelay * Math.pow(2, attempts));
    } else {
      console.error(`Max reconnection attempts reached for ${endpoint}`);
      this.eventHandlers.get(endpoint)?.forEach((handler) => {
        handler(new AppError('WebSocket connection failed', 'WS_CONNECTION_ERROR'));
      });
    }
  }

  private handleMessage(endpoint: string, message: WebSocketMessage): void {
    const handlers = this.eventHandlers.get(endpoint);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(message.payload);
        } catch (error) {
          console.error('Error in WebSocket message handler:', error);
        }
      });
    }
  }

  connect(endpoint: string): void {
    if (this.connections.has(endpoint)) {
      return;
    }

    const ws = this.createWebSocket(endpoint);
    this.setupWebSocket(endpoint, ws);
    this.connections.set(endpoint, ws);
  }

  disconnect(endpoint: string): void {
    const ws = this.connections.get(endpoint);
    if (ws) {
      ws.close();
      this.connections.delete(endpoint);
      this.eventHandlers.delete(endpoint);
      this.reconnectAttempts.delete(endpoint);
    }
  }

  subscribe(endpoint: string, handler: WebSocketEventHandler): void {
    if (!this.connections.has(endpoint)) {
      this.connect(endpoint);
    }

    if (!this.eventHandlers.has(endpoint)) {
      this.eventHandlers.set(endpoint, new Set());
    }

    this.eventHandlers.get(endpoint)?.add(handler);
  }

  unsubscribe(endpoint: string, handler: WebSocketEventHandler): void {
    this.eventHandlers.get(endpoint)?.delete(handler);

    if (this.eventHandlers.get(endpoint)?.size === 0) {
      this.disconnect(endpoint);
    }
  }

  send(endpoint: string, message: WebSocketMessage): void {
    const ws = this.connections.get(endpoint);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      throw new AppError('WebSocket is not connected', 'WS_NOT_CONNECTED');
    }
  }

  private reconnectAll(): void {
    this.connections.forEach((_, endpoint) => {
      this.disconnect(endpoint);
      this.connect(endpoint);
    });
  }

  private closeAll(): void {
    this.connections.forEach((ws, endpoint) => {
      ws.close();
      this.connections.delete(endpoint);
    });
  }

  // Market Data WebSocket
  subscribeToMarketData(symbol: string, handler: WebSocketEventHandler): void {
    this.subscribe('MARKET_DATA', (data) => {
      if (data.symbol === symbol) {
        handler(data);
      }
    });
  }

  // Trade Updates WebSocket
  subscribeToTradeUpdates(handler: WebSocketEventHandler): void {
    this.subscribe('TRADE_UPDATES', handler);
  }

  // Notifications WebSocket
  subscribeToNotifications(handler: WebSocketEventHandler): void {
    this.subscribe('NOTIFICATIONS', handler);
  }

  // Chat WebSocket
  subscribeToChat(roomId: string, handler: WebSocketEventHandler): void {
    this.subscribe('CHAT', (data) => {
      if (data.roomId === roomId) {
        handler(data);
      }
    });
  }

  sendChatMessage(roomId: string, message: string): void {
    this.send('CHAT', {
      type: 'CHAT_MESSAGE',
      payload: {
        roomId,
        message,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

// Create and export a singleton instance
export const websocketClient = new WebSocketClient();

// Export the class for testing purposes
export default WebSocketClient; 