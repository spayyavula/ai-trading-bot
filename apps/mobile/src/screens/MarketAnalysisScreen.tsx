import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';
import { LineChart } from 'react-native-chart-kit';
import { MarketRegime } from '@option-trading-platform/risk-management';
import { MLRegimePredictor } from '@option-trading-platform/risk-management';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.md}px;
`;

const Section = styled(View)`
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const SectionTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const Card = styled(View)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const MetricRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const MetricLabel = styled.Text`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 16px;
`;

const MetricValue = styled.Text<{ value: number }>`
  color: ${props => {
    if (props.value > 0.7) return props.theme.colors.success;
    if (props.value > 0.3) return props.theme.colors.warning;
    return props.theme.colors.error;
  }};
  font-size: 16px;
  font-weight: bold;
`;

const RegimeIndicator = styled(View)<{ regime: MarketRegime['regime'] }>`
  background-color: ${props => {
    switch (props.regime) {
      case 'bullish':
        return props.theme.colors.success;
      case 'bearish':
        return props.theme.colors.error;
      case 'neutral':
        return props.theme.colors.warning;
      default:
        return props.theme.colors.textSecondary;
    }
  }};
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.md}px;
  border-radius: 4px;
  align-self: flex-start;
`;

const RegimeText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
`;

const MarketAnalysisScreen = () => {
  const theme = useTheme();
  const [marketRegime, setMarketRegime] = useState<MarketRegime | null>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);

  useEffect(() => {
    // Initialize ML predictor
    const predictor = new MLRegimePredictor();
    
    // Fetch and analyze market data
    const analyzeMarket = async () => {
      try {
        // Fetch market data (implement this based on your API)
        const marketData = await fetchMarketData();
        setHistoricalData(marketData);

        // Get regime prediction
        const regime = await predictor.predict(marketData);
        setMarketRegime(regime);
      } catch (error) {
        console.error('Error analyzing market:', error);
      }
    };

    analyzeMarket();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => `rgba(41, 98, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Current Market Regime</SectionTitle>
        <Card>
          {marketRegime && (
            <>
              <MetricRow>
                <MetricLabel>Regime</MetricLabel>
                <RegimeIndicator regime={marketRegime.regime}>
                  <RegimeText>{marketRegime.regime}</RegimeText>
                </RegimeIndicator>
              </MetricRow>
              <MetricRow>
                <MetricLabel>Confidence</MetricLabel>
                <MetricValue value={marketRegime.confidence}>
                  {(marketRegime.confidence * 100).toFixed(1)}%
                </MetricValue>
              </MetricRow>
            </>
          )}
        </Card>
      </Section>

      <Section>
        <SectionTitle>Price Chart</SectionTitle>
        {historicalData && (
          <LineChart
            data={{
              labels: historicalData.timestamps,
              datasets: [{
                data: historicalData.prices
              }]
            }}
            width={Dimensions.get('window').width - theme.spacing.md * 2}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: theme.spacing.md,
              borderRadius: 8
            }}
          />
        )}
      </Section>

      <Section>
        <SectionTitle>Market Indicators</SectionTitle>
        <Card>
          {marketRegime?.indicators && (
            <>
              <MetricRow>
                <MetricLabel>Trend Strength</MetricLabel>
                <MetricValue value={marketRegime.indicators.trend}>
                  {marketRegime.indicators.trend.toFixed(2)}
                </MetricValue>
              </MetricRow>
              <MetricRow>
                <MetricLabel>Momentum</MetricLabel>
                <MetricValue value={marketRegime.indicators.momentum}>
                  {marketRegime.indicators.momentum.toFixed(2)}
                </MetricValue>
              </MetricRow>
              <MetricRow>
                <MetricLabel>Volatility</MetricLabel>
                <MetricValue value={marketRegime.indicators.volatility}>
                  {marketRegime.indicators.volatility.toFixed(2)}
                </MetricValue>
              </MetricRow>
            </>
          )}
        </Card>
      </Section>
    </Container>
  );
};

// Mock function - replace with actual API call
const fetchMarketData = async () => {
  return {
    timestamps: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
    prices: [100, 102, 101, 103, 105],
    volumes: [1000, 1200, 800, 1500, 1300]
  };
};

export default MarketAnalysisScreen; 