import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TradingViewWidget from '@option-trading-platform/trading-view';
import OptionsAPI, { OptionChain, MarketData } from '@option-trading-platform/api';
import RiskManager, { RiskProfile, Strategy } from '@option-trading-platform/risk-management';
import RiskProfileQuestionnaire from './components/RiskProfileQuestionnaire';
import StrategyRecommendations from './components/StrategyRecommendations';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #1e222d;
  color: #d1d4dc;
`;

const Header = styled.header`
  padding: 1rem;
  background-color: #2a2e39;
  border-bottom: 1px solid #363a45;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  padding: 1rem;
  gap: 1rem;
`;

const ChartSection = styled.section`
  flex: 2;
  background-color: #2a2e39;
  border-radius: 4px;
  padding: 1rem;
`;

const OptionsSection = styled.section`
  flex: 1;
  background-color: #2a2e39;
  border-radius: 4px;
  padding: 1rem;
  overflow-y: auto;
`;

const OptionsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #363a45;
  }

  th {
    background-color: #363a45;
  }
`;

const MarketInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #363a45;
  border-radius: 4px;
`;

const InfoCard = styled.div`
  padding: 0.5rem;
  background-color: #2a2e39;
  border-radius: 4px;
`;

const RiskSection = styled.section`
  background-color: #2a2e39;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const RiskMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RiskMetric = styled.div`
  background-color: #1e222d;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ value, type }: { value: number; type?: string }) => {
    if (type === 'percentage') {
      if (value >= 0.6) return '#26a69a';
      if (value >= 0.4) return '#ffb74d';
      return '#ef5350';
    }
    if (value >= 0) return '#26a69a';
    if (value < -0.1) return '#ef5350';
    return '#ffb74d';
  }};
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: #787b86;
  margin-top: 0.5rem;
`;

const MarketBiasFilter = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MarketBiasButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ active }) => active ? '#2962ff' : '#363a45'};
  border-radius: 4px;
  background-color: ${({ active }) => active ? '#1e4bd8' : '#1e222d'};
  color: #d1d4dc;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2962ff;
  }
`;

const MarketRegimeContainer = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const RegimeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const RegimeTitle = styled.h3`
  margin: 0;
  color: #fff;
`;

const RegimeConfidence = styled.div<{ confidence: number }>`
  background: ${props => {
    const hue = props.confidence * 120; // 0 = red, 120 = green
    return `hsl(${hue}, 70%, 40%)`;
  }};
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9em;
`;

const RegimeIndicators = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const Indicator = styled.div`
  background: #2a2a2a;
  padding: 10px;
  border-radius: 4px;
`;

const IndicatorLabel = styled.div`
  color: #888;
  font-size: 0.8em;
  margin-bottom: 5px;
`;

const IndicatorValue = styled.div<{ value: number }>`
  color: ${props => {
    if (props.value > 0.7) return '#4caf50';
    if (props.value > 0.3) return '#ff9800';
    return '#f44336';
  }};
  font-weight: bold;
`;

const App: React.FC = () => {
  const [symbol, setSymbol] = useState('SPY');
  const [optionsChain, setOptionsChain] = useState<OptionChain[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [riskManager, setRiskManager] = useState<RiskManager | null>(null);
  const [recommendedStrategies, setRecommendedStrategies] = useState<Strategy[]>([]);
  const [selectedMarketBias, setSelectedMarketBias] = useState<'bullish' | 'bearish' | 'neutral' | null>(null);

  const api = new OptionsAPI(process.env.REACT_APP_POLYGON_API_KEY || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [chain, market] = await Promise.all([
          api.getOptionsChain(symbol, '2024-03-15'),
          api.getMarketData(symbol)
        ]);
        setOptionsChain(chain);
        setMarketData(market);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const handleRiskProfileSubmit = (profile: RiskProfile) => {
    setRiskProfile(profile);
    const manager = new RiskManager(profile);
    setRiskManager(manager);
    setRecommendedStrategies(manager.getRecommendedStrategies());
  };

  if (!riskProfile) {
    return <RiskProfileQuestionnaire onSubmit={handleRiskProfileSubmit} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const riskMetrics = riskManager?.calculateRiskMetrics();

  const filteredStrategies = recommendedStrategies.filter(strategy => 
    !selectedMarketBias || strategy.marketBias === selectedMarketBias
  );

  const renderMarketRegime = () => {
    if (!riskManager || !marketData) return null;

    const metrics = riskManager.calculateRiskMetrics(marketData);
    const regime = metrics.marketRegime;
    if (!regime) return null;

    return (
      <MarketRegimeContainer>
        <RegimeHeader>
          <RegimeTitle>Market Regime: {regime.regime.charAt(0).toUpperCase() + regime.regime.slice(1)}</RegimeTitle>
          <RegimeConfidence confidence={regime.confidence}>
            Confidence: {(regime.confidence * 100).toFixed(1)}%
          </RegimeConfidence>
        </RegimeHeader>
        
        <RegimeIndicators>
          <Indicator>
            <IndicatorLabel>Trend Strength</IndicatorLabel>
            <IndicatorValue value={regime.indicators.trendStrength}>
              {(regime.indicators.trendStrength * 100).toFixed(1)}%
            </IndicatorValue>
          </Indicator>
          
          <Indicator>
            <IndicatorLabel>Volatility</IndicatorLabel>
            <IndicatorValue value={1 - regime.indicators.volatility}>
              {(regime.indicators.volatility * 100).toFixed(1)}%
            </IndicatorValue>
          </Indicator>
          
          <Indicator>
            <IndicatorLabel>Momentum</IndicatorLabel>
            <IndicatorValue value={regime.indicators.momentum}>
              {(regime.indicators.momentum * 100).toFixed(1)}%
            </IndicatorValue>
          </Indicator>
          
          <Indicator>
            <IndicatorLabel>Volume Trend</IndicatorLabel>
            <IndicatorValue value={regime.indicators.volumeTrend}>
              {(regime.indicators.volumeTrend * 100).toFixed(1)}%
            </IndicatorValue>
          </Indicator>
        </RegimeIndicators>
      </MarketRegimeContainer>
    );
  };

  return (
    <AppContainer>
      <Header>
        <h1>Options Trading Platform</h1>
      </Header>
      <MainContent>
        <ChartSection>
          <TradingViewWidget
            symbol={symbol}
            height={600}
            theme="dark"
            studies={['RSI@tv-basicstudies', 'MACD@tv-basicstudies']}
          />
        </ChartSection>
        <OptionsSection>
          {riskMetrics && (
            <RiskSection>
              <h2>Risk Metrics</h2>
              <RiskMetrics>
                <RiskMetric>
                  <MetricValue value={riskMetrics.currentDrawdown}>
                    {(riskMetrics.currentDrawdown * 100).toFixed(1)}%
                  </MetricValue>
                  <MetricLabel>Current Drawdown</MetricLabel>
                </RiskMetric>
                <RiskMetric>
                  <MetricValue value={-riskMetrics.consecutiveLosses}>
                    {riskMetrics.consecutiveLosses}
                  </MetricValue>
                  <MetricLabel>Consecutive Losses</MetricLabel>
                </RiskMetric>
                <RiskMetric>
                  <MetricValue value={riskMetrics.sharpeRatio}>
                    {riskMetrics.sharpeRatio.toFixed(2)}
                  </MetricValue>
                  <MetricLabel>Sharpe Ratio</MetricLabel>
                </RiskMetric>
                <RiskMetric>
                  <MetricValue value={-riskMetrics.maxDrawdown}>
                    {(riskMetrics.maxDrawdown * 100).toFixed(1)}%
                  </MetricValue>
                  <MetricLabel>Max Drawdown</MetricLabel>
                </RiskMetric>
                <RiskMetric>
                  <MetricValue value={riskMetrics.winRate} type="percentage">
                    {(riskMetrics.winRate * 100).toFixed(1)}%
                  </MetricValue>
                  <MetricLabel>Win Rate</MetricLabel>
                </RiskMetric>
                <RiskMetric>
                  <MetricValue value={riskMetrics.profitFactor}>
                    {riskMetrics.profitFactor.toFixed(2)}
                  </MetricValue>
                  <MetricLabel>Profit Factor</MetricLabel>
                </RiskMetric>
                <RiskMetric>
                  <MetricValue value={riskMetrics.expectancy}>
                    ${riskMetrics.expectancy.toFixed(2)}
                  </MetricValue>
                  <MetricLabel>Trade Expectancy</MetricLabel>
                </RiskMetric>
                <RiskMetric>
                  <MetricValue value={riskMetrics.kellyCriterion} type="percentage">
                    {(riskMetrics.kellyCriterion * 100).toFixed(1)}%
                  </MetricValue>
                  <MetricLabel>Kelly Criterion</MetricLabel>
                </RiskMetric>
              </RiskMetrics>
            </RiskSection>
          )}

          {marketData && (
            <MarketInfo>
              <InfoCard>
                <h3>Price</h3>
                <p>${marketData.price.toFixed(2)}</p>
                <p style={{ color: marketData.change >= 0 ? '#26a69a' : '#ef5350' }}>
                  {marketData.change >= 0 ? '+' : ''}{marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
                </p>
              </InfoCard>
              <InfoCard>
                <h3>RSI</h3>
                <p>{marketData.rsi.toFixed(2)}</p>
              </InfoCard>
              <InfoCard>
                <h3>Support</h3>
                <p>S1: ${marketData.support.s1.toFixed(2)}</p>
                <p>S2: ${marketData.support.s2.toFixed(2)}</p>
              </InfoCard>
              <InfoCard>
                <h3>Resistance</h3>
                <p>R1: ${marketData.resistance.r1.toFixed(2)}</p>
                <p>R2: ${marketData.resistance.r2.toFixed(2)}</p>
              </InfoCard>
            </MarketInfo>
          )}

          <MarketBiasFilter>
            <MarketBiasButton
              active={selectedMarketBias === null}
              onClick={() => setSelectedMarketBias(null)}
            >
              All Strategies
            </MarketBiasButton>
            <MarketBiasButton
              active={selectedMarketBias === 'bullish'}
              onClick={() => setSelectedMarketBias('bullish')}
            >
              Bullish
            </MarketBiasButton>
            <MarketBiasButton
              active={selectedMarketBias === 'bearish'}
              onClick={() => setSelectedMarketBias('bearish')}
            >
              Bearish
            </MarketBiasButton>
            <MarketBiasButton
              active={selectedMarketBias === 'neutral'}
              onClick={() => setSelectedMarketBias('neutral')}
            >
              Neutral
            </MarketBiasButton>
          </MarketBiasFilter>

          <StrategyRecommendations strategies={filteredStrategies} />

          <OptionsTable>
            <thead>
              <tr>
                <th>Strike</th>
                <th>Type</th>
                <th>Last</th>
                <th>Bid</th>
                <th>Ask</th>
                <th>Volume</th>
                <th>OI</th>
                <th>IV</th>
              </tr>
            </thead>
            <tbody>
              {optionsChain.map((option) => (
                <tr key={`${option.strike}-${option.type}`}>
                  <td>${option.strike.toFixed(2)}</td>
                  <td>{option.type.toUpperCase()}</td>
                  <td>${option.lastPrice.toFixed(2)}</td>
                  <td>${option.bid.toFixed(2)}</td>
                  <td>${option.ask.toFixed(2)}</td>
                  <td>{option.volume}</td>
                  <td>{option.openInterest}</td>
                  <td>{(option.impliedVolatility * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </OptionsTable>

          {renderMarketRegime()}
        </OptionsSection>
      </MainContent>
    </AppContainer>
  );
};

export default App; 