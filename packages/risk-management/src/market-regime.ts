import { mean, std } from 'mathjs';
import { RSI, MACD, BollingerBands } from 'technicalindicators';

export interface MarketData {
  prices: number[];
  volumes: number[];
  timestamps: string[];
}

export interface MarketRegime {
  regime: 'bullish' | 'bearish' | 'neutral' | 'volatile';
  confidence: number;
  indicators: {
    trend: number;
    momentum: number;
    volatility: number;
    volume: number;
  };
}

export class MarketRegimeAnalyzer {
  private readonly lookbackPeriod: number;
  private readonly rsiPeriod: number;
  private readonly macdFastPeriod: number;
  private readonly macdSlowPeriod: number;
  private readonly macdSignalPeriod: number;
  private readonly bbPeriod: number;
  private readonly bbStdDev: number;

  constructor(
    lookbackPeriod: number = 20,
    rsiPeriod: number = 14,
    macdFastPeriod: number = 12,
    macdSlowPeriod: number = 26,
    macdSignalPeriod: number = 9,
    bbPeriod: number = 20,
    bbStdDev: number = 2
  ) {
    this.lookbackPeriod = lookbackPeriod;
    this.rsiPeriod = rsiPeriod;
    this.macdFastPeriod = macdFastPeriod;
    this.macdSlowPeriod = macdSlowPeriod;
    this.macdSignalPeriod = macdSignalPeriod;
    this.bbPeriod = bbPeriod;
    this.bbStdDev = bbStdDev;
  }

  private calculateRSI(prices: number[]): number[] {
    const rsi = new RSI({
      values: prices,
      period: this.rsiPeriod
    });
    return rsi.getResult();
  }

  private calculateMACD(prices: number[]): { MACD: number[]; signal: number[]; histogram: number[] } {
    const macd = new MACD({
      values: prices,
      fastPeriod: this.macdFastPeriod,
      slowPeriod: this.macdSlowPeriod,
      signalPeriod: this.macdSignalPeriod
    });
    return macd.getResult();
  }

  private calculateBollingerBands(prices: number[]): { upper: number[]; middle: number[]; lower: number[] } {
    const bb = new BollingerBands({
      values: prices,
      period: this.bbPeriod,
      stdDev: this.bbStdDev
    });
    return bb.getResult();
  }

  private calculateVolatility(prices: number[]): number {
    const returns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
    return std(returns) * Math.sqrt(252); // Annualized volatility
  }

  private calculateVolumeTrend(volumes: number[]): number {
    const recentVolumes = volumes.slice(-this.lookbackPeriod);
    const volumeMA = mean(recentVolumes);
    const currentVolume = recentVolumes[recentVolumes.length - 1];
    return currentVolume / volumeMA;
  }

  private calculateTrendStrength(prices: number[]): number {
    const returns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
    const avgReturn = mean(returns);
    const stdReturn = std(returns);
    return avgReturn / stdReturn;
  }

  private calculateMomentum(prices: number[]): number {
    const recentPrices = prices.slice(-this.lookbackPeriod);
    const priceChange = (recentPrices[recentPrices.length - 1] - recentPrices[0]) / recentPrices[0];
    return priceChange;
  }

  private normalizeIndicator(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  private determineRegime(indicators: MarketRegime['indicators']): MarketRegime {
    const { trend, momentum, volatility, volume } = indicators;

    // Calculate regime scores
    const bullishScore = (trend + momentum + volume) / 3;
    const bearishScore = (-trend - momentum + volume) / 3;
    const neutralScore = (1 - Math.abs(trend) - Math.abs(momentum)) * volume;
    const volatileScore = volatility * (1 - Math.abs(trend));

    // Find the highest scoring regime
    const scores = [
      { regime: 'bullish' as const, score: bullishScore },
      { regime: 'bearish' as const, score: bearishScore },
      { regime: 'neutral' as const, score: neutralScore },
      { regime: 'volatile' as const, score: volatileScore }
    ];

    const bestRegime = scores.reduce((a, b) => a.score > b.score ? a : b);
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const confidence = bestRegime.score / totalScore;

    return {
      regime: bestRegime.regime,
      confidence,
      indicators
    };
  }

  analyzeMarket(data: MarketData): MarketRegime {
    const { prices, volumes } = data;

    // Calculate technical indicators
    const rsi = this.calculateRSI(prices);
    const macd = this.calculateMACD(prices);
    const bb = this.calculateBollingerBands(prices);

    // Calculate derived metrics
    const volatility = this.calculateVolatility(prices);
    const volumeTrend = this.calculateVolumeTrend(volumes);
    const trendStrength = this.calculateTrendStrength(prices);
    const momentum = this.calculateMomentum(prices);

    // Normalize indicators
    const normalizedIndicators = {
      trend: this.normalizeIndicator(trendStrength, -2, 2),
      momentum: this.normalizeIndicator(momentum, -0.1, 0.1),
      volatility: this.normalizeIndicator(volatility, 0, 0.5),
      volume: this.normalizeIndicator(volumeTrend, 0.5, 2)
    };

    // Determine market regime
    return this.determineRegime(normalizedIndicators);
  }

  getRecommendedStrategies(regime: MarketRegime): string[] {
    switch (regime.regime) {
      case 'bullish':
        return [
          'Bull Call Spread',
          'Covered Call',
          'Bull Put Spread'
        ];
      case 'bearish':
        return [
          'Bear Call Spread',
          'Protective Put',
          'Put Debit Spread'
        ];
      case 'neutral':
        return [
          'Iron Condor',
          'Calendar Spread',
          'Butterfly Spread'
        ];
      case 'volatile':
        return [
          'Straddle',
          'Strangle',
          'Iron Butterfly'
        ];
      default:
        return [];
    }
  }
} 