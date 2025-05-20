import { Router, Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = Router();

interface OAuthTokenResponse {
  access_token: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

const getGoogleProfile = async (accessToken: string): Promise<UserProfile> => {
  const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    id: response.data.id,
    email: response.data.email,
    name: response.data.name,
    picture: response.data.picture,
  };
};

const getGithubProfile = async (accessToken: string): Promise<UserProfile> => {
  const response = await axios.get('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    id: response.data.id.toString(),
    email: response.data.email,
    name: response.data.name,
    picture: response.data.avatar_url,
  };
};

const getMicrosoftProfile = async (accessToken: string): Promise<UserProfile> => {
  const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    id: response.data.id,
    email: response.data.userPrincipalName,
    name: response.data.displayName,
    picture: response.data.photo,
  };
};

const getFacebookProfile = async (accessToken: string): Promise<UserProfile> => {
  const response = await axios.get('https://graph.facebook.com/me', {
    params: {
      fields: 'id,email,name,picture',
      access_token: accessToken,
    },
  });
  return {
    id: response.data.id,
    email: response.data.email,
    name: response.data.name,
    picture: response.data.picture?.data?.url,
  };
};

router.post('/callback', async (req: Request, res: Response) => {
  try {
    const { provider, code } = req.body;
    let tokenResponse: OAuthTokenResponse;
    let userProfile: UserProfile;

    // Exchange code for access token
    switch (provider) {
      case 'google':
        tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code,
          redirect_uri: `${process.env.API_URL}/auth/google/callback`,
          grant_type: 'authorization_code',
        });
        userProfile = await getGoogleProfile(tokenResponse.access_token);
        break;

      case 'github':
        tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${process.env.API_URL}/auth/github/callback`,
        }, {
          headers: { Accept: 'application/json' },
        });
        userProfile = await getGithubProfile(tokenResponse.access_token);
        break;

      case 'microsoft':
        tokenResponse = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
          client_id: process.env.MICROSOFT_CLIENT_ID,
          client_secret: process.env.MICROSOFT_CLIENT_SECRET,
          code,
          redirect_uri: `${process.env.API_URL}/auth/microsoft/callback`,
          grant_type: 'authorization_code',
        });
        userProfile = await getMicrosoftProfile(tokenResponse.access_token);
        break;

      case 'facebook':
        tokenResponse = await axios.post('https://graph.facebook.com/v12.0/oauth/access_token', {
          client_id: process.env.FACEBOOK_CLIENT_ID,
          client_secret: process.env.FACEBOOK_CLIENT_SECRET,
          code,
          redirect_uri: `${process.env.API_URL}/auth/facebook/callback`,
        });
        userProfile = await getFacebookProfile(tokenResponse.access_token);
        break;

      default:
        return res.status(400).json({ error: 'Unsupported provider' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        picture: userProfile.picture,
        provider,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ token, user: userProfile });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  // In a real application, you might want to invalidate the token
  res.json({ message: 'Logged out successfully' });
});

export default router; 