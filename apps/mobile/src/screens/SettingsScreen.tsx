import React, { useState } from 'react';
import { View, ScrollView, Switch, TouchableOpacity } from 'react-native';
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

const Section = styled(View)`
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const SectionTitle = styled.Text`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.sm}px;
  text-transform: uppercase;
`;

const SettingItem = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.md}px;
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const SettingLabel = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
`;

const SettingValue = styled.Text`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

const Button = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.md}px;
  border-radius: 8px;
  align-items: center;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  font-weight: bold;
`;

const SettingsScreen = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    soundEffects: false,
    autoRefresh: true,
    showPnL: true,
    showPositions: true,
    showCharts: true
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Implement logout logic
  };

  return (
    <Container>
      <Header>
        <Title>Settings</Title>
      </Header>

      <Section>
        <SectionTitle>Appearance</SectionTitle>
        <SettingItem>
          <SettingLabel>Dark Mode</SettingLabel>
          <Switch
            value={settings.darkMode}
            onValueChange={() => handleToggle('darkMode')}
            trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
            thumbColor={theme.colors.text}
          />
        </SettingItem>
      </Section>

      <Section>
        <SectionTitle>Notifications</SectionTitle>
        <SettingItem>
          <SettingLabel>Push Notifications</SettingLabel>
          <Switch
            value={settings.notifications}
            onValueChange={() => handleToggle('notifications')}
            trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
            thumbColor={theme.colors.text}
          />
        </SettingItem>
        <SettingItem>
          <SettingLabel>Sound Effects</SettingLabel>
          <Switch
            value={settings.soundEffects}
            onValueChange={() => handleToggle('soundEffects')}
            trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
            thumbColor={theme.colors.text}
          />
        </SettingItem>
      </Section>

      <Section>
        <SectionTitle>Data & Refresh</SectionTitle>
        <SettingItem>
          <SettingLabel>Auto Refresh</SettingLabel>
          <Switch
            value={settings.autoRefresh}
            onValueChange={() => handleToggle('autoRefresh')}
            trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
            thumbColor={theme.colors.text}
          />
        </SettingItem>
      </Section>

      <Section>
        <SectionTitle>Display Options</SectionTitle>
        <SettingItem>
          <SettingLabel>Show P&L</SettingLabel>
          <Switch
            value={settings.showPnL}
            onValueChange={() => handleToggle('showPnL')}
            trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
            thumbColor={theme.colors.text}
          />
        </SettingItem>
        <SettingItem>
          <SettingLabel>Show Positions</SettingLabel>
          <Switch
            value={settings.showPositions}
            onValueChange={() => handleToggle('showPositions')}
            trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
            thumbColor={theme.colors.text}
          />
        </SettingItem>
        <SettingItem>
          <SettingLabel>Show Charts</SettingLabel>
          <Switch
            value={settings.showCharts}
            onValueChange={() => handleToggle('showCharts')}
            trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
            thumbColor={theme.colors.text}
          />
        </SettingItem>
      </Section>

      <Button onPress={handleLogout}>
        <ButtonText>Log Out</ButtonText>
      </Button>
    </Container>
  );
};

export default SettingsScreen; 