import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'styled-components/native';

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.View`
  padding: 16px;
  background-color: ${props => props.theme.colors.primary};
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
`;

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.card};
  border-radius: 8px;
  padding: 8px 16px;
  margin-bottom: 16px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  margin-left: 8px;
  color: ${props => props.theme.colors.text};
`;

const QuickActions = styled.View`
  flex-direction: row;
  padding: 16px;
  gap: 8px;
`;

const ActionButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${props => props.theme.colors.primary};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const ActionButtonText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-weight: bold;
`;

const FeatureGrid = styled.View`
  padding: 16px;
`;

const FeatureCard = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.card};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-left: 8px;
`;

const CardDescription = styled.Text`
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin: 16px;
`;

const MarketCard = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: 8px;
  padding: 16px;
  margin: 8px 16px;
`;

const MarketSymbol = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const MarketPrice = styled.Text`
  font-size: 20px;
  color: ${props => props.theme.colors.text};
  margin-top: 4px;
`;

const MarketChange = styled.Text<{ isPositive: boolean }>`
  color: ${props => props.isPositive ? props.theme.colors.success : props.theme.colors.error};
  margin-top: 4px;
`;

// Types
interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

interface ArbitrageOpportunity {
  id: string;
  type: string;
  profit: number;
  risk: string;
  expiration: string;
}

interface SentimentData {
  symbol: string;
  sentiment: number;
  trend: string;
}

// Component
const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);

  useEffect(() => {
    // TODO: Implement API calls to fetch real data
    const mockData = {
      marketData: [
        { symbol: 'AAPL', price: 150.25, change: 1.2, volume: 1000000 },
        { symbol: 'MSFT', price: 280.50, change: -0.5, volume: 800000 },
        { symbol: 'GOOGL', price: 2750.75, change: 2.1, volume: 500000 }
      ],
      arbitrageOpportunities: [
        { id: '1', type: 'Vertical Spread', profit: 0.75, risk: 'Low', expiration: '2024-03-15' },
        { id: '2', type: 'Calendar Spread', profit: 1.25, risk: 'Medium', expiration: '2024-03-20' }
      ],
      sentimentData: [
        { symbol: 'AAPL', sentiment: 0.8, trend: 'Bullish' },
        { symbol: 'MSFT', sentiment: 0.6, trend: 'Neutral' },
        { symbol: 'GOOGL', sentiment: 0.9, trend: 'Strongly Bullish' }
      ]
    };

    setMarketData(mockData.marketData);
    setArbitrageOpportunities(mockData.arbitrageOpportunities);
    setSentimentData(mockData.sentimentData);
  }, []);

  const features = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      description: 'View your portfolio performance, positions, and market overview',
      path: 'Dashboard'
    },
    {
      title: 'Trading Strategies',
      icon: 'trending-up',
      description: 'Access pre-built options strategies and create custom ones',
      path: 'Strategies'
    },
    {
      title: 'Market Analysis',
      icon: 'assessment',
      description: 'Analyze market regimes, technical indicators, and sentiment',
      path: 'Analysis'
    },
    {
      title: 'Trading Journal',
      icon: 'book',
      description: 'Document your trades, track performance, and learn from experience',
      path: 'Journal'
    },
    {
      title: 'Learning Scenarios',
      icon: 'school',
      description: 'Practice trading strategies in different market conditions',
      path: 'Learning'
    },
    {
      title: 'Arbitrage Opportunities',
      icon: 'show-chart',
      description: 'Discover and execute arbitrage opportunities in real-time',
      path: 'Arbitrage'
    }
  ];

  return (
    <Container>
      <ScrollView>
        <Header>
          <HeaderTitle>Options Trading Platform</HeaderTitle>
          <SearchBar>
            <Icon name="search" size={24} color={theme.colors.textSecondary} />
            <SearchInput
              placeholder="Search symbols, strategies..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </SearchBar>
        </Header>

        <QuickActions>
          <ActionButton onPress={() => navigation.navigate('Trade')}>
            <ActionButtonText>New Trade</ActionButtonText>
          </ActionButton>
          <ActionButton onPress={() => navigation.navigate('Analysis')}>
            <ActionButtonText>Market Analysis</ActionButtonText>
          </ActionButton>
          <ActionButton onPress={() => navigation.navigate('Journal')}>
            <ActionButtonText>Journal</ActionButtonText>
          </ActionButton>
        </QuickActions>

        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              onPress={() => navigation.navigate(feature.path)}
            >
              <CardHeader>
                <Icon name={feature.icon} size={24} color={theme.colors.primary} />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardDescription>{feature.description}</CardDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>

        <SectionTitle>Market Overview</SectionTitle>
        {marketData.map((data, index) => (
          <MarketCard key={index}>
            <MarketSymbol>{data.symbol}</MarketSymbol>
            <MarketPrice>${data.price.toFixed(2)}</MarketPrice>
            <MarketChange isPositive={data.change >= 0}>
              {data.change >= 0 ? '+' : ''}{data.change}%
            </MarketChange>
          </MarketCard>
        ))}

        <SectionTitle>Arbitrage Opportunities</SectionTitle>
        {arbitrageOpportunities.map((opportunity, index) => (
          <MarketCard key={index}>
            <MarketSymbol>{opportunity.type}</MarketSymbol>
            <MarketPrice>Profit: ${opportunity.profit.toFixed(2)}</MarketPrice>
            <CardDescription>
              Risk: {opportunity.risk} | Expires: {opportunity.expiration}
            </CardDescription>
          </MarketCard>
        ))}

        <SectionTitle>Market Sentiment</SectionTitle>
        {sentimentData.map((data, index) => (
          <MarketCard key={index}>
            <MarketSymbol>{data.symbol}</MarketSymbol>
            <MarketPrice>
              Sentiment: {(data.sentiment * 100).toFixed(0)}%
            </MarketPrice>
            <CardDescription>Trend: {data.trend}</CardDescription>
          </MarketCard>
        ))}
      </ScrollView>
    </Container>
  );
};

export default HomeScreen; 