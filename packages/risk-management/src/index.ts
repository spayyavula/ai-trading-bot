import { mean, std, min, max } from 'mathjs';
import { MarketRegimeAnalyzer, MarketRegime, MarketData } from './market-regime';

export interface RiskProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  maxDrawdown: number;
  targetReturn: number;
  investmentHorizon: number;
  accountBalance: number;
  maxLossPerTrade: number;
  preferredMarketBias?: 'bullish' | 'bearish' | 'neutral';
}

export interface Strategy {
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  recommendedPositionSize: number;
  probabilityOfProfit: number;
  marketBias: 'bullish' | 'bearish' | 'neutral';
  setup: {
    entry: string[];
    exit: string[];
    stopLoss: string;
  };
}

export interface TradeHistory {
  date: string;
  strategy: string;
  profitLoss: number;
  drawdown: number;
}

export interface RiskMetrics {
  currentDrawdown: number;
  consecutiveLosses: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  expectancy: number;
  kellyCriterion: number;
  marketRegime?: MarketRegime;
}

class RiskManager {
  private riskProfile: RiskProfile;
  private tradeHistory: TradeHistory[];
  private marketRegimeAnalyzer: MarketRegimeAnalyzer;

  constructor(riskProfile: RiskProfile, tradeHistory: TradeHistory[] = []) {
    this.riskProfile = riskProfile;
    this.tradeHistory = tradeHistory;
    this.marketRegimeAnalyzer = new MarketRegimeAnalyzer();
  }

  calculateSharpeRatio(returns: number[]): number {
    const riskFreeRate = 0.02; // 2% annual risk-free rate
    const excessReturns = returns.map(r => r - riskFreeRate / 252); // Daily excess returns
    const avgExcessReturn = mean(excessReturns);
    const stdDev = std(excessReturns);
    return avgExcessReturn / stdDev * Math.sqrt(252); // Annualized Sharpe ratio
  }

  calculateMaxDrawdown(returns: number[]): number {
    let peak = returns[0];
    let maxDrawdown = 0;

    for (const value of returns) {
      if (value > peak) {
        peak = value;
      }
      const drawdown = (peak - value) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown;
  }

  calculateKellyCriterion(winRate: number, avgWin: number, avgLoss: number): number {
    const winLossRatio = Math.abs(avgWin / avgLoss);
    return (winRate * winLossRatio - (1 - winRate)) / winLossRatio;
  }

  getRecommendedStrategies(marketData?: MarketData): Strategy[] {
    const strategies: Strategy[] = [
      // Bullish Strategies
      {
        name: 'Bull Call Spread',
        description: 'Buy lower strike call, sell higher strike call',
        riskLevel: 'medium',
        expectedReturn: 0.25,
        maxDrawdown: 0.15,
        sharpeRatio: 1.8,
        probabilityOfProfit: 0.65,
        marketBias: 'bullish',
        recommendedPositionSize: this.calculatePositionSize(0.15),
        setup: {
          entry: [
            'Buy ATM call',
            'Sell OTM call (30-40% higher)',
            '30-45 days to expiration'
          ],
          exit: [
            '50% profit target',
            'Close at 50% max loss',
            'Roll if tested'
          ],
          stopLoss: '50% of max loss'
        }
      },
      {
        name: 'Covered Call',
        description: 'Own stock and sell OTM call',
        riskLevel: 'low',
        expectedReturn: 0.15,
        maxDrawdown: 0.10,
        sharpeRatio: 1.4,
        probabilityOfProfit: 0.75,
        marketBias: 'bullish',
        recommendedPositionSize: this.calculatePositionSize(0.10),
        setup: {
          entry: [
            'Own 100 shares',
            'Sell OTM call (30 delta)',
            '30-45 days to expiration'
          ],
          exit: [
            '50% profit target',
            'Roll if tested',
            'Close at 21 days'
          ],
          stopLoss: 'Stock stop loss'
        }
      },
      {
        name: 'Bull Put Spread',
        description: 'Sell OTM put spread in bullish market',
        riskLevel: 'medium',
        expectedReturn: 0.20,
        maxDrawdown: 0.15,
        sharpeRatio: 1.8,
        probabilityOfProfit: 0.70,
        marketBias: 'bullish',
        recommendedPositionSize: this.calculatePositionSize(0.15),
        setup: {
          entry: [
            'Sell OTM put (30 delta)',
            'Buy lower strike put',
            '30-45 days to expiration'
          ],
          exit: [
            '50% profit target',
            'Close at 50% max loss',
            'Roll if tested'
          ],
          stopLoss: '50% of max loss'
        }
      },

      // Bearish Strategies
      {
        name: 'Bear Call Spread',
        description: 'Sell OTM call spread in bearish market',
        riskLevel: 'medium',
        expectedReturn: 0.20,
        maxDrawdown: 0.15,
        sharpeRatio: 1.7,
        probabilityOfProfit: 0.70,
        marketBias: 'bearish',
        recommendedPositionSize: this.calculatePositionSize(0.15),
        setup: {
          entry: [
            'Sell OTM call (30 delta)',
            'Buy higher strike call',
            '30-45 days to expiration'
          ],
          exit: [
            '50% profit target',
            'Close at 50% max loss',
            'Roll if tested'
          ],
          stopLoss: '50% of max loss'
        }
      },
      {
        name: 'Protective Put',
        description: 'Own stock and buy ATM put',
        riskLevel: 'low',
        expectedReturn: 0.12,
        maxDrawdown: 0.08,
        sharpeRatio: 1.3,
        probabilityOfProfit: 0.60,
        marketBias: 'bearish',
        recommendedPositionSize: this.calculatePositionSize(0.08),
        setup: {
          entry: [
            'Own 100 shares',
            'Buy ATM put',
            '30-45 days to expiration'
          ],
          exit: [
            'Close put at 50% loss',
            'Roll if tested',
            'Close at 21 days'
          ],
          stopLoss: '50% of put premium'
        }
      },

      // Neutral Strategies
      {
        name: 'Iron Condor',
        description: 'Sell OTM put and call spreads to collect premium',
        riskLevel: 'low',
        expectedReturn: 0.15,
        maxDrawdown: 0.10,
        sharpeRatio: 1.5,
        probabilityOfProfit: 0.80,
        marketBias: 'neutral',
        recommendedPositionSize: this.calculatePositionSize(0.10),
        setup: {
          entry: [
            'Sell OTM put spread (30 delta)',
            'Sell OTM call spread (30 delta)',
            'Equal width spreads'
          ],
          exit: [
            '50% profit target',
            '21 days to expiration',
            'Close at 50% max loss'
          ],
          stopLoss: '50% of max loss'
        }
      },
      {
        name: 'Calendar Spread',
        description: 'Sell near-term option, buy far-term option',
        riskLevel: 'low',
        expectedReturn: 0.12,
        maxDrawdown: 0.08,
        sharpeRatio: 1.3,
        probabilityOfProfit: 0.75,
        marketBias: 'neutral',
        recommendedPositionSize: this.calculatePositionSize(0.08),
        setup: {
          entry: [
            'Sell near-term ATM option',
            'Buy far-term ATM option',
            'Equal strikes'
          ],
          exit: [
            '50% profit target',
            'Close at 50% max loss',
            'Roll if tested'
          ],
          stopLoss: '50% of max loss'
        }
      },
      {
        name: 'Butterfly Spread',
        description: 'Combination of bull and bear spreads',
        riskLevel: 'medium',
        expectedReturn: 0.30,
        maxDrawdown: 0.20,
        sharpeRatio: 1.9,
        probabilityOfProfit: 0.65,
        marketBias: 'neutral',
        recommendedPositionSize: this.calculatePositionSize(0.20),
        setup: {
          entry: [
            'Buy lower strike call',
            'Sell 2 ATM calls',
            'Buy higher strike call'
          ],
          exit: [
            '50% profit target',
            'Close at 50% max loss',
            'Close at 21 days'
          ],
          stopLoss: '50% of max loss'
        }
      },
      {
        name: 'Straddle',
        description: 'Buy ATM call and put',
        riskLevel: 'high',
        expectedReturn: 0.40,
        maxDrawdown: 0.25,
        sharpeRatio: 2.0,
        probabilityOfProfit: 0.55,
        marketBias: 'neutral',
        recommendedPositionSize: this.calculatePositionSize(0.25),
        setup: {
          entry: [
            'Buy ATM call',
            'Buy ATM put',
            '30-45 days to expiration'
          ],
          exit: [
            '50% profit target',
            'Close at 50% max loss',
            'Close at 21 days'
          ],
          stopLoss: '50% of max loss'
        }
      }
    ];

    // Filter strategies based on risk profile and market bias
    let filteredStrategies = strategies.filter(strategy => {
      // Risk level filtering
      const riskLevelMatch = 
        (this.riskProfile.riskTolerance === 'conservative' && strategy.riskLevel === 'low') ||
        (this.riskProfile.riskTolerance === 'moderate' && (strategy.riskLevel === 'low' || strategy.riskLevel === 'medium')) ||
        (this.riskProfile.riskTolerance === 'aggressive');

      // Market bias filtering
      const marketBiasMatch = !this.riskProfile.preferredMarketBias || 
        strategy.marketBias === this.riskProfile.preferredMarketBias;

      return riskLevelMatch && marketBiasMatch;
    });

    // If market data is provided, use ML-based regime detection
    if (marketData) {
      const marketRegime = this.marketRegimeAnalyzer.analyzeMarket(marketData);
      const recommendedStrategyNames = this.marketRegimeAnalyzer.getRecommendedStrategies(marketRegime);
      
      // Filter strategies based on ML recommendations
      filteredStrategies = filteredStrategies.filter(strategy => 
        recommendedStrategyNames.includes(strategy.name)
      );

      // Adjust position sizes based on regime confidence
      filteredStrategies = filteredStrategies.map(strategy => ({
        ...strategy,
        recommendedPositionSize: this.adjustPositionSizeForRegime(
          strategy.recommendedPositionSize,
          marketRegime
        )
      }));
    }

    return filteredStrategies;
  }

  private adjustPositionSizeForRegime(positionSize: number, regime: MarketRegime): number {
    // Adjust position size based on regime confidence
    const confidenceMultiplier = regime.confidence;
    
    // Additional adjustments based on regime type
    let regimeMultiplier = 1.0;
    switch (regime.regime) {
      case 'volatile':
        regimeMultiplier = 0.7; // Reduce position size in volatile markets
        break;
      case 'neutral':
        regimeMultiplier = 0.9; // Slightly reduce in neutral markets
        break;
      case 'bullish':
      case 'bearish':
        regimeMultiplier = 1.0; // Full position size in trending markets
        break;
    }

    return positionSize * confidenceMultiplier * regimeMultiplier;
  }

  private calculatePositionSize(maxDrawdown: number): number {
    const maxLossAmount = this.riskProfile.accountBalance * this.riskProfile.maxLossPerTrade;
    const positionSize = maxLossAmount / maxDrawdown;
    
    // Apply Kelly Criterion for position sizing
    const metrics = this.calculateRiskMetrics();
    const kellySize = this.riskProfile.accountBalance * metrics.kellyCriterion;
    
    // Use the more conservative of the two methods
    const conservativeSize = Math.min(positionSize, kellySize);
    
    // Cap at 10% of account per trade
    return Math.min(conservativeSize, this.riskProfile.accountBalance * 0.1);
  }

  calculateRiskMetrics(marketData?: MarketData): RiskMetrics {
    const metrics = {
      currentDrawdown: 0,
      consecutiveLosses: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      winRate: 0,
      profitFactor: 0,
      averageWin: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      expectancy: 0,
      kellyCriterion: 0,
      marketRegime: undefined as MarketRegime | undefined
    };

    if (this.tradeHistory.length === 0) {
      return metrics;
    }

    // Calculate basic metrics
    const returns = this.tradeHistory.map(t => t.profitLoss);
    metrics.currentDrawdown = this.calculateMaxDrawdown(returns);
    
    let consecutiveLosses = 0;
    for (let i = this.tradeHistory.length - 1; i >= 0; i--) {
      if (this.tradeHistory[i].profitLoss < 0) {
        consecutiveLosses++;
      } else {
        break;
      }
    }
    metrics.consecutiveLosses = consecutiveLosses;

    // Calculate win rate and profit metrics
    const winningTrades = this.tradeHistory.filter(t => t.profitLoss > 0);
    const losingTrades = this.tradeHistory.filter(t => t.profitLoss < 0);
    
    metrics.winRate = winningTrades.length / this.tradeHistory.length;
    metrics.averageWin = winningTrades.length > 0 ? 
      mean(winningTrades.map(t => t.profitLoss)) : 0;
    metrics.averageLoss = losingTrades.length > 0 ? 
      mean(losingTrades.map(t => t.profitLoss)) : 0;
    
    metrics.largestWin = winningTrades.length > 0 ? 
      max(winningTrades.map(t => t.profitLoss)) : 0;
    metrics.largestLoss = losingTrades.length > 0 ? 
      min(losingTrades.map(t => t.profitLoss)) : 0;
    
    metrics.profitFactor = Math.abs(metrics.averageWin / metrics.averageLoss);
    metrics.expectancy = (metrics.winRate * metrics.averageWin) + ((1 - metrics.winRate) * metrics.averageLoss);
    metrics.kellyCriterion = this.calculateKellyCriterion(metrics.winRate, metrics.averageWin, metrics.averageLoss);
    metrics.sharpeRatio = this.calculateSharpeRatio(returns);
    metrics.maxDrawdown = this.calculateMaxDrawdown(returns);

    // Add market regime analysis if market data is provided
    if (marketData) {
      metrics.marketRegime = this.marketRegimeAnalyzer.analyzeMarket(marketData);
    }

    return metrics;
  }

  shouldTrade(marketData?: MarketData): boolean {
    const metrics = this.calculateRiskMetrics(marketData);
    
    // Basic risk checks
    const basicChecks = 
      metrics.currentDrawdown < this.riskProfile.maxDrawdown &&
      metrics.consecutiveLosses < 3 &&
      metrics.winRate >= 0.4 &&
      metrics.profitFactor >= 1.5;

    // If no market data, return basic checks
    if (!marketData) {
      return basicChecks;
    }

    // Additional checks based on market regime
    const regime = metrics.marketRegime;
    if (!regime) {
      return basicChecks;
    }

    // Adjust trading criteria based on market regime
    switch (regime.regime) {
      case 'volatile':
        // More conservative in volatile markets
        return basicChecks && 
          metrics.winRate >= 0.5 && // Higher win rate requirement
          metrics.profitFactor >= 2.0; // Higher profit factor requirement
      
      case 'neutral':
        // Standard criteria for neutral markets
        return basicChecks;
      
      case 'bullish':
      case 'bearish':
        // More aggressive in trending markets
        return basicChecks && 
          metrics.winRate >= 0.35 && // Lower win rate requirement
          metrics.profitFactor >= 1.3; // Lower profit factor requirement
      
      default:
        return basicChecks;
    }
  }
}

export default RiskManager; 