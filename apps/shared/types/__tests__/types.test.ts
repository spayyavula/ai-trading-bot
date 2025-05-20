import {
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
} from '../index';

describe('Type Definitions', () => {
  describe('API Response Types', () => {
    it('defines ApiResponse type', () => {
      const response: ApiResponse<string> = {
        data: 'test',
        status: 200,
        message: 'Success',
      };

      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('message');
    });

    it('defines PaginatedResponse type', () => {
      const response: PaginatedResponse<string> = {
        data: ['test'],
        status: 200,
        message: 'Success',
        pagination: {
          page: 1,
          limit: 10,
          total: 100,
          totalPages: 10,
        },
      };

      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('message');
      expect(response).toHaveProperty('pagination');
    });
  });

  describe('User Types', () => {
    it('defines User type', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
      };

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('firstName');
      expect(user).toHaveProperty('lastName');
      expect(user).toHaveProperty('role');
    });

    it('defines UserRole enum', () => {
      expect(UserRole.USER).toBe('USER');
      expect(UserRole.ADMIN).toBe('ADMIN');
    });
  });

  describe('Trading Types', () => {
    it('defines Trade type', () => {
      const trade: Trade = {
        id: '1',
        symbol: 'AAPL',
        type: TradeType.CALL,
        status: TradeStatus.OPEN,
        entryPrice: 2.5,
        quantity: 1,
        entryDate: new Date().toISOString(),
      };

      expect(trade).toHaveProperty('id');
      expect(trade).toHaveProperty('symbol');
      expect(trade).toHaveProperty('type');
      expect(trade).toHaveProperty('status');
      expect(trade).toHaveProperty('entryPrice');
      expect(trade).toHaveProperty('quantity');
      expect(trade).toHaveProperty('entryDate');
    });

    it('defines TradeType enum', () => {
      expect(TradeType.CALL).toBe('CALL');
      expect(TradeType.PUT).toBe('PUT');
    });

    it('defines TradeStatus enum', () => {
      expect(TradeStatus.OPEN).toBe('OPEN');
      expect(TradeStatus.CLOSED).toBe('CLOSED');
      expect(TradeStatus.EXPIRED).toBe('EXPIRED');
    });
  });

  describe('Market Data Types', () => {
    it('defines MarketData type', () => {
      const marketData: MarketData = {
        symbol: 'AAPL',
        price: 150.0,
        change: 2.5,
        volume: 1000000,
        high: 155.0,
        low: 145.0,
        open: 148.0,
        timestamp: new Date().toISOString(),
      };

      expect(marketData).toHaveProperty('symbol');
      expect(marketData).toHaveProperty('price');
      expect(marketData).toHaveProperty('change');
      expect(marketData).toHaveProperty('volume');
      expect(marketData).toHaveProperty('high');
      expect(marketData).toHaveProperty('low');
      expect(marketData).toHaveProperty('open');
      expect(marketData).toHaveProperty('timestamp');
    });

    it('defines OptionChain type', () => {
      const optionChain: OptionChain = {
        symbol: 'AAPL',
        expirationDate: '2024-01-19',
        calls: [],
        puts: [],
      };

      expect(optionChain).toHaveProperty('symbol');
      expect(optionChain).toHaveProperty('expirationDate');
      expect(optionChain).toHaveProperty('calls');
      expect(optionChain).toHaveProperty('puts');
    });

    it('defines OptionContract type', () => {
      const optionContract: OptionContract = {
        symbol: 'AAPL',
        strikePrice: 150.0,
        expirationDate: '2024-01-19',
        type: TradeType.CALL,
        lastPrice: 2.5,
        bid: 2.4,
        ask: 2.6,
        volume: 1000,
        openInterest: 5000,
        impliedVolatility: 0.3,
      };

      expect(optionContract).toHaveProperty('symbol');
      expect(optionContract).toHaveProperty('strikePrice');
      expect(optionContract).toHaveProperty('expirationDate');
      expect(optionContract).toHaveProperty('type');
      expect(optionContract).toHaveProperty('lastPrice');
      expect(optionContract).toHaveProperty('bid');
      expect(optionContract).toHaveProperty('ask');
      expect(optionContract).toHaveProperty('volume');
      expect(optionContract).toHaveProperty('openInterest');
      expect(optionContract).toHaveProperty('impliedVolatility');
    });
  });

  describe('Journal Types', () => {
    it('defines JournalEntry type', () => {
      const entry: JournalEntry = {
        id: '1',
        userId: 'user1',
        content: 'Test entry',
        mood: Mood.NEUTRAL,
        tags: ['test'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('userId');
      expect(entry).toHaveProperty('content');
      expect(entry).toHaveProperty('mood');
      expect(entry).toHaveProperty('tags');
      expect(entry).toHaveProperty('createdAt');
      expect(entry).toHaveProperty('updatedAt');
    });

    it('defines Mood enum', () => {
      expect(Mood.HAPPY).toBe('HAPPY');
      expect(Mood.NEUTRAL).toBe('NEUTRAL');
      expect(Mood.SAD).toBe('SAD');
    });
  });

  describe('Learning Types', () => {
    it('defines LearningScenario type', () => {
      const scenario: LearningScenario = {
        id: '1',
        title: 'Test Scenario',
        description: 'Test description',
        difficulty: Difficulty.BEGINNER,
        category: ScenarioCategory.OPTIONS,
        marketCondition: MarketCondition.BULLISH,
        steps: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(scenario).toHaveProperty('id');
      expect(scenario).toHaveProperty('title');
      expect(scenario).toHaveProperty('description');
      expect(scenario).toHaveProperty('difficulty');
      expect(scenario).toHaveProperty('category');
      expect(scenario).toHaveProperty('marketCondition');
      expect(scenario).toHaveProperty('steps');
      expect(scenario).toHaveProperty('createdAt');
      expect(scenario).toHaveProperty('updatedAt');
    });

    it('defines Difficulty enum', () => {
      expect(Difficulty.BEGINNER).toBe('BEGINNER');
      expect(Difficulty.INTERMEDIATE).toBe('INTERMEDIATE');
      expect(Difficulty.ADVANCED).toBe('ADVANCED');
    });

    it('defines ScenarioCategory enum', () => {
      expect(ScenarioCategory.OPTIONS).toBe('OPTIONS');
      expect(ScenarioCategory.STOCKS).toBe('STOCKS');
      expect(ScenarioCategory.FUTURES).toBe('FUTURES');
    });

    it('defines MarketCondition enum', () => {
      expect(MarketCondition.BULLISH).toBe('BULLISH');
      expect(MarketCondition.BEARISH).toBe('BEARISH');
      expect(MarketCondition.NEUTRAL).toBe('NEUTRAL');
    });

    it('defines ScenarioStep type', () => {
      const step: ScenarioStep = {
        id: '1',
        type: StepType.INSTRUCTION,
        content: 'Test step',
        order: 1,
      };

      expect(step).toHaveProperty('id');
      expect(step).toHaveProperty('type');
      expect(step).toHaveProperty('content');
      expect(step).toHaveProperty('order');
    });

    it('defines StepType enum', () => {
      expect(StepType.INSTRUCTION).toBe('INSTRUCTION');
      expect(StepType.QUESTION).toBe('QUESTION');
      expect(StepType.FEEDBACK).toBe('FEEDBACK');
    });
  });

  describe('Notification Types', () => {
    it('defines Notification type', () => {
      const notification: Notification = {
        id: '1',
        userId: 'user1',
        type: NotificationType.INFO,
        title: 'Test Notification',
        message: 'Test message',
        read: false,
        createdAt: new Date().toISOString(),
      };

      expect(notification).toHaveProperty('id');
      expect(notification).toHaveProperty('userId');
      expect(notification).toHaveProperty('type');
      expect(notification).toHaveProperty('title');
      expect(notification).toHaveProperty('message');
      expect(notification).toHaveProperty('read');
      expect(notification).toHaveProperty('createdAt');
    });

    it('defines NotificationType enum', () => {
      expect(NotificationType.INFO).toBe('INFO');
      expect(NotificationType.WARNING).toBe('WARNING');
      expect(NotificationType.ERROR).toBe('ERROR');
      expect(NotificationType.SUCCESS).toBe('SUCCESS');
    });
  });

  describe('Settings Types', () => {
    it('defines UserSettings type', () => {
      const settings: UserSettings = {
        theme: Theme.LIGHT,
        notifications: {
          email: true,
          push: true,
          tradeAlerts: true,
        },
        trading: {
          defaultQuantity: 1,
          confirmTrades: true,
          showPnL: true,
        },
        display: {
          showCharts: true,
          showNews: true,
          showWatchlist: true,
        },
      };

      expect(settings).toHaveProperty('theme');
      expect(settings).toHaveProperty('notifications');
      expect(settings).toHaveProperty('trading');
      expect(settings).toHaveProperty('display');
    });

    it('defines Theme enum', () => {
      expect(Theme.LIGHT).toBe('LIGHT');
      expect(Theme.DARK).toBe('DARK');
    });

    it('defines NotificationSettings type', () => {
      const settings: NotificationSettings = {
        email: true,
        push: true,
        tradeAlerts: true,
      };

      expect(settings).toHaveProperty('email');
      expect(settings).toHaveProperty('push');
      expect(settings).toHaveProperty('tradeAlerts');
    });

    it('defines TradingSettings type', () => {
      const settings: TradingSettings = {
        defaultQuantity: 1,
        confirmTrades: true,
        showPnL: true,
      };

      expect(settings).toHaveProperty('defaultQuantity');
      expect(settings).toHaveProperty('confirmTrades');
      expect(settings).toHaveProperty('showPnL');
    });

    it('defines DisplaySettings type', () => {
      const settings: DisplaySettings = {
        showCharts: true,
        showNews: true,
        showWatchlist: true,
      };

      expect(settings).toHaveProperty('showCharts');
      expect(settings).toHaveProperty('showNews');
      expect(settings).toHaveProperty('showWatchlist');
    });
  });
}); 