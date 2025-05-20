// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Feature Flags
export const FEATURES = {
  ENABLE_LEARNING_SCENARIOS: true,
  ENABLE_TRADING_JOURNAL: true,
  ENABLE_MARKET_ANALYSIS: true,
  ENABLE_RISK_MANAGEMENT: true,
};

// Learning Scenarios Configuration
export const LEARNING_SCENARIOS = {
  DIFFICULTY_LEVELS: ['beginner', 'intermediate', 'advanced'],
  MARKET_REGIMES: ['bullish', 'bearish', 'neutral', 'volatile'],
  CATEGORIES: [
    'income',
    'directional',
    'volatility',
    'hedging',
    'speculation',
  ],
};

// Trading Journal Configuration
export const JOURNAL_TAGS = [
  'win',
  'loss',
  'break-even',
  'strategy',
  'market-regime',
  'risk-management',
  'emotions',
  'lessons-learned',
];

// Market Analysis Configuration
export const MARKET_INDICATORS = {
  TECHNICAL: [
    'RSI',
    'MACD',
    'Bollinger Bands',
    'Moving Averages',
    'Volume',
  ],
  SENTIMENT: [
    'Put/Call Ratio',
    'VIX',
    'Market Breadth',
    'Options Flow',
  ],
};

// Risk Management Configuration
export const RISK_MANAGEMENT = {
  MAX_POSITION_SIZE: 0.05, // 5% of portfolio
  MAX_DAILY_LOSS: 0.02, // 2% of portfolio
  MAX_DRAWDOWN: 0.15, // 15% of portfolio
  POSITION_SIZING_METHODS: [
    'fixed-size',
    'kelly-criterion',
    'risk-per-trade',
    'portfolio-percentage',
  ],
}; 