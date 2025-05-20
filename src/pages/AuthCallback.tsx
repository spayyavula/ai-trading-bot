import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
`;

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleCallback, error } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const provider = location.pathname.split('/')[2] as 'google' | 'github' | 'microsoft' | 'facebook';

      if (!code) {
        navigate('/');
        return;
      }

      try {
        await handleCallback(provider, code);
        navigate('/dashboard');
      } catch (error) {
        console.error('Auth callback error:', error);
        // Error will be displayed by the component
      }
    };

    handleAuthCallback();
  }, [location, handleCallback, navigate]);

  return (
    <Container>
      <Spinner />
      <h2>Completing authentication...</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}; 