import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { mockApiClient } from './mocks/apiClient';
import { mockWebSocketClient } from './mocks/websocketClient';

// Mock the API client
jest.mock('../../api/client', () => ({
  apiClient: mockApiClient,
}));

// Mock the WebSocket client
jest.mock('../../api/websocket', () => ({
  websocketClient: mockWebSocketClient,
}));

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, {
    wrapper: ({ children }) => children,
    ...options,
  });
};

// Helper function to wait for a specific time
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to wait for an element to be present
const waitForElement = async (callback: () => HTMLElement | null) => {
  let element = null;
  while (!element) {
    element = callback();
    if (!element) {
      await wait(100);
    }
  }
  return element;
};

// Helper function to simulate market data updates
const simulateMarketUpdate = () => {
  mockApiClient.simulateMarketUpdate();
};

// Helper function to simulate WebSocket events
const simulateWebSocketEvent = (type: string, payload: any) => {
  const handlers = (mockWebSocketClient as any).handlers.get(type) || [];
  handlers.forEach((handler: (data: any) => void) => {
    handler({ type, payload });
  });
};

// Helper function to mock API responses
const mockApiResponse = <T>(data: T) => ({
  data,
  status: 200,
  message: 'Success',
});

// Helper function to mock API errors
const mockApiError = (message: string, status: number = 400) => {
  const error = new Error(message);
  (error as any).response = { status };
  return error;
};

// Helper function to reset all mocks
const resetMocks = () => {
  jest.clearAllMocks();
  mockApiClient.simulateMarketUpdate();
};

export {
  customRender as render,
  wait,
  waitForElement,
  simulateMarketUpdate,
  simulateWebSocketEvent,
  mockApiResponse,
  mockApiError,
  resetMocks,
}; 