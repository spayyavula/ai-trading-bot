import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { learningApi } from '../services/api';

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

const ProgressContainer = styled(View)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const ProgressTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const ProgressBar = styled(View)`
  height: 8px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const ProgressFill = styled(View)<{ progress: number }>`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: ${props => props.theme.colors.primary};
`;

const ProgressText = styled.Text`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

const ScenarioCard = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const ScenarioHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const ScenarioTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 18px;
  font-weight: bold;
`;

const ScenarioDifficulty = styled(View)<{ level: string }>`
  background-color: ${props => {
    switch (props.level) {
      case 'beginner':
        return props.theme.colors.success;
      case 'intermediate':
        return props.theme.colors.warning;
      case 'advanced':
        return props.theme.colors.error;
      default:
        return props.theme.colors.textSecondary;
    }
  }};
  padding: ${props => props.theme.spacing.xs}px ${props => props.theme.spacing.sm}px;
  border-radius: 4px;
`;

const DifficultyText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
`;

const ScenarioDescription = styled.Text`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const ScenarioTags = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
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

interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  marketRegime: string;
  tags: string[];
  completed: boolean;
}

interface Progress {
  totalScenarios: number;
  completedScenarios: number;
  currentLevel: string;
}

const LearningScenariosScreen = () => {
  const theme = useTheme();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scenariosResponse, progressResponse] = await Promise.all([
        learningApi.getScenarios(),
        learningApi.getProgress(),
      ]);
      setScenarios(scenariosResponse.data);
      setProgress(progressResponse.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch learning scenarios');
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioPress = (scenario: Scenario) => {
    // Navigate to scenario details screen
    // This will be implemented in the next step
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Learning Scenarios</Title>
      </Header>

      {progress && (
        <ProgressContainer>
          <ProgressTitle>Your Progress</ProgressTitle>
          <ProgressBar>
            <ProgressFill
              progress={(progress.completedScenarios / progress.totalScenarios) * 100}
            />
          </ProgressBar>
          <ProgressText>
            {progress.completedScenarios} of {progress.totalScenarios} scenarios completed
          </ProgressText>
          <ProgressText>Current Level: {progress.currentLevel}</ProgressText>
        </ProgressContainer>
      )}

      {scenarios.map(scenario => (
        <ScenarioCard
          key={scenario.id}
          onPress={() => handleScenarioPress(scenario)}
        >
          <ScenarioHeader>
            <ScenarioTitle>{scenario.title}</ScenarioTitle>
            <ScenarioDifficulty level={scenario.difficulty}>
              <DifficultyText>{scenario.difficulty}</DifficultyText>
            </ScenarioDifficulty>
          </ScenarioHeader>
          <ScenarioDescription>{scenario.description}</ScenarioDescription>
          <ScenarioTags>
            <Tag>
              <TagText>{scenario.marketRegime}</TagText>
            </Tag>
            {scenario.tags.map(tag => (
              <Tag key={tag}>
                <TagText>{tag}</TagText>
              </Tag>
            ))}
          </ScenarioTags>
        </ScenarioCard>
      ))}
    </Container>
  );
};

export default LearningScenariosScreen; 