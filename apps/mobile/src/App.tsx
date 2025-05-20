import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import DashboardScreen from './screens/DashboardScreen';
import RiskProfileScreen from './screens/RiskProfileScreen';
import StrategiesScreen from './screens/StrategiesScreen';
import MarketAnalysisScreen from './screens/MarketAnalysisScreen';
import SettingsScreen from './screens/SettingsScreen';

// Theme
const theme = {
  colors: {
    primary: '#2962ff',
    secondary: '#0039cb',
    background: '#1a1a1a',
    surface: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#888888',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  }
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Dashboard':
            iconName = 'dashboard';
            break;
          case 'Risk Profile':
            iconName = 'assessment';
            break;
          case 'Strategies':
            iconName = 'trending-up';
            break;
          case 'Market Analysis':
            iconName = 'analytics';
            break;
          case 'Settings':
            iconName = 'settings';
            break;
          default:
            iconName = 'help';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textSecondary,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.background
      },
      headerStyle: {
        backgroundColor: theme.colors.surface
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Risk Profile" component={RiskProfileScreen} />
    <Tab.Screen name="Strategies" component={StrategiesScreen} />
    <Tab.Screen name="Market Analysis" component={MarketAnalysisScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App; 