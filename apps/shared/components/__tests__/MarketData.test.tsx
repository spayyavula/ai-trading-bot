import { render, screen, waitFor } from '@testing-library/react';
import { MarketData } from '../MarketData';
import { mockApiClient } from '../../test-utils/mocks/apiClient';
import { mockWebSocketClient } from '../../test-utils/mocks/websocketClient';
import { simulateMarketUpdate, simulateWebSocketEvent } from '../../test-utils/testUtils';

describe('MarketData', () => {
  beforeEach(() => {
    mockApiClient.simulateMarketUpdate();
  });

  it('renders market data for a symbol', async () => {
    render(<MarketData symbol="AAPL" />);

    // Wait for the initial data to load
    await waitFor(() => {
      expect(screen.getByTestId('market-data-price')).toBeInTheDocument();
    });

    // Check if the price is displayed
    const priceElement = screen.getByTestId('market-data-price');
    expect(priceElement).toHaveTextContent(/\$[\d,.]+/);

    // Check if the change is displayed
    const changeElement = screen.getByTestId('market-data-change');
    expect(changeElement).toHaveTextContent(/[+-]?[\d,.]+%/);
  });

  it('updates when market data changes', async () => {
    render(<MarketData symbol="AAPL" />);

    // Wait for the initial data to load
    await waitFor(() => {
      expect(screen.getByTestId('market-data-price')).toBeInTheDocument();
    });

    // Get the initial price
    const initialPrice = screen.getByTestId('market-data-price').textContent;

    // Simulate a market update
    simulateMarketUpdate();

    // Wait for the price to update
    await waitFor(() => {
      const newPrice = screen.getByTestId('market-data-price').textContent;
      expect(newPrice).not.toBe(initialPrice);
    });
  });

  it('handles WebSocket updates', async () => {
    render(<MarketData symbol="AAPL" />);

    // Wait for the initial data to load
    await waitFor(() => {
      expect(screen.getByTestId('market-data-price')).toBeInTheDocument();
    });

    // Get the initial price
    const initialPrice = screen.getByTestId('market-data-price').textContent;

    // Simulate a WebSocket update
    simulateWebSocketEvent('marketData', {
      symbol: 'AAPL',
      data: {
        price: 160.0,
        change: 2.5,
        volume: 1000000,
      },
    });

    // Wait for the price to update
    await waitFor(() => {
      const newPrice = screen.getByTestId('market-data-price').textContent;
      expect(newPrice).not.toBe(initialPrice);
    });
  });

  it('displays loading state', () => {
    render(<MarketData symbol="AAPL" />);
    expect(screen.getByTestId('market-data-loading')).toBeInTheDocument();
  });

  it('displays error state when API fails', async () => {
    // Mock API error
    jest.spyOn(mockApiClient, 'getQuote').mockRejectedValueOnce(new Error('API Error'));

    render(<MarketData symbol="AAPL" />);

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByTestId('market-data-error')).toBeInTheDocument();
    });

    // Check error message
    expect(screen.getByTestId('market-data-error')).toHaveTextContent('Failed to load market data');
  });

  it('unsubscribes from WebSocket on unmount', () => {
    const { unmount } = render(<MarketData symbol="AAPL" />);
    
    // Spy on the unsubscribe method
    const unsubscribeSpy = jest.spyOn(mockWebSocketClient, 'unsubscribe');

    // Unmount the component
    unmount();

    // Check if unsubscribe was called
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
}); 