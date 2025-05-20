# Options Trading Platform Mobile App

A React Native mobile application for options trading, featuring real-time market analysis, risk management, strategy execution, trading journal, and interactive learning scenarios.

## Features

### Dashboard
- Portfolio overview with total value, daily change, and P&L
- Quick access to common actions
- Real-time position monitoring
- Performance metrics and statistics
- Market regime indicators

### Risk Profile
- Risk tolerance assessment
- Position sizing recommendations
- Risk management guidelines
- Portfolio allocation suggestions
- Drawdown monitoring

### Trading Strategies
- Pre-built options strategies
- Strategy performance metrics
- Risk/reward analysis
- Strategy filtering and search
- Strategy backtesting capabilities

### Market Analysis
- Real-time market regime detection
- Technical indicators and charts
- Historical regime analysis
- Market sentiment indicators
- Volatility analysis

### Trading Journal
- Trade entry and exit documentation
- Performance tracking
- Emotional state recording
- Lessons learned documentation
- Tag-based organization
- Trade analysis and insights

### Learning Scenarios
- Interactive trading scenarios
- Market regime-specific challenges
- Strategy-focused learning
- Progress tracking
- Achievement system
- Performance analytics

## Prerequisites

- Node.js >= 14
- npm >= 6
- React Native development environment setup
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/option-trading-platform.git
cd option-trading-platform/apps/mobile
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS dependencies (macOS only):
```bash
cd ios
pod install
cd ..
```

4. Configure environment variables:
```bash
# Create .env file
cp .env.example .env

# Update the following variables in .env
REACT_APP_API_BASE_URL=your_api_url
REACT_APP_MARKET_DATA_API_KEY=your_api_key
```

5. Start the development server:
```bash
npm start
```

6. Run the app:
```bash
# For Android
npm run android

# For iOS (macOS only)
npm run ios
```

## Development

### Project Structure
```
src/
  ├── components/     # Reusable UI components
  ├── screens/        # Screen components
  ├── navigation/     # Navigation configuration
  ├── theme/         # Theme and styling
  ├── services/      # API and business logic
  ├── utils/         # Helper functions
  └── types/         # TypeScript type definitions
```

### Key Dependencies
- React Native
- React Navigation
- Styled Components
- TensorFlow.js
- React Native Chart Kit
- React Native Vector Icons
- Axios
- Date-fns

### API Integration

The app uses a RESTful API for data operations. Key endpoints include:

```typescript
// Market Data
GET /api/market/regime
GET /api/market/historical/{symbol}
GET /api/market/indicators/{symbol}

// Trading
GET /api/trading/positions
GET /api/trading/orders
POST /api/trading/orders
DELETE /api/trading/orders/{orderId}

// Journal
GET /api/journal/entries
POST /api/journal/entries
PUT /api/journal/entries/{entryId}
DELETE /api/journal/entries/{entryId}

// Learning
GET /api/learning/scenarios
GET /api/learning/scenarios/{scenarioId}
POST /api/learning/scenarios/{scenarioId}/submit
GET /api/learning/progress
```

### Trading Journal Example

```typescript
// Creating a new journal entry
const newEntry = {
  title: "AAPL Call Option Trade",
  content: "Entered a bullish call spread on AAPL...",
  date: new Date().toISOString(),
  tags: ["win", "strategy", "bullish"],
  tradeId: "trade_123",
  emotionalState: "confident",
  lessonsLearned: "Market sentiment was key to success"
};

await journalApi.createEntry(newEntry);
```

### Learning Scenarios Example

```typescript
// Scenario structure
interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  marketRegime: string;
  tags: string[];
  completed: boolean;
  steps: {
    instruction: string;
    expectedOutcome: string;
    hints: string[];
  }[];
}
```

## Trading Strategies

### Bullish Market Strategies
- Bull Call Spread
  - Best for: Moderate bullish outlook
  - Risk: Limited to net premium paid
  - Reward: Limited to spread width minus premium
  - Example: Buy 100 strike call, sell 105 strike call

- Covered Call
  - Best for: Neutral to slightly bullish
  - Risk: Limited upside potential
  - Reward: Premium income + stock appreciation
  - Example: Own 100 shares, sell 110 strike call

- Protective Put
  - Best for: Long-term bullish with protection
  - Risk: Premium paid for put
  - Reward: Unlimited upside with downside protection
  - Example: Own 100 shares, buy 95 strike put

### Bearish Market Strategies
- Bear Put Spread
  - Best for: Moderate bearish outlook
  - Risk: Limited to net premium paid
  - Reward: Limited to spread width minus premium
  - Example: Buy 100 strike put, sell 95 strike put

- Put Credit Spread
  - Best for: Slightly bearish to neutral
  - Risk: Limited to spread width minus premium
  - Reward: Premium received
  - Example: Sell 100 strike put, buy 95 strike put

### Neutral Market Strategies
- Iron Condor
  - Best for: Range-bound markets
  - Risk: Limited to spread width minus premium
  - Reward: Premium received
  - Example: Sell 95/90 put spread, sell 105/110 call spread

- Butterfly Spread
  - Best for: Expected price stability
  - Risk: Limited to net premium paid
  - Reward: Maximum at center strike
  - Example: Buy 95 put, sell 2x 100 puts, buy 105 put

### Volatile Market Strategies
- Long Straddle
  - Best for: Expected large price move
  - Risk: Premium paid for both options
  - Reward: Unlimited in both directions
  - Example: Buy 100 strike call and put

- Long Strangle
  - Best for: Expected large price move
  - Risk: Premium paid for both options
  - Reward: Unlimited in both directions
  - Example: Buy 105 call and 95 put

## Risk Management

The app implements several risk management features:

```typescript
const RISK_MANAGEMENT = {
  MAX_POSITION_SIZE: 0.05,    // 5% of portfolio
  MAX_DAILY_LOSS: 0.02,       // 2% of portfolio
  MAX_DRAWDOWN: 0.15,         // 15% of portfolio
  POSITION_SIZING_METHODS: [
    'fixed-size',
    'kelly-criterion',
    'risk-per-trade',
    'portfolio-percentage'
  ]
};
```

### Position Sizing Methods

1. Fixed Size
   - Constant position size regardless of account value
   - Simple to implement
   - Example: Always risk $1,000 per trade

2. Kelly Criterion
   - Optimal position sizing based on win rate and risk/reward
   - Formula: f* = (bp - q) / b
   - Where:
     - f* = optimal fraction of bankroll
     - b = odds received on bet
     - p = probability of winning
     - q = probability of losing

3. Risk Per Trade
   - Percentage of account risked per trade
   - Example: Risk 1% of account per trade
   - Adjusts position size based on stop loss

4. Portfolio Percentage
   - Fixed percentage of portfolio per position
   - Example: 5% of portfolio per trade
   - Scales with account growth

## Position Management and Adjustments

### Ladder Technique
The ladder technique involves scaling into and out of positions at different price levels:

```typescript
interface LadderLevel {
  price: number;
  quantity: number;
  type: 'entry' | 'exit';
  trigger: 'price' | 'time' | 'indicator';
}

const ladderExample = {
  symbol: 'AAPL',
  strategy: 'bull-call-spread',
  levels: [
    { price: 150, quantity: 1, type: 'entry', trigger: 'price' },
    { price: 155, quantity: 1, type: 'entry', trigger: 'price' },
    { price: 160, quantity: 1, type: 'entry', trigger: 'price' },
    { price: 170, quantity: 1, type: 'exit', trigger: 'price' },
    { price: 175, quantity: 1, type: 'exit', trigger: 'price' },
    { price: 180, quantity: 1, type: 'exit', trigger: 'price' }
  ]
};
```

Benefits:
- Reduces average entry/exit price
- Manages risk through position sizing
- Provides flexibility in volatile markets
- Allows for partial profit taking

### Detailed Adjustment Strategies

#### 1. Rolling Strategies

##### A. Rolling for a Credit
```typescript
// Example: Rolling a losing put position
const rollPutForCredit = {
  currentPosition: {
    type: 'put',
    strike: 100,
    expiration: '2024-03-15',
    quantity: 1,
    currentPrice: 95,  // Stock price
    currentValue: 4.50 // Option value
  },
  newPosition: {
    type: 'put',
    strike: 95,
    expiration: '2024-04-19',
    quantity: 1,
    credit: 0.75
  },
  netResult: {
    creditReceived: 0.75,
    daysExtended: 35,
    strikeImprovement: 5,
    breakEven: 94.25
  }
};
```

##### B. Rolling Up and Out
```typescript
// Example: Rolling a winning call position
const rollCallUpAndOut = {
  currentPosition: {
    type: 'call',
    strike: 150,
    expiration: '2024-03-15',
    quantity: 1,
    currentPrice: 165,  // Stock price
    currentValue: 16.50 // Option value
  },
  newPosition: {
    type: 'call',
    strike: 160,
    expiration: '2024-04-19',
    quantity: 1,
    credit: 1.25
  },
  netResult: {
    creditReceived: 1.25,
    daysExtended: 35,
    strikeImprovement: 10,
    breakEven: 158.75
  }
};
```

#### 2. Defensive Adjustments

##### A. Adding Protection to a Long Position
```typescript
// Example: Converting a long stock position to a collar
const addProtection = {
  originalPosition: {
    type: 'stock',
    quantity: 100,
    currentPrice: 150
  },
  adjustment: {
    type: 'collar',
    putStrike: 140,
    callStrike: 165,
    putCost: 2.50,
    callCredit: 3.00
  },
  netResult: {
    netCredit: 0.50,
    downsideProtection: 10,
    upsideCap: 15,
    breakEven: 149.50
  }
};
```

##### B. Converting to Iron Condor
```typescript
// Example: Converting a credit spread to an iron condor
const convertToIronCondor = {
  originalPosition: {
    type: 'put-credit-spread',
    putStrikes: [100, 95],
    quantity: 1,
    credit: 1.50
  },
  adjustment: {
    type: 'iron-condor',
    putStrikes: [100, 95],
    callStrikes: [110, 115],
    additionalCredit: 1.25
  },
  netResult: {
    totalCredit: 2.75,
    maxRisk: 2.25,
    profitRange: 95-110,
    breakEven: {
      lower: 97.25,
      upper: 112.75
    }
  }
};
```

#### 3. Offensive Adjustments

##### A. Adding to Winners
```typescript
// Example: Scaling into a winning position
const scaleIntoWinner = {
  originalPosition: {
    type: 'call',
    strike: 150,
    quantity: 1,
    entryPrice: 3.00,
    currentPrice: 5.00
  },
  adjustment: {
    type: 'call',
    strike: 155,
    quantity: 1,
    cost: 3.50
  },
  netResult: {
    averageCost: 3.25,
    totalQuantity: 2,
    breakEven: 153.25
  }
};
```

##### B. Converting to More Aggressive Strategy
```typescript
// Example: Converting iron condor to butterfly
const convertToButterfly = {
  originalPosition: {
    type: 'iron-condor',
    putStrikes: [95, 90],
    callStrikes: [110, 115],
    quantity: 1,
    credit: 2.75
  },
  adjustment: {
    type: 'call-butterfly',
    strikes: [105, 110, 115],
    quantity: 1,
    cost: 1.25
  },
  netResult: {
    netCredit: 1.50,
    maxProfit: 3.50,
    maxLoss: 1.50,
    breakEven: {
      lower: 106.50,
      upper: 113.50
    }
  }
};
```

#### 4. Time-Based Adjustments

##### A. Rolling Out in Time
```typescript
// Example: Extending duration for more premium
const rollOutInTime = {
  currentPosition: {
    type: 'put-credit-spread',
    strikes: [100, 95],
    expiration: '2024-03-15',
    daysToExpiration: 15
  },
  newPosition: {
    type: 'put-credit-spread',
    strikes: [100, 95],
    expiration: '2024-04-19',
    daysToExpiration: 50,
    credit: 1.75
  },
  netResult: {
    additionalCredit: 1.75,
    daysExtended: 35,
    annualizedReturn: 18.25
  }
};
```

##### B. Pre-Earnings Adjustment
```typescript
// Example: Adjusting position before earnings
const preEarningsAdjustment = {
  originalPosition: {
    type: 'iron-condor',
    putStrikes: [95, 90],
    callStrikes: [110, 115],
    quantity: 1
  },
  adjustment: {
    type: 'butterfly',
    strikes: [100, 105, 110],
    quantity: 1,
    cost: 2.00
  },
  netResult: {
    reducedRisk: true,
    definedRisk: true,
    maxLoss: 2.00,
    maxProfit: 3.00
  }
};
```

#### 5. Volatility-Based Adjustments

##### A. IV Percentile Adjustment
```typescript
// Example: Adjusting for high IV
const highIVAdjustment = {
  marketCondition: {
    ivPercentile: 85,
    termStructure: 'contango'
  },
  originalPosition: {
    type: 'naked-put',
    strike: 100,
    quantity: 1
  },
  adjustment: {
    type: 'put-credit-spread',
    strikes: [100, 95],
    quantity: 1,
    credit: 2.50
  },
  netResult: {
    definedRisk: true,
    creditReceived: 2.50,
    maxRisk: 2.50,
    breakEven: 97.50
  }
};
```

##### B. Volatility Skew Adjustment
```typescript
// Example: Adjusting for put skew
const putSkewAdjustment = {
  marketCondition: {
    putSkew: 'steep',
    callSkew: 'flat'
  },
  originalPosition: {
    type: 'put-credit-spread',
    strikes: [100, 95],
    quantity: 1
  },
  adjustment: {
    type: 'put-ratio-spread',
    strikes: [100, 95, 90],
    quantities: [1, 2],
    credit: 1.00
  },
  netResult: {
    reducedPutExposure: true,
    creditReceived: 1.00,
    maxRisk: 4.00,
    breakEven: 96.00
  }
};
```

### Best Practices for Adjustments

1. **Pre-Planning**
   - Define adjustment triggers
   - Set profit targets
   - Establish loss limits
   - Document adjustment rules

2. **Execution**
   - Use limit orders
   - Consider bid-ask spreads
   - Monitor liquidity
   - Check margin requirements

3. **Risk Management**
   - Calculate new position size
   - Verify margin requirements
   - Check portfolio exposure
   - Monitor correlation risk

4. **Documentation**
   - Record adjustment reasons
   - Track performance
   - Note market conditions
   - Document lessons learned

## Liquidity and Arbitrage

### Liquidity Filters

```typescript
interface LiquidityMetrics {
  bidAskSpread: number;      // Maximum allowed spread
  openInterest: number;      // Minimum open interest
  volume: number;            // Minimum daily volume
  daysToExpiration: number;  // Minimum days to expiration
  impliedVolatility: number; // Maximum IV percentile
}

const LIQUIDITY_THRESHOLDS = {
  // General thresholds
  MIN_OPEN_INTEREST: 100,
  MIN_DAILY_VOLUME: 50,
  MAX_BID_ASK_SPREAD: 0.15,  // 15% of option price
  MIN_DAYS_TO_EXPIRATION: 7,
  MAX_IV_PERCENTILE: 90,

  // Strike-specific thresholds
  STRIKE_DISTANCE: {
    ATM: 0.05,    // 5% from current price
    OTM: 0.10,    // 10% from current price
    DEEP_OTM: 0.20 // 20% from current price
  },

  // Volume thresholds by option type
  VOLUME_THRESHOLDS: {
    WEEKLY: 100,
    MONTHLY: 200,
    QUARTERLY: 300
  }
};

// Example of filtering liquid options
const filterLiquidOptions = (options: Option[]) => {
  return options.filter(option => {
    const spread = (option.ask - option.bid) / option.mid;
    const isLiquid = 
      option.openInterest >= LIQUIDITY_THRESHOLDS.MIN_OPEN_INTEREST &&
      option.volume >= LIQUIDITY_THRESHOLDS.MIN_DAILY_VOLUME &&
      spread <= LIQUIDITY_THRESHOLDS.MAX_BID_ASK_SPREAD &&
      option.daysToExpiration >= LIQUIDITY_THRESHOLDS.MIN_DAYS_TO_EXPIRATION &&
      option.ivPercentile <= LIQUIDITY_THRESHOLDS.MAX_IV_PERCENTILE;
    
    return isLiquid;
  });
};
```

### Arbitrage Opportunities

```typescript
interface ArbitrageOpportunity {
  type: 'vertical' | 'calendar' | 'butterfly' | 'box' | 'synthetic';
  symbol: string;
  legs: {
    type: 'call' | 'put';
    strike: number;
    expiration: string;
    action: 'buy' | 'sell';
    quantity: number;
    price: number;
  }[];
  profit: {
    gross: number;
    net: number;  // After fees and slippage
    roi: number;
    timeToExecute: number;  // Estimated execution time
  };
  risk: {
    execution: 'high' | 'medium' | 'low';
    holding: 'high' | 'medium' | 'low';
    complexity: 'high' | 'medium' | 'low';
  };
  expiration: string;  // When the opportunity expires
}

// Example of arbitrage detection
const detectArbitrage = (options: Option[]) => {
  const opportunities: ArbitrageOpportunity[] = [];
  
  // Vertical spread arbitrage
  const verticalArbitrage = findVerticalArbitrage(options);
  if (verticalArbitrage) opportunities.push(verticalArbitrage);
  
  // Calendar spread arbitrage
  const calendarArbitrage = findCalendarArbitrage(options);
  if (calendarArbitrage) opportunities.push(calendarArbitrage);
  
  // Box spread arbitrage
  const boxArbitrage = findBoxArbitrage(options);
  if (boxArbitrage) opportunities.push(boxArbitrage);
  
  return opportunities;
};

// Real-time arbitrage monitoring
const monitorArbitrage = {
  updateInterval: 1000,  // 1 second
  minProfitThreshold: 0.50,  // $0.50 minimum profit
  maxExecutionTime: 5000,  // 5 seconds maximum execution time
  autoExecute: false,  // Whether to automatically execute opportunities
  notifications: {
    enabled: true,
    channels: ['push', 'email', 'sms'],
    thresholds: {
      profit: 1.00,  // $1.00 minimum profit for notification
      roi: 0.02      // 2% minimum ROI for notification
    }
  }
};
```

## Market Sentiment Analysis

### News Feed Integration

```typescript
interface NewsSource {
  name: string;
  type: 'social' | 'financial' | 'analyst';
  weight: number;  // Importance weight in sentiment calculation
  updateInterval: number;  // Update frequency in milliseconds
}

const NEWS_SOURCES = {
  SOCIAL: [
    { name: 'X', weight: 0.3, updateInterval: 60000 },
    { name: 'Reddit', weight: 0.2, updateInterval: 300000 }
  ],
  FINANCIAL: [
    { name: 'Yahoo Finance', weight: 0.4, updateInterval: 300000 },
    { name: 'WSJ', weight: 0.5, updateInterval: 900000 },
    { name: 'Investing.com', weight: 0.4, updateInterval: 300000 }
  ],
  ANALYST: [
    { name: 'Analyst Ratings', weight: 0.6, updateInterval: 3600000 },
    { name: 'Institutional Holdings', weight: 0.5, updateInterval: 86400000 }
  ]
};

interface SentimentData {
  symbol: string;
  timestamp: string;
  overall: number;  // -1 to 1 scale
  components: {
    social: number;
    financial: number;
    analyst: number;
  };
  sources: {
    [key: string]: {
      sentiment: number;
      volume: number;
      recent: string[];
    };
  };
  trends: {
    shortTerm: 'bullish' | 'bearish' | 'neutral';
    mediumTerm: 'bullish' | 'bearish' | 'neutral';
    longTerm: 'bullish' | 'bearish' | 'neutral';
  };
}

// Example of sentiment analysis
const analyzeSentiment = async (symbol: string): Promise<SentimentData> => {
  const sentimentData: SentimentData = {
    symbol,
    timestamp: new Date().toISOString(),
    overall: 0,
    components: {
      social: 0,
      financial: 0,
      analyst: 0
    },
    sources: {},
    trends: {
      shortTerm: 'neutral',
      mediumTerm: 'neutral',
      longTerm: 'neutral'
    }
  };

  // Fetch and analyze data from each source
  for (const [category, sources] of Object.entries(NEWS_SOURCES)) {
    for (const source of sources) {
      const data = await fetchSourceData(symbol, source);
      const sentiment = analyzeSourceSentiment(data);
      sentimentData.sources[source.name] = {
        sentiment,
        volume: data.volume,
        recent: data.recentPosts
      };
    }
  }

  // Calculate weighted sentiment scores
  sentimentData.components = calculateComponentScores(sentimentData.sources);
  sentimentData.overall = calculateOverallScore(sentimentData.components);
  sentimentData.trends = analyzeTrends(sentimentData);

  return sentimentData;
};

// Real-time sentiment monitoring
const monitorSentiment = {
  updateInterval: 300000,  // 5 minutes
  minConfidence: 0.7,      // Minimum confidence threshold
  alertThresholds: {
    significantChange: 0.2,  // 20% change in sentiment
    extremeSentiment: 0.8    // 80% bullish/bearish
  },
  integration: {
    trading: true,    // Use sentiment in trading decisions
    risk: true,       // Adjust risk based on sentiment
    alerts: true      // Send alerts for significant changes
  }
};
```

### Sentiment-Based Trading Signals

```typescript
interface TradingSignal {
  symbol: string;
  type: 'entry' | 'exit' | 'adjustment';
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  sentiment: {
    overall: number;
    components: {
      social: number;
      financial: number;
      analyst: number;
    };
  };
  recommendedAction: {
    strategy: string;
    strikes: number[];
    expiration: string;
    size: number;
  };
  risk: {
    level: 'low' | 'medium' | 'high';
    maxLoss: number;
    targetProfit: number;
  };
}

// Example of generating trading signals
const generateTradingSignals = (sentimentData: SentimentData): TradingSignal[] => {
  const signals: TradingSignal[] = [];
  
  // Generate signals based on sentiment strength and consistency
  if (Math.abs(sentimentData.overall) > 0.7) {
    const signal: TradingSignal = {
      symbol: sentimentData.symbol,
      type: 'entry',
      direction: sentimentData.overall > 0 ? 'bullish' : 'bearish',
      confidence: Math.abs(sentimentData.overall),
      sentiment: {
        overall: sentimentData.overall,
        components: sentimentData.components
      },
      recommendedAction: {
        strategy: determineStrategy(sentimentData),
        strikes: calculateStrikes(sentimentData),
        expiration: determineExpiration(sentimentData),
        size: calculatePositionSize(sentimentData)
      },
      risk: {
        level: determineRiskLevel(sentimentData),
        maxLoss: calculateMaxLoss(sentimentData),
        targetProfit: calculateTargetProfit(sentimentData)
      }
    };
    
    signals.push(signal);
  }
  
  return signals;
};
```

## Testing

Run the test suite:
```bash
npm test
```

Run specific test files:
```bash
npm test -- -t "TradingJournal"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Reference Links

### Documentation
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Styled Components](https://styled-components.com/docs)
- [TensorFlow.js](https://www.tensorflow.org/js/guide)
- [Axios Documentation](https://axios-http.com/docs/intro)

### Learning Resources
- [Options Trading Basics](https://www.investopedia.com/options-basics-tutorial-4583012)
- [Technical Analysis](https://www.investopedia.com/technical-analysis-4689657)
- [Risk Management](https://www.investopedia.com/risk-management-4689657)
- [Market Regimes](https://www.investopedia.com/market-regimes-4689657)

### API References
- [Market Data APIs](https://www.alphavantage.co/documentation/)
- [Options Data](https://polygon.io/docs/options)
- [Technical Indicators](https://www.tradingview.com/scripts/technicalindicators/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:
1. Check the [documentation](https://github.com/your-org/option-trading-platform/docs)
2. Search [existing issues](https://github.com/your-org/option-trading-platform/issues)
3. Create a new issue if needed

## Acknowledgments

- React Native community
- Open source contributors
- Financial data providers
- Trading education resources 