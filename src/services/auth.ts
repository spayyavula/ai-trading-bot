import axios from 'axios';

interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

interface OAuthProvider {
  google: OAuthConfig;
  github: OAuthConfig;
  microsoft: OAuthConfig;
  facebook: OAuthConfig;
}

const oauthConfig: OAuthProvider = {
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/google/callback`,
    scope: 'email profile',
  },
  github: {
    clientId: process.env.REACT_APP_GITHUB_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/github/callback`,
    scope: 'user:email',
  },
  microsoft: {
    clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/microsoft/callback`,
    scope: 'user.read',
  },
  facebook: {
    clientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/facebook/callback`,
    scope: 'email,public_profile',
  },
};

export const initiateOAuthLogin = (provider: keyof OAuthProvider) => {
  const config = oauthConfig[provider];
  const authUrl = getAuthUrl(provider, config);
  window.location.href = authUrl;
};

const getAuthUrl = (provider: keyof OAuthProvider, config: OAuthConfig): string => {
  switch (provider) {
    case 'google':
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code&scope=${config.scope}`;
    case 'github':
      return `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&scope=${config.scope}`;
    case 'microsoft':
      return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code&scope=${config.scope}`;
    case 'facebook':
      return `https://www.facebook.com/v12.0/dialog/oauth?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&scope=${config.scope}`;
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
};

export const handleOAuthCallback = async (provider: keyof OAuthProvider, code: string) => {
  try {
    const response = await axios.post('/api/auth/callback', {
      provider,
      code,
    });
    return response.data;
  } catch (error) {
    console.error('OAuth callback error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.post('/api/auth/logout');
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}; 