import { apiClient } from './client';
import {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  TRADING_ENDPOINTS,
  MARKET_ENDPOINTS,
  JOURNAL_ENDPOINTS,
  LEARNING_ENDPOINTS,
  RISK_ENDPOINTS,
  ANALYTICS_ENDPOINTS,
  UPLOAD_ENDPOINTS,
} from './endpoints';
import {
  User,
  Trade,
  MarketData,
  OptionChain,
  JournalEntry,
  LearningScenario,
  UserSettings,
  Notification,
} from '../types';

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    return apiClient.post(AUTH_ENDPOINTS.LOGIN, { email, password });
  },

  register: async (userData: Partial<User>) => {
    return apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
  },

  logout: async () => {
    return apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  },

  refreshToken: async (refreshToken: string) => {
    return apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
  },

  forgotPassword: async (email: string) => {
    return apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
  },
};

// User Services
export const userService = {
  getProfile: async () => {
    return apiClient.get<User>(USER_ENDPOINTS.PROFILE);
  },

  updateProfile: async (profileData: Partial<User>) => {
    return apiClient.put<User>(USER_ENDPOINTS.PROFILE, profileData);
  },

  getSettings: async () => {
    return apiClient.get<UserSettings>(USER_ENDPOINTS.SETTINGS);
  },

  updateSettings: async (settings: Partial<UserSettings>) => {
    return apiClient.put<UserSettings>(USER_ENDPOINTS.SETTINGS, settings);
  },

  getNotifications: async () => {
    return apiClient.get<Notification[]>(USER_ENDPOINTS.NOTIFICATIONS);
  },

  markNotificationAsRead: async (notificationId: string) => {
    return apiClient.patch(`${USER_ENDPOINTS.NOTIFICATIONS}/${notificationId}`, {
      read: true,
    });
  },
};

// Trading Services
export const tradingService = {
  getTrades: async (params?: Record<string, any>) => {
    return apiClient.get<Trade[]>(TRADING_ENDPOINTS.TRADES, { params });
  },

  createTrade: async (tradeData: Partial<Trade>) => {
    return apiClient.post<Trade>(TRADING_ENDPOINTS.TRADES, tradeData);
  },

  updateTrade: async (tradeId: string, tradeData: Partial<Trade>) => {
    return apiClient.put<Trade>(`${TRADING_ENDPOINTS.TRADES}/${tradeId}`, tradeData);
  },

  deleteTrade: async (tradeId: string) => {
    return apiClient.delete(`${TRADING_ENDPOINTS.TRADES}/${tradeId}`);
  },

  getPositions: async () => {
    return apiClient.get(TRADING_ENDPOINTS.POSITIONS);
  },

  getWatchlist: async () => {
    return apiClient.get(TRADING_ENDPOINTS.WATCHLIST);
  },

  addToWatchlist: async (symbol: string) => {
    return apiClient.post(TRADING_ENDPOINTS.WATCHLIST, { symbol });
  },

  removeFromWatchlist: async (symbol: string) => {
    return apiClient.delete(`${TRADING_ENDPOINTS.WATCHLIST}/${symbol}`);
  },
};

// Market Data Services
export const marketService = {
  getQuote: async (symbol: string) => {
    return apiClient.get<MarketData>(`${MARKET_ENDPOINTS.QUOTES}/${symbol}`);
  },

  getOptionChain: async (symbol: string, expirationDate: string) => {
    return apiClient.get<OptionChain>(MARKET_ENDPOINTS.CHAINS, {
      params: { symbol, expirationDate },
    });
  },

  getHistoricalData: async (
    symbol: string,
    timeframe: string,
    startDate: string,
    endDate: string
  ) => {
    return apiClient.get(MARKET_ENDPOINTS.HISTORICAL, {
      params: { symbol, timeframe, startDate, endDate },
    });
  },

  getNews: async (symbol?: string) => {
    return apiClient.get(MARKET_ENDPOINTS.NEWS, { params: { symbol } });
  },

  getSentiment: async (symbol: string) => {
    return apiClient.get(`${MARKET_ENDPOINTS.SENTIMENT}/${symbol}`);
  },
};

// Journal Services
export const journalService = {
  getEntries: async (params?: Record<string, any>) => {
    return apiClient.get<JournalEntry[]>(JOURNAL_ENDPOINTS.ENTRIES, { params });
  },

  createEntry: async (entryData: Partial<JournalEntry>) => {
    return apiClient.post<JournalEntry>(JOURNAL_ENDPOINTS.ENTRIES, entryData);
  },

  updateEntry: async (entryId: string, entryData: Partial<JournalEntry>) => {
    return apiClient.put<JournalEntry>(
      `${JOURNAL_ENDPOINTS.ENTRIES}/${entryId}`,
      entryData
    );
  },

  deleteEntry: async (entryId: string) => {
    return apiClient.delete(`${JOURNAL_ENDPOINTS.ENTRIES}/${entryId}`);
  },

  getTags: async () => {
    return apiClient.get(JOURNAL_ENDPOINTS.TAGS);
  },

  exportEntries: async (format: 'csv' | 'pdf') => {
    return apiClient.get(JOURNAL_ENDPOINTS.EXPORT, { params: { format } });
  },
};

// Learning Services
export const learningService = {
  getScenarios: async (params?: Record<string, any>) => {
    return apiClient.get<LearningScenario[]>(LEARNING_ENDPOINTS.SCENARIOS, {
      params,
    });
  },

  getScenario: async (scenarioId: string) => {
    return apiClient.get<LearningScenario>(
      `${LEARNING_ENDPOINTS.SCENARIOS}/${scenarioId}`
    );
  },

  updateProgress: async (scenarioId: string, progress: number) => {
    return apiClient.put(`${LEARNING_ENDPOINTS.PROGRESS}/${scenarioId}`, {
      progress,
    });
  },

  getQuizzes: async (scenarioId: string) => {
    return apiClient.get(`${LEARNING_ENDPOINTS.QUIZZES}/${scenarioId}`);
  },

  submitQuiz: async (scenarioId: string, answers: Record<string, any>) => {
    return apiClient.post(`${LEARNING_ENDPOINTS.QUIZZES}/${scenarioId}`, {
      answers,
    });
  },
};

// Risk Management Services
export const riskService = {
  getRiskProfile: async () => {
    return apiClient.get(RISK_ENDPOINTS.PROFILE);
  },

  updateRiskProfile: async (profileData: Record<string, any>) => {
    return apiClient.put(RISK_ENDPOINTS.PROFILE, profileData);
  },

  getRiskLimits: async () => {
    return apiClient.get(RISK_ENDPOINTS.LIMITS);
  },

  updateRiskLimits: async (limits: Record<string, any>) => {
    return apiClient.put(RISK_ENDPOINTS.LIMITS, limits);
  },

  getRiskAlerts: async () => {
    return apiClient.get(RISK_ENDPOINTS.ALERTS);
  },
};

// Analytics Services
export const analyticsService = {
  getPerformance: async (params?: Record<string, any>) => {
    return apiClient.get(ANALYTICS_ENDPOINTS.PERFORMANCE, { params });
  },

  getRiskMetrics: async (params?: Record<string, any>) => {
    return apiClient.get(ANALYTICS_ENDPOINTS.RISK, { params });
  },

  getBehaviorAnalysis: async (params?: Record<string, any>) => {
    return apiClient.get(ANALYTICS_ENDPOINTS.BEHAVIOR, { params });
  },

  generateReport: async (type: string, params?: Record<string, any>) => {
    return apiClient.get(ANALYTICS_ENDPOINTS.REPORTS, {
      params: { type, ...params },
    });
  },
};

// File Upload Services
export const uploadService = {
  uploadProfilePicture: async (file: File, onProgress?: (progress: number) => void) => {
    return apiClient.uploadFile(UPLOAD_ENDPOINTS.PROFILE_PICTURE, file, onProgress);
  },

  uploadDocument: async (file: File, onProgress?: (progress: number) => void) => {
    return apiClient.uploadFile(UPLOAD_ENDPOINTS.DOCUMENTS, file, onProgress);
  },

  uploadTradeImage: async (file: File, onProgress?: (progress: number) => void) => {
    return apiClient.uploadFile(UPLOAD_ENDPOINTS.TRADE_IMAGES, file, onProgress);
  },

  uploadJournalAttachment: async (
    file: File,
    onProgress?: (progress: number) => void
  ) => {
    return apiClient.uploadFile(
      UPLOAD_ENDPOINTS.JOURNAL_ATTACHMENTS,
      file,
      onProgress
    );
  },
};

// Export all services
export default {
  authService,
  userService,
  tradingService,
  marketService,
  journalService,
  learningService,
  riskService,
  analyticsService,
  uploadService,
}; 