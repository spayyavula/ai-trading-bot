import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { FaGoogle, FaGithub, FaMicrosoft, FaFacebook } from 'react-icons/fa';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #ffffff;
`;

const Hero = styled.section`
  padding: 80px 20px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #00ff87, #60efff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #b3b3b3;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 4rem 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const AuthSection = styled.section`
  padding: 4rem 20px;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
`;

const AuthButton = styled.button<{ provider: string }>`
  width: 100%;
  padding: 12px 24px;
  margin: 10px 0;
  border: none;
  border-radius: 8px;
  background: ${props => {
    switch (props.provider) {
      case 'google': return '#DB4437';
      case 'github': return '#333';
      case 'microsoft': return '#00A4EF';
      case 'facebook': return '#4267B2';
      default: return '#333';
    }
  }};
  color: white;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const LandingPage: React.FC = () => {
  const handleOAuthLogin = (provider: string) => {
    // OAuth login logic will be implemented here
    console.log(`Logging in with ${provider}`);
  };

  return (
    <Container>
      <Helmet>
        <title>AI Trading Bot - Smart Investment Made Easy</title>
        <meta name="description" content="AI-powered trading bot that makes investing as easy as ordering food delivery. Get started with smart investment strategies today." />
        <meta name="keywords" content="AI trading, investment bot, automated trading, stock market, cryptocurrency, trading bot" />
        <meta property="og:title" content="AI Trading Bot - Smart Investment Made Easy" />
        <meta property="og:description" content="AI-powered trading bot that makes investing as easy as ordering food delivery." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Trading Bot - Smart Investment Made Easy" />
        <meta name="twitter:description" content="AI-powered trading bot that makes investing as easy as ordering food delivery." />
      </Helmet>

      <Hero>
        <Title>AI Trading Bot</Title>
        <Subtitle>
          Make smarter investment decisions with our AI-powered trading bot.
          No finance degree required - just smart technology at your fingertips.
        </Subtitle>
      </Hero>

      <Features>
        <FeatureCard>
          <h3>🤖 AI-Powered Analysis</h3>
          <p>Advanced machine learning algorithms analyze market trends and make predictions.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>📊 Real-time Monitoring</h3>
          <p>Track your investments and get instant alerts on market movements.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>🛡️ Risk Management</h3>
          <p>Smart risk assessment and portfolio optimization to protect your investments.</p>
        </FeatureCard>
      </Features>

      <AuthSection>
        <h2>Get Started Today</h2>
        <p>Choose your preferred login method:</p>
        <AuthButton provider="google" onClick={() => handleOAuthLogin('google')}>
          <FaGoogle /> Continue with Google
        </AuthButton>
        <AuthButton provider="github" onClick={() => handleOAuthLogin('github')}>
          <FaGithub /> Continue with GitHub
        </AuthButton>
        <AuthButton provider="microsoft" onClick={() => handleOAuthLogin('microsoft')}>
          <FaMicrosoft /> Continue with Microsoft
        </AuthButton>
        <AuthButton provider="facebook" onClick={() => handleOAuthLogin('facebook')}>
          <FaFacebook /> Continue with Facebook
        </AuthButton>
      </AuthSection>
    </Container>
  );
};

export default LandingPage; 