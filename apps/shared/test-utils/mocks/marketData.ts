import { MarketData, OptionChain, OptionContract } from '../../types';

// Helper function to generate random price movement
const generatePriceMovement = (basePrice: number, volatility: number): number => {
  const change = (Math.random() - 0.5) * volatility;
  return basePrice * (1 + change);
};

// Generate mock market data for a symbol
export const generateMarketData = (symbol: string, basePrice: number): MarketData => {
  const price = generatePriceMovement(basePrice, 0.02); // 2% volatility
  const change = price - basePrice;
  const changePercent = (change / basePrice) * 100;
  const volume = Math.floor(Math.random() * 1000000) + 100000;
  const high = price * (1 + Math.random() * 0.01);
  const low = price * (1 - Math.random() * 0.01);
  const open = basePrice * (1 + (Math.random() - 0.5) * 0.01);

  return {
    symbol,
    price,
    change,
    changePercent,
    volume,
    high,
    low,
    open,
    previousClose: basePrice,
    timestamp: new Date().toISOString(),
  };
};

// Generate mock option chain
export const generateOptionChain = (
  symbol: string,
  basePrice: number,
  expirationDate: string
): OptionChain => {
  const strikes = Array.from({ length: 10 }, (_, i) => {
    const strike = basePrice * (0.9 + (i * 0.02)); // Strikes from 90% to 110% of base price
    return Math.round(strike * 100) / 100;
  });

  const generateOptionContract = (
    strike: number,
    type: 'CALL' | 'PUT'
  ): OptionContract => {
    const lastPrice = Math.random() * 10;
    const bid = lastPrice * 0.95;
    const ask = lastPrice * 1.05;
    const volume = Math.floor(Math.random() * 1000);
    const openInterest = Math.floor(Math.random() * 5000);
    const impliedVolatility = 0.2 + Math.random() * 0.3;
    const delta = type === 'CALL' ? Math.random() : -Math.random();
    const gamma = Math.random() * 0.1;
    const theta = -(Math.random() * 0.1);
    const vega = Math.random() * 0.5;

    return {
      strike,
      expirationDate,
      type,
      lastPrice,
      bid,
      ask,
      volume,
      openInterest,
      impliedVolatility,
      delta,
      gamma,
      theta,
      vega,
    };
  };

  return {
    symbol,
    expirationDate,
    calls: strikes.map((strike) => generateOptionContract(strike, 'CALL')),
    puts: strikes.map((strike) => generateOptionContract(strike, 'PUT')),
  };
};

// Generate mock market data for multiple symbols
export const generateMarketDataBatch = (
  symbols: string[],
  basePrices: Record<string, number>
): MarketData[] => {
  return symbols.map((symbol) => generateMarketData(symbol, basePrices[symbol]));
};

// Generate mock option chains for multiple symbols
export const generateOptionChainsBatch = (
  symbols: string[],
  basePrices: Record<string, number>,
  expirationDate: string
): Record<string, OptionChain> => {
  return symbols.reduce((acc, symbol) => {
    acc[symbol] = generateOptionChain(symbol, basePrices[symbol], expirationDate);
    return acc;
  }, {} as Record<string, OptionChain>);
}; 