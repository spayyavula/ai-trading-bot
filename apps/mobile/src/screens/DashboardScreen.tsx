import React from 'react';
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

const Subtitle = styled.Text`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 16px;
  margin-top: ${props => props.theme.spacing.xs}px;
`;

const Card = styled(View)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const CardTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.sm}px;
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
    if (props.value > 0) return props.theme.colors.success;
    if (props.value < 0) return props.theme.colors.error;
    return props.theme.colors.text;
  }};
  font-size: 16px;
  font-weight: bold;
`;

const QuickActions = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  margin: -${props => props.theme.spacing.sm}px;
`;

const ActionButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.md}px;
  margin: ${props => props.theme.spacing.sm}px;
  width: calc(50% - ${props => props.theme.spacing.md}px);
  align-items: center;
`;

const ActionIcon = styled(Icon)`
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const ActionText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  text-align: center;
`;

const DashboardScreen = () => {
  const theme = useTheme();

  // Mock data - replace with actual data from your API
  const portfolioData = {
    totalValue: 100000,
    dailyChange: 2500,
    dailyChangePercent: 2.5,
    openPositions: 5,
    totalPnL: 15000,
    winRate: 0.65
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // Implement navigation or action handling
  };

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Welcome back, Trader</Subtitle>
      </Header>

      <Card>
        <CardTitle>Portfolio Overview</CardTitle>
        <MetricRow>
          <MetricLabel>Total Value</MetricLabel>
          <MetricValue value={0}>
            ${portfolioData.totalValue.toLocaleString()}
          </MetricValue>
        </MetricRow>
        <MetricRow>
          <MetricLabel>Daily Change</MetricLabel>
          <MetricValue value={portfolioData.dailyChange}>
            {portfolioData.dailyChange > 0 ? '+' : ''}
            ${portfolioData.dailyChange.toLocaleString()} ({portfolioData.dailyChangePercent}%)
          </MetricValue>
        </MetricRow>
        <MetricRow>
          <MetricLabel>Open Positions</MetricLabel>
          <MetricValue value={0}>
            {portfolioData.openPositions}
          </MetricValue>
        </MetricRow>
        <MetricRow>
          <MetricLabel>Total P&L</MetricLabel>
          <MetricValue value={portfolioData.totalPnL}>
            ${portfolioData.totalPnL.toLocaleString()}
          </MetricValue>
        </MetricRow>
        <MetricRow>
          <MetricLabel>Win Rate</MetricLabel>
          <MetricValue value={portfolioData.winRate}>
            {(portfolioData.winRate * 100).toFixed(1)}%
          </MetricValue>
        </MetricRow>
      </Card>

      <Card>
        <CardTitle>Quick Actions</CardTitle>
        <QuickActions>
          <ActionButton onPress={() => handleQuickAction('new-trade')}>
            <ActionIcon name="add-circle" size={24} color={theme.colors.primary} />
            <ActionText>New Trade</ActionText>
          </ActionButton>
          <ActionButton onPress={() => handleQuickAction('market-analysis')}>
            <ActionIcon name="analytics" size={24} color={theme.colors.primary} />
            <ActionText>Market Analysis</ActionText>
          </ActionButton>
          <ActionButton onPress={() => handleQuickAction('risk-profile')}>
            <ActionIcon name="security" size={24} color={theme.colors.primary} />
            <ActionText>Risk Profile</ActionText>
          </ActionButton>
          <ActionButton onPress={() => handleQuickAction('settings')}>
            <ActionIcon name="settings" size={24} color={theme.colors.primary} />
            <ActionText>Settings</ActionText>
          </ActionButton>
        </QuickActions>
      </Card>
    </Container>
  );
};

export default DashboardScreen; 