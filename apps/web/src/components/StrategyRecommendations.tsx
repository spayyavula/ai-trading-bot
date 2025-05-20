import React from 'react';
import styled from 'styled-components';
import { Strategy } from '@option-trading-platform/risk-management';

const Container = styled.div`
  background-color: #2a2e39;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const StrategyCard = styled.div`
  background-color: #1e222d;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid #363a45;
`;

const StrategyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StrategyName = styled.h3`
  margin: 0;
  color: #2962ff;
`;

const Badge = styled.span<{ level: string; type: 'risk' | 'bias' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: bold;
  margin-left: 0.5rem;
  background-color: ${({ level, type }) => {
    if (type === 'risk') {
      switch (level) {
        case 'low':
          return '#26a69a';
        case 'medium':
          return '#ffb74d';
        case 'high':
          return '#ef5350';
        default:
          return '#363a45';
      }
    } else {
      switch (level) {
        case 'bullish':
          return '#26a69a';
        case 'bearish':
          return '#ef5350';
        case 'neutral':
          return '#ffb74d';
        default:
          return '#363a45';
      }
    }
  }};
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Metric = styled.div`
  text-align: center;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: #787b86;
  margin-bottom: 0.25rem;
`;

const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
`;

const SetupSection = styled.div`
  margin-top: 1rem;
`;

const SetupTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #787b86;
`;

const SetupList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  color: #d1d4dc;
`;

interface Props {
  strategies: Strategy[];
}

const StrategyRecommendations: React.FC<Props> = ({ strategies }) => {
  return (
    <Container>
      <h2>Recommended Strategies</h2>
      {strategies.map((strategy) => (
        <StrategyCard key={strategy.name}>
          <StrategyHeader>
            <StrategyName>{strategy.name}</StrategyName>
            <BadgeContainer>
              <Badge level={strategy.riskLevel} type="risk">
                {strategy.riskLevel.toUpperCase()}
              </Badge>
              <Badge level={strategy.marketBias} type="bias">
                {strategy.marketBias.toUpperCase()}
              </Badge>
            </BadgeContainer>
          </StrategyHeader>
          
          <p>{strategy.description}</p>
          
          <MetricsGrid>
            <Metric>
              <MetricLabel>Expected Return</MetricLabel>
              <MetricValue>{(strategy.expectedReturn * 100).toFixed(1)}%</MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Max Drawdown</MetricLabel>
              <MetricValue>{(strategy.maxDrawdown * 100).toFixed(1)}%</MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Sharpe Ratio</MetricLabel>
              <MetricValue>{strategy.sharpeRatio.toFixed(2)}</MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Probability of Profit</MetricLabel>
              <MetricValue>{(strategy.probabilityOfProfit * 100).toFixed(1)}%</MetricValue>
            </Metric>
          </MetricsGrid>

          <Metric>
            <MetricLabel>Recommended Position Size</MetricLabel>
            <MetricValue>${strategy.recommendedPositionSize.toFixed(2)}</MetricValue>
          </Metric>

          <SetupSection>
            <SetupTitle>Entry Rules</SetupTitle>
            <SetupList>
              {strategy.setup.entry.map((rule, index) => (
                <li key={`entry-${index}`}>{rule}</li>
              ))}
            </SetupList>
          </SetupSection>

          <SetupSection>
            <SetupTitle>Exit Rules</SetupTitle>
            <SetupList>
              {strategy.setup.exit.map((rule, index) => (
                <li key={`exit-${index}`}>{rule}</li>
              ))}
            </SetupList>
          </SetupSection>

          <SetupSection>
            <SetupTitle>Stop Loss</SetupTitle>
            <SetupList>
              <li>{strategy.setup.stopLoss}</li>
            </SetupList>
          </SetupSection>
        </StrategyCard>
      ))}
    </Container>
  );
};

export default StrategyRecommendations; 