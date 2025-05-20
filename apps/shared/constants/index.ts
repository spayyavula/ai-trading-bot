// API Constants
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY = 1000; // 1 second

// Authentication Constants
export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token';
export const AUTH_TOKEN_EXPIRY = 3600; // 1 hour
export const AUTH_REFRESH_TOKEN_EXPIRY = 604800; // 7 days

// Trading Constants
export const TRADING_HOURS = {
  MARKET_OPEN: '09:30',
  MARKET_CLOSE: '16:00',
  PRE_MARKET_OPEN: '04:00',
  AFTER_HOURS_CLOSE: '20:00',
};

export const TRADING_LIMITS = {
  MAX_POSITION_SIZE: 100000,
  MAX_DAILY_LOSS: 5000,
  MAX_DRAWDOWN: 10000,
  MIN_ACCOUNT_BALANCE: 25000,
};

export const OPTION_CONTRACT_MULTIPLIER = 100;
export const STOCK_CONTRACT_MULTIPLIER = 1;

// Risk Management Constants
export const RISK_LEVELS = {
  CONSERVATIVE: {
    MAX_POSITION_SIZE: 0.02, // 2% of portfolio
    MAX_DAILY_LOSS: 0.01, // 1% of portfolio
    STOP_LOSS: 0.05, // 5% per trade
    TAKE_PROFIT: 0.1, // 10% per trade
  },
  MODERATE: {
    MAX_POSITION_SIZE: 0.05, // 5% of portfolio
    MAX_DAILY_LOSS: 0.02, // 2% of portfolio
    STOP_LOSS: 0.1, // 10% per trade
    TAKE_PROFIT: 0.2, // 20% per trade
  },
  AGGRESSIVE: {
    MAX_POSITION_SIZE: 0.1, // 10% of portfolio
    MAX_DAILY_LOSS: 0.05, // 5% of portfolio
    STOP_LOSS: 0.15, // 15% per trade
    TAKE_PROFIT: 0.3, // 30% per trade
  },
};

// UI Constants
export const BREAKPOINTS = {
  MOBILE: 600,
  TABLET: 960,
  DESKTOP: 1280,
  LARGE_DESKTOP: 1920,
};

export const Z_INDEX = {
  MODAL: 1000,
  DROPDOWN: 900,
  TOOLTIP: 800,
  HEADER: 700,
  SIDEBAR: 600,
};

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Chart Constants
export const CHART_TIMEFRAMES = [
  '1m',
  '5m',
  '15m',
  '30m',
  '1h',
  '4h',
  '1d',
  '1w',
  '1M',
] as const;

export const CHART_TYPES = [
  'candlestick',
  'line',
  'area',
  'bar',
  'heikin-ashi',
] as const;

export const CHART_INDICATORS = [
  'MA',
  'EMA',
  'RSI',
  'MACD',
  'Bollinger Bands',
  'Volume',
  'ATR',
  'Stochastic',
] as const;

// Notification Constants
export const NOTIFICATION_TYPES = {
  TRADE: {
    ICON: 'trade',
    COLOR: '#2196F3',
  },
  SYSTEM: {
    ICON: 'system',
    COLOR: '#757575',
  },
  ALERT: {
    ICON: 'alert',
    COLOR: '#F44336',
  },
  ACHIEVEMENT: {
    ICON: 'achievement',
    COLOR: '#4CAF50',
  },
};

// Learning Constants
export const DIFFICULTY_LEVELS = {
  BEGINNER: {
    COLOR: '#4CAF50',
    ICON: 'beginner',
  },
  INTERMEDIATE: {
    COLOR: '#FFC107',
    ICON: 'intermediate',
  },
  ADVANCED: {
    COLOR: '#F44336',
    ICON: 'advanced',
  },
};

export const SCENARIO_CATEGORIES = {
  STRATEGY: {
    COLOR: '#2196F3',
    ICON: 'strategy',
  },
  RISK_MANAGEMENT: {
    COLOR: '#F44336',
    ICON: 'risk',
  },
  PSYCHOLOGY: {
    COLOR: '#9C27B0',
    ICON: 'psychology',
  },
  TECHNICAL_ANALYSIS: {
    COLOR: '#FF9800',
    ICON: 'technical',
  },
};

// Export all constants
export default {
  API_BASE_URL,
  API_TIMEOUT,
  API_RETRY_ATTEMPTS,
  API_RETRY_DELAY,
  AUTH_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_EXPIRY,
  TRADING_HOURS,
  TRADING_LIMITS,
  OPTION_CONTRACT_MULTIPLIER,
  STOCK_CONTRACT_MULTIPLIER,
  RISK_LEVELS,
  BREAKPOINTS,
  Z_INDEX,
  ANIMATION_DURATION,
  CHART_TIMEFRAMES,
  CHART_TYPES,
  CHART_INDICATORS,
  NOTIFICATION_TYPES,
  DIFFICULTY_LEVELS,
  SCENARIO_CATEGORIES,
}; 