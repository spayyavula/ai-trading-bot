import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

const WelcomeMessage = styled.h1`
  margin-bottom: 2rem;
  color: #2c3e50;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Header>
        <UserInfo>
          {user.picture && <Avatar src={user.picture} alt={user.name} />}
          <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </UserInfo>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <WelcomeMessage>Welcome to your Dashboard</WelcomeMessage>

      <DashboardGrid>
        <Card>
          <CardTitle>Portfolio Overview</CardTitle>
          <p>Your portfolio performance and holdings will be displayed here.</p>
        </Card>

        <Card>
          <CardTitle>Recent Trades</CardTitle>
          <p>Your recent trading activity will be shown here.</p>
        </Card>

        <Card>
          <CardTitle>Market Analysis</CardTitle>
          <p>Current market trends and analysis will be displayed here.</p>
        </Card>

        <Card>
          <CardTitle>Risk Management</CardTitle>
          <p>Your risk metrics and management tools will be available here.</p>
        </Card>
      </DashboardGrid>
    </Container>
  );
}; 