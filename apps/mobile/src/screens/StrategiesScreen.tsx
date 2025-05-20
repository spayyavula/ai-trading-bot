import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.md}px;
`;

const Header = styled(View)`
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  font-weight: bold;
`;

const FilterContainer = styled(View)`
  flex-direction: row;
  margin-top: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const FilterButton = styled(TouchableOpacity)<{ active: boolean }>`
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surface};
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.md}px;
  border-radius: 20px;
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const FilterText = styled.Text<{ active: boolean }>`
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textSecondary};
  font-size: 14px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const StrategyCard = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const StrategyHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const StrategyName = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 18px;
  font-weight: bold;
`;

const StrategyType = styled.Text`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

const MetricRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const MetricLabel = styled.Text`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

const MetricValue = styled.Text<{ value: number }>`
  color: ${props => {
    if (props.value > 0) return props.theme.colors.success;
    if (props.value < 0) return props.theme.colors.error;
    return props.theme.colors.text;
  }};
  font-size: 14px;
  font-weight: bold;
`;

const TagContainer = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${props => props.theme.spacing.sm}px;
`;

const Tag = styled(View)`
  background-color: ${props => props.theme.colors.primary}20;
  padding: ${props => props.theme.spacing.xs}px ${props => props.theme.spacing.sm}px;
  border-radius: 4px;
  margin-right: ${props => props.theme.spacing.xs}px;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const TagText = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-size: 12px;
`;

const StrategiesScreen = () => {
  const theme = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock data - replace with actual data from your API
  const strategies = [
    {
      id: 1,
      name: 'Iron Condor',
      type: 'Income',
      winRate: 0.75,
      avgReturn: 0.15,
      maxDrawdown: -0.08,
      tags: ['High Probability', 'Defined Risk', 'Income']
    },
    {
      id: 2,
      name: 'Bull Call Spread',
      type: 'Directional',
      winRate: 0.65,
      avgReturn: 0.25,
      maxDrawdown: -0.12,
      tags: ['Bullish', 'Defined Risk', 'Leverage']
    },
    {
      id: 3,
      name: 'Put Calendar',
      type: 'Volatility',
      winRate: 0.70,
      avgReturn: 0.20,
      maxDrawdown: -0.10,
      tags: ['Volatility', 'Time Decay', 'Theta']
    }
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'income', label: 'Income' },
    { id: 'directional', label: 'Directional' },
    { id: 'volatility', label: 'Volatility' }
  ];

  const handleStrategyPress = (strategyId: number) => {
    console.log(`Strategy selected: ${strategyId}`);
    // Implement navigation to strategy details
  };

  return (
    <Container>
      <Header>
        <Title>Trading Strategies</Title>
      </Header>

      <FilterContainer>
        {filters.map(filter => (
          <FilterButton
            key={filter.id}
            active={activeFilter === filter.id}
            onPress={() => setActiveFilter(filter.id)}
          >
            <FilterText active={activeFilter === filter.id}>
              {filter.label}
            </FilterText>
          </FilterButton>
        ))}
      </FilterContainer>

      {strategies.map(strategy => (
        <StrategyCard
          key={strategy.id}
          onPress={() => handleStrategyPress(strategy.id)}
        >
          <StrategyHeader>
            <View>
              <StrategyName>{strategy.name}</StrategyName>
              <StrategyType>{strategy.type}</StrategyType>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </StrategyHeader>

          <MetricRow>
            <MetricLabel>Win Rate</MetricLabel>
            <MetricValue value={strategy.winRate}>
              {(strategy.winRate * 100).toFixed(1)}%
            </MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>Avg Return</MetricLabel>
            <MetricValue value={strategy.avgReturn}>
              {(strategy.avgReturn * 100).toFixed(1)}%
            </MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>Max Drawdown</MetricLabel>
            <MetricValue value={strategy.maxDrawdown}>
              {(strategy.maxDrawdown * 100).toFixed(1)}%
            </MetricValue>
          </MetricRow>

          <TagContainer>
            {strategy.tags.map(tag => (
              <Tag key={tag}>
                <TagText>{tag}</TagText>
              </Tag>
            ))}
          </TagContainer>
        </StrategyCard>
      ))}
    </Container>
  );
};

export default StrategiesScreen; 