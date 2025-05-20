import React, { createContext, useContext, useState, useEffect } from 'react';
import { initiateOAuthLogin, handleOAuthCallback, logout } from '../services/auth';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (provider: 'google' | 'github' | 'microsoft' | 'facebook') => void;
  handleCallback: (provider: 'google' | 'github' | 'microsoft' | 'facebook', code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user info
      // This would typically involve an API call to validate the token
      // For now, we'll just parse the JWT token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.id,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          provider: payload.provider,
        });
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (provider: 'google' | 'github' | 'microsoft' | 'facebook') => {
    setError(null);
    initiateOAuthLogin(provider);
  };

  const handleCallback = async (provider: 'google' | 'github' | 'microsoft' | 'facebook', code: string) => {
    try {
      setLoading(true);
      const { token, user } = await handleOAuthCallback(provider, code);
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
    } catch (error) {
      setError('Authentication failed');
      console.error('Auth callback error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (error) {
      setError('Logout failed');
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        handleCallback,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 