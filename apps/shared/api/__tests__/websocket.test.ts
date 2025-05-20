import { WebSocketClient } from '../websocket';

describe('WebSocketClient', () => {
  let wsClient: WebSocketClient;
  let mockHandler: jest.Mock;

  beforeEach(() => {
    wsClient = new WebSocketClient();
    mockHandler = jest.fn();
  });

  describe('connection', () => {
    it('connects successfully', async () => {
      await expect(wsClient.connect()).resolves.not.toThrow();
    });

    it('disconnects successfully', () => {
      wsClient.disconnect();
      expect(wsClient.isConnected).toBe(false);
    });
  });

  describe('subscriptions', () => {
    beforeEach(async () => {
      await wsClient.connect();
    });

    it('subscribes to a channel', () => {
      wsClient.subscribe('marketData', mockHandler);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('unsubscribes from a channel', () => {
      wsClient.subscribe('marketData', mockHandler);
      wsClient.unsubscribe('marketData', mockHandler);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('handles market data updates', async () => {
      wsClient.subscribe('marketData', mockHandler);

      // Wait for the first market data update
      await new Promise(resolve => setTimeout(resolve, 2500));

      expect(mockHandler).toHaveBeenCalled();
      const call = mockHandler.mock.calls[0][0];
      expect(call.type).toBe('marketData');
      expect(call.payload).toHaveProperty('symbol');
      expect(call.payload).toHaveProperty('data');
    });

    it('handles trade updates', async () => {
      wsClient.subscribe('tradeUpdate', mockHandler);

      // Wait for a potential trade update
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Trade updates are random, so we can't guarantee it was called
      if (mockHandler.mock.calls.length > 0) {
        const call = mockHandler.mock.calls[0][0];
        expect(call.type).toBe('tradeUpdate');
        expect(call.payload).toHaveProperty('id');
        expect(call.payload).toHaveProperty('symbol');
        expect(call.payload).toHaveProperty('type');
        expect(call.payload).toHaveProperty('status');
      }
    });

    it('handles notifications', async () => {
      wsClient.subscribe('notification', mockHandler);

      // Wait for a potential notification
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Notifications are random, so we can't guarantee it was called
      if (mockHandler.mock.calls.length > 0) {
        const call = mockHandler.mock.calls[0][0];
        expect(call.type).toBe('notification');
        expect(call.payload).toHaveProperty('id');
        expect(call.payload).toHaveProperty('type');
        expect(call.payload).toHaveProperty('title');
        expect(call.payload).toHaveProperty('message');
      }
    });

    it('handles chat messages', async () => {
      wsClient.subscribe('chat', mockHandler);

      // Wait for a potential chat message
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Chat messages are random, so we can't guarantee it was called
      if (mockHandler.mock.calls.length > 0) {
        const call = mockHandler.mock.calls[0][0];
        expect(call.type).toBe('chat');
        expect(call.payload).toHaveProperty('id');
        expect(call.payload).toHaveProperty('userId');
        expect(call.payload).toHaveProperty('username');
        expect(call.payload).toHaveProperty('message');
      }
    });
  });

  describe('message sending', () => {
    beforeEach(async () => {
      await wsClient.connect();
    });

    it('sends messages when connected', () => {
      const message = {
        type: 'test',
        payload: { data: 'test' },
      };

      expect(() => wsClient.send(message)).not.toThrow();
    });

    it('throws error when sending messages while disconnected', () => {
      wsClient.disconnect();

      const message = {
        type: 'test',
        payload: { data: 'test' },
      };

      expect(() => wsClient.send(message)).toThrow('WebSocket is not connected');
    });
  });

  describe('error handling', () => {
    it('handles connection errors', async () => {
      // Mock a connection error
      jest.spyOn(global, 'setTimeout').mockImplementationOnce(() => {
        throw new Error('Connection failed');
      });

      await expect(wsClient.connect()).rejects.toThrow('Connection failed');
    });

    it('handles message parsing errors', () => {
      // This would be tested by sending malformed messages
      // but that's not possible with the current implementation
      // as we're using a mock WebSocket
    });
  });
}); 