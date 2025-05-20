// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  TRADER = 'TRADER',
}

// Trading Types
export interface Trade {
  id: string;
  symbol: string;
  type: TradeType;
  status: TradeStatus;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  profitLoss?: number;
  entryDate: string;
  exitDate?: string;
  notes?: string;
  tags: string[];
  userId: string;
}

export enum TradeType {
  CALL = 'CALL',
  PUT = 'PUT',
  STOCK = 'STOCK',
  FUTURE = 'FUTURE',
}

export enum TradeStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
}

// Market Data Types
export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: string;
}

export interface OptionChain {
  symbol: string;
  expirationDate: string;
  calls: OptionContract[];
  puts: OptionContract[];
}

export interface OptionContract {
  strike: number;
  expirationDate: string;
  type: 'CALL' | 'PUT';
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

// Journal Types
export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  title: string;
  content: string;
  mood: Mood;
  tags: string[];
  trades: string[]; // Trade IDs
  lessons: string[];
  createdAt: string;
  updatedAt: string;
}

export enum Mood {
  VERY_HAPPY = 'VERY_HAPPY',
  HAPPY = 'HAPPY',
  NEUTRAL = 'NEUTRAL',
  SAD = 'SAD',
  VERY_SAD = 'VERY_SAD',
}

// Learning Types
export interface LearningScenario {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: ScenarioCategory;
  marketCondition: MarketCondition;
  steps: ScenarioStep[];
  prerequisites: string[];
  estimatedTime: number; // in minutes
  completedBy: string[]; // User IDs
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum ScenarioCategory {
  STRATEGY = 'STRATEGY',
  RISK_MANAGEMENT = 'RISK_MANAGEMENT',
  PSYCHOLOGY = 'PSYCHOLOGY',
  TECHNICAL_ANALYSIS = 'TECHNICAL_ANALYSIS',
}

export enum MarketCondition {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL',
  VOLATILE = 'VOLATILE',
}

export interface ScenarioStep {
  id: string;
  title: string;
  description: string;
  type: StepType;
  content: string;
  order: number;
  isOptional: boolean;
}

export enum StepType {
  READING = 'READING',
  VIDEO = 'VIDEO',
  QUIZ = 'QUIZ',
  EXERCISE = 'EXERCISE',
  SIMULATION = 'SIMULATION',
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

export enum NotificationType {
  TRADE = 'TRADE',
  SYSTEM = 'SYSTEM',
  ALERT = 'ALERT',
  ACHIEVEMENT = 'ACHIEVEMENT',
}

// Settings Types
export interface UserSettings {
  id: string;
  userId: string;
  theme: Theme;
  notifications: NotificationSettings;
  trading: TradingSettings;
  display: DisplaySettings;
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM',
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  tradeAlerts: boolean;
  systemUpdates: boolean;
  marketing: boolean;
}

export interface TradingSettings {
  defaultQuantity: number;
  maxPositionSize: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  riskPerTrade: number;
  preferredStrategies: string[];
}

export interface DisplaySettings {
  defaultTimeframe: string;
  chartType: string;
  indicators: string[];
  layout: string;
}

// Export all types
export default {
  ApiResponse,
  PaginatedResponse,
  User,
  UserRole,
  Trade,
  TradeType,
  TradeStatus,
  MarketData,
  OptionChain,
  OptionContract,
  JournalEntry,
  Mood,
  LearningScenario,
  Difficulty,
  ScenarioCategory,
  MarketCondition,
  ScenarioStep,
  StepType,
  Notification,
  NotificationType,
  UserSettings,
  Theme,
  NotificationSettings,
  TradingSettings,
  DisplaySettings,
}; 