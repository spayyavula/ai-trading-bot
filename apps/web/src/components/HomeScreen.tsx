import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  Dashboard, 
  TrendingUp, 
  Assessment, 
  Book, 
  School,
  ShowChart,
  Notifications,
  Search
} from '@mui/icons-material';
import { 
  Card, 
  Grid, 
  Typography, 
  Button, 
  TextField,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Styled Components
const HomeContainer = styled.div`
  padding: 24px;
  max-width: 1440px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.theme.palette.background.paper};
  border-radius: 8px;
  padding: 8px 16px;
  width: 400px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FeatureGrid = styled(Grid)`
  margin-top: 24px;
`;

const FeatureCard = styled(Card)`
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const CardContent = styled.div`
  flex-grow: 1;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
`;

const ActionButton = styled(Button)`
  flex: 1;
  padding: 16px;
  text-transform: none;
`;

const NotificationBadge = styled(Badge)`
  .MuiBadge-badge {
    background-color: ${props => props.theme.palette.error.main};
  }
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [notifications, setNotifications] = useState(3);

  // Fetch data
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
      icon: <Dashboard fontSize="large" />,
      description: 'View your portfolio performance, positions, and market overview',
      path: '/dashboard'
    },
    {
      title: 'Trading Strategies',
      icon: <TrendingUp fontSize="large" />,
      description: 'Access pre-built options strategies and create custom ones',
      path: '/strategies'
    },
    {
      title: 'Market Analysis',
      icon: <Assessment fontSize="large" />,
      description: 'Analyze market regimes, technical indicators, and sentiment',
      path: '/analysis'
    },
    {
      title: 'Trading Journal',
      icon: <Book fontSize="large" />,
      description: 'Document your trades, track performance, and learn from experience',
      path: '/journal'
    },
    {
      title: 'Learning Scenarios',
      icon: <School fontSize="large" />,
      description: 'Practice trading strategies in different market conditions',
      path: '/learning'
    },
    {
      title: 'Arbitrage Opportunities',
      icon: <ShowChart fontSize="large" />,
      description: 'Discover and execute arbitrage opportunities in real-time',
      path: '/arbitrage'
    }
  ];

  return (
    <HomeContainer>
      <Header>
        <Typography variant="h4" component="h1">
          Options Trading Platform
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <SearchBar>
            <Search style={{ marginRight: '8px', color: 'gray' }} />
            <TextField
              placeholder="Search symbols, strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true }}
            />
          </SearchBar>
          <NotificationBadge badgeContent={notifications} color="error">
            <IconButton>
              <Notifications />
            </IconButton>
          </NotificationBadge>
        </div>
      </Header>

      <QuickActions>
        <ActionButton
          variant="contained"
          color="primary"
          onClick={() => navigate('/trade')}
        >
          New Trade
        </ActionButton>
        <ActionButton
          variant="outlined"
          color="primary"
          onClick={() => navigate('/analysis')}
        >
          Market Analysis
        </ActionButton>
        <ActionButton
          variant="outlined"
          color="primary"
          onClick={() => navigate('/journal')}
        >
          Trading Journal
        </ActionButton>
      </QuickActions>

      <FeatureGrid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FeatureCard onClick={() => navigate(feature.path)}>
              <CardHeader>
                {feature.icon}
                <Typography variant="h6" style={{ marginLeft: '16px' }}>
                  {feature.title}
                </Typography>
              </CardHeader>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        ))}
      </FeatureGrid>

      {/* Market Overview Section */}
      <Typography variant="h5" style={{ marginTop: '32px', marginBottom: '16px' }}>
        Market Overview
      </Typography>
      <Grid container spacing={3}>
        {marketData.map((data, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <div style={{ padding: '16px' }}>
                <Typography variant="h6">{data.symbol}</Typography>
                <Typography variant="h5">${data.price.toFixed(2)}</Typography>
                <Typography
                  variant="body2"
                  color={data.change >= 0 ? 'success.main' : 'error.main'}
                >
                  {data.change >= 0 ? '+' : ''}{data.change}%
                </Typography>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Arbitrage Opportunities Section */}
      <Typography variant="h5" style={{ marginTop: '32px', marginBottom: '16px' }}>
        Arbitrage Opportunities
      </Typography>
      <Grid container spacing={3}>
        {arbitrageOpportunities.map((opportunity, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card>
              <div style={{ padding: '16px' }}>
                <Typography variant="h6">{opportunity.type}</Typography>
                <Typography variant="body1">
                  Profit: ${opportunity.profit.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Risk: {opportunity.risk} | Expires: {opportunity.expiration}
                </Typography>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Market Sentiment Section */}
      <Typography variant="h5" style={{ marginTop: '32px', marginBottom: '16px' }}>
        Market Sentiment
      </Typography>
      <Grid container spacing={3}>
        {sentimentData.map((data, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <div style={{ padding: '16px' }}>
                <Typography variant="h6">{data.symbol}</Typography>
                <Typography variant="body1">
                  Sentiment: {(data.sentiment * 100).toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Trend: {data.trend}
                </Typography>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </HomeContainer>
  );
};

export default HomeScreen; 