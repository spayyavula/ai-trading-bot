import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { journalApi } from '../services/api';

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ScrollContainer = styled(ScrollView)`
  flex: 1;
  padding: ${props => props.theme.spacing.md}px;
`;

const Header = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  font-weight: bold;
`;

const EntryCard = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.md}px;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const EntryHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const EntryDate = styled.Text`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

const EntryTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const EntryContent = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const EntryTags = styled(View)`
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

const AddButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: ${props => props.theme.spacing.lg}px;
  right: ${props => props.theme.spacing.lg}px;
  background-color: ${props => props.theme.colors.primary};
  width: 56px;
  height: 56px;
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
`;

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  tradeId?: string;
}

const TradingJournalScreen = () => {
  const theme = useTheme();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await journalApi.getEntries();
      setEntries(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch journal entries');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = () => {
    // Navigate to add entry screen
    // This will be implemented in the next step
  };

  const handleEntryPress = (entry: JournalEntry) => {
    // Navigate to entry details screen
    // This will be implemented in the next step
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollContainer>
        <Header>
          <Title>Trading Journal</Title>
        </Header>

        {entries.map(entry => (
          <EntryCard
            key={entry.id}
            onPress={() => handleEntryPress(entry)}
          >
            <EntryHeader>
              <EntryDate>{new Date(entry.date).toLocaleDateString()}</EntryDate>
              <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
            </EntryHeader>
            <EntryTitle>{entry.title}</EntryTitle>
            <EntryContent numberOfLines={3}>{entry.content}</EntryContent>
            <EntryTags>
              {entry.tags.map(tag => (
                <Tag key={tag}>
                  <TagText>{tag}</TagText>
                </Tag>
              ))}
            </EntryTags>
          </EntryCard>
        ))}
      </ScrollContainer>

      <AddButton onPress={handleAddEntry}>
        <Icon name="add" size={24} color={theme.colors.text} />
      </AddButton>
    </Container>
  );
};

export default TradingJournalScreen; 