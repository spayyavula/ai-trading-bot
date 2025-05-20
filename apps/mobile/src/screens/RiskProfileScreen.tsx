import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RiskProfile } from '@option-trading-platform/risk-management';

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ScrollContainer = styled(ScrollView)`
  flex: 1;
  padding: ${props => props.theme.spacing.md}px;
`;

const QuestionContainer = styled(View)`
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const QuestionText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const OptionContainer = styled(TouchableOpacity)<{ selected: boolean }>`
  background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.surface};
  padding: ${props => props.theme.spacing.md}px;
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
`;

const OptionText = styled.Text<{ selected: boolean }>`
  color: ${props => props.selected ? props.theme.colors.text : props.theme.colors.textSecondary};
  font-size: 16px;
  flex: 1;
`;

const DescriptionText = styled.Text<{ selected: boolean }>`
  color: ${props => props.selected ? props.theme.colors.text : props.theme.colors.textSecondary};
  font-size: 14px;
  margin-top: ${props => props.theme.spacing.xs}px;
`;

const SubmitButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md}px;
  border-radius: 8px;
  align-items: center;
  margin-top: ${props => props.theme.spacing.lg}px;
`;

const SubmitButtonText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 18px;
  font-weight: bold;
`;

const RiskProfileScreen = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState<Partial<RiskProfile>>({
    riskTolerance: undefined,
    maxDrawdown: undefined,
    preferredMarketBias: undefined
  });

  const handleOptionSelect = (key: keyof RiskProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // Submit profile to risk management system
    console.log('Submitted profile:', profile);
  };

  const renderOption = (
    key: keyof RiskProfile,
    value: any,
    label: string,
    description: string
  ) => (
    <OptionContainer
      selected={profile[key] === value}
      onPress={() => handleOptionSelect(key, value)}
    >
      <OptionText selected={profile[key] === value}>{label}</OptionText>
      <Icon
        name={profile[key] === value ? 'check-circle' : 'radio-button-unchecked'}
        size={24}
        color={profile[key] === value ? theme.colors.text : theme.colors.textSecondary}
      />
    </OptionContainer>
  );

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollContainer>
        <QuestionContainer>
          <QuestionText>What is your risk tolerance?</QuestionText>
          {renderOption(
            'riskTolerance',
            'conservative',
            'Conservative',
            'Prefer stable returns with minimal risk'
          )}
          {renderOption(
            'riskTolerance',
            'moderate',
            'Moderate',
            'Balance between risk and return'
          )}
          {renderOption(
            'riskTolerance',
            'aggressive',
            'Aggressive',
            'Seek higher returns with higher risk'
          )}
        </QuestionContainer>

        <QuestionContainer>
          <QuestionText>What is your maximum acceptable drawdown?</QuestionText>
          {renderOption('maxDrawdown', 0.1, '10%', 'Conservative drawdown limit')}
          {renderOption('maxDrawdown', 0.15, '15%', 'Moderate drawdown limit')}
          {renderOption('maxDrawdown', 0.2, '20%', 'Aggressive drawdown limit')}
        </QuestionContainer>

        <QuestionContainer>
          <QuestionText>What is your preferred market bias?</QuestionText>
          {renderOption(
            'preferredMarketBias',
            'bullish',
            'Bullish',
            'Expect market to rise'
          )}
          {renderOption(
            'preferredMarketBias',
            'bearish',
            'Bearish',
            'Expect market to fall'
          )}
          {renderOption(
            'preferredMarketBias',
            'neutral',
            'Neutral',
            'No strong market bias'
          )}
        </QuestionContainer>

        <SubmitButton onPress={handleSubmit}>
          <SubmitButtonText>Submit Risk Profile</SubmitButtonText>
        </SubmitButton>
      </ScrollContainer>
    </Container>
  );
};

export default RiskProfileScreen; 