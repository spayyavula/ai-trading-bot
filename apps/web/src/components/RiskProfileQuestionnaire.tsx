import React, { useState } from 'react';
import styled from 'styled-components';
import { RiskProfile } from '@option-trading-platform/risk-management';

const QuestionnaireContainer = styled.div`
  background-color: #2a2e39;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  margin: 2rem auto;
`;

const Question = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  background-color: #1e222d;
  border: 1px solid #363a45;
  border-radius: 4px;
  color: #d1d4dc;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border-color: #2962ff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  background-color: #1e222d;
  border: 1px solid #363a45;
  border-radius: 4px;
  color: #d1d4dc;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border-color: #2962ff;
  }
`;

const Button = styled.button`
  background-color: #2962ff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;

  &:hover {
    background-color: #1e4bd8;
  }
`;

const MarketBiasContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MarketBiasOption = styled.div<{ selected: boolean }>`
  padding: 1rem;
  border: 2px solid ${({ selected }) => selected ? '#2962ff' : '#363a45'};
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  background-color: ${({ selected }) => selected ? '#1e4bd8' : '#1e222d'};
  transition: all 0.2s ease;

  &:hover {
    border-color: #2962ff;
  }
`;

interface Props {
  onSubmit: (profile: RiskProfile) => void;
}

const RiskProfileQuestionnaire: React.FC<Props> = ({ onSubmit }) => {
  const [profile, setProfile] = useState<Partial<RiskProfile>>({
    riskTolerance: 'moderate',
    maxDrawdown: 0.15,
    targetReturn: 0.20,
    investmentHorizon: 12,
    accountBalance: 10000,
    maxLossPerTrade: 0.02,
    preferredMarketBias: undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProfileComplete(profile)) {
      onSubmit(profile as RiskProfile);
    }
  };

  const isProfileComplete = (profile: Partial<RiskProfile>): profile is RiskProfile => {
    return (
      profile.riskTolerance !== undefined &&
      profile.maxDrawdown !== undefined &&
      profile.targetReturn !== undefined &&
      profile.investmentHorizon !== undefined &&
      profile.accountBalance !== undefined &&
      profile.maxLossPerTrade !== undefined
    );
  };

  return (
    <QuestionnaireContainer>
      <h2>Risk Profile Questionnaire</h2>
      <form onSubmit={handleSubmit}>
        <Question>
          <Label>Risk Tolerance</Label>
          <Select
            value={profile.riskTolerance}
            onChange={(e) => setProfile({ ...profile, riskTolerance: e.target.value as RiskProfile['riskTolerance'] })}
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </Select>
        </Question>

        <Question>
          <Label>Market Bias Preference</Label>
          <MarketBiasContainer>
            <MarketBiasOption
              selected={profile.preferredMarketBias === 'bullish'}
              onClick={() => setProfile({ ...profile, preferredMarketBias: 'bullish' })}
            >
              <h3>Bullish</h3>
              <p>Expecting market to rise</p>
            </MarketBiasOption>
            <MarketBiasOption
              selected={profile.preferredMarketBias === 'bearish'}
              onClick={() => setProfile({ ...profile, preferredMarketBias: 'bearish' })}
            >
              <h3>Bearish</h3>
              <p>Expecting market to fall</p>
            </MarketBiasOption>
            <MarketBiasOption
              selected={profile.preferredMarketBias === 'neutral'}
              onClick={() => setProfile({ ...profile, preferredMarketBias: 'neutral' })}
            >
              <h3>Neutral</h3>
              <p>No strong market bias</p>
            </MarketBiasOption>
          </MarketBiasContainer>
        </Question>

        <Question>
          <Label>Maximum Drawdown (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="1"
            value={profile.maxDrawdown ? profile.maxDrawdown * 100 : ''}
            onChange={(e) => setProfile({ ...profile, maxDrawdown: Number(e.target.value) / 100 })}
          />
        </Question>

        <Question>
          <Label>Target Annual Return (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="1"
            value={profile.targetReturn ? profile.targetReturn * 100 : ''}
            onChange={(e) => setProfile({ ...profile, targetReturn: Number(e.target.value) / 100 })}
          />
        </Question>

        <Question>
          <Label>Investment Horizon (months)</Label>
          <Input
            type="number"
            min="1"
            max="60"
            value={profile.investmentHorizon}
            onChange={(e) => setProfile({ ...profile, investmentHorizon: Number(e.target.value) })}
          />
        </Question>

        <Question>
          <Label>Account Balance ($)</Label>
          <Input
            type="number"
            min="1000"
            step="1000"
            value={profile.accountBalance}
            onChange={(e) => setProfile({ ...profile, accountBalance: Number(e.target.value) })}
          />
        </Question>

        <Question>
          <Label>Maximum Loss Per Trade (%)</Label>
          <Input
            type="number"
            min="0.1"
            max="5"
            step="0.1"
            value={profile.maxLossPerTrade ? profile.maxLossPerTrade * 100 : ''}
            onChange={(e) => setProfile({ ...profile, maxLossPerTrade: Number(e.target.value) / 100 })}
          />
        </Question>

        <Button type="submit">Submit</Button>
      </form>
    </QuestionnaireContainer>
  );
};

export default RiskProfileQuestionnaire; 