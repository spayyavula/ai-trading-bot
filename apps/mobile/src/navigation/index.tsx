import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import RiskProfileScreen from '../screens/RiskProfileScreen';
import StrategiesScreen from '../screens/StrategiesScreen';
import MarketAnalysisScreen from '../screens/MarketAnalysisScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TradingJournalScreen from '../screens/TradingJournalScreen';
import LearningScenariosScreen from '../screens/LearningScenariosScreen';

// Types
export type RootStackParamList = {
  Main: undefined;
  StrategyDetails: { id: number };
  NewTrade: undefined;
  PositionDetails: { id: number };
  JournalEntry: { id: string };
  NewJournalEntry: undefined;
  ScenarioDetails: { id: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  RiskProfile: undefined;
  Strategies: undefined;
  MarketAnalysis: undefined;
  Journal: undefined;
  Learning: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: theme.spacing.xs,
          paddingTop: theme.spacing.xs,
          height: 60
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0
        },
        headerTitleStyle: {
          color: theme.colors.text,
          fontSize: 20,
          fontWeight: 'bold'
        }
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="dashboard" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="RiskProfile"
        component={RiskProfileScreen}
        options={{
          title: 'Risk Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="security" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Strategies"
        component={StrategiesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="trending-up" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="MarketAnalysis"
        component={MarketAnalysisScreen}
        options={{
          title: 'Market Analysis',
          tabBarIcon: ({ color, size }) => (
            <Icon name="analytics" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Journal"
        component={TradingJournalScreen}
        options={{
          title: 'Trading Journal',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Learning"
        component={LearningScenariosScreen}
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <Icon name="school" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      {/* Add other stack screens here */}
    </Stack.Navigator>
  );
}; 