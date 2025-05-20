// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
} as const;

// User Endpoints
export const USER_ENDPOINTS = {
  PROFILE: '/users/profile',
  SETTINGS: '/users/settings',
  PREFERENCES: '/users/preferences',
  NOTIFICATIONS: '/users/notifications',
  ACHIEVEMENTS: '/users/achievements',
  STATISTICS: '/users/statistics',
} as const;

// Trading Endpoints
export const TRADING_ENDPOINTS = {
  TRADES: '/trades',
  POSITIONS: '/positions',
  WATCHLIST: '/watchlist',
  ORDERS: '/orders',
  ACCOUNTS: '/accounts',
  BALANCE: '/accounts/balance',
  HISTORY: '/trades/history',
  ANALYTICS: '/trades/analytics',
} as const;

// Market Data Endpoints
export const MARKET_ENDPOINTS = {
  QUOTES: '/market/quotes',
  OPTIONS: '/market/options',
  CHAINS: '/market/chains',
  HISTORICAL: '/market/historical',
  NEWS: '/market/news',
  SENTIMENT: '/market/sentiment',
  SCANNER: '/market/scanner',
  ALERTS: '/market/alerts',
} as const;

// Journal Endpoints
export const JOURNAL_ENDPOINTS = {
  ENTRIES: '/journal/entries',
  TAGS: '/journal/tags',
  STATISTICS: '/journal/statistics',
  EXPORT: '/journal/export',
  IMPORT: '/journal/import',
} as const;

// Learning Endpoints
export const LEARNING_ENDPOINTS = {
  SCENARIOS: '/learning/scenarios',
  PROGRESS: '/learning/progress',
  QUIZZES: '/learning/quizzes',
  RESOURCES: '/learning/resources',
  CERTIFICATES: '/learning/certificates',
} as const;

// Risk Management Endpoints
export const RISK_ENDPOINTS = {
  PROFILE: '/risk/profile',
  LIMITS: '/risk/limits',
  ALERTS: '/risk/alerts',
  REPORTS: '/risk/reports',
  SIMULATIONS: '/risk/simulations',
} as const;

// Analytics Endpoints
export const ANALYTICS_ENDPOINTS = {
  PERFORMANCE: '/analytics/performance',
  RISK: '/analytics/risk',
  BEHAVIOR: '/analytics/behavior',
  REPORTS: '/analytics/reports',
  EXPORT: '/analytics/export',
} as const;

// File Upload Endpoints
export const UPLOAD_ENDPOINTS = {
  PROFILE_PICTURE: '/upload/profile-picture',
  DOCUMENTS: '/upload/documents',
  TRADE_IMAGES: '/upload/trade-images',
  JOURNAL_ATTACHMENTS: '/upload/journal-attachments',
} as const;

// WebSocket Endpoints
export const WEBSOCKET_ENDPOINTS = {
  MARKET_DATA: '/ws/market-data',
  TRADE_UPDATES: '/ws/trade-updates',
  NOTIFICATIONS: '/ws/notifications',
  CHAT: '/ws/chat',
} as const;

// Export all endpoints
export default {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  TRADING_ENDPOINTS,
  MARKET_ENDPOINTS,
  JOURNAL_ENDPOINTS,
  LEARNING_ENDPOINTS,
  RISK_ENDPOINTS,
  ANALYTICS_ENDPOINTS,
  UPLOAD_ENDPOINTS,
  WEBSOCKET_ENDPOINTS,
}; 