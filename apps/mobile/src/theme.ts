import { DefaultTheme } from 'styled-components/native';

export const lightTheme: DefaultTheme = {
  colors: {
    primary: '#2962FF',
    secondary: '#00BFA5',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    success: '#00C853',
    error: '#FF3D00',
    warning: '#FFD600',
    border: '#E0E0E0'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  }
};

export const darkTheme: DefaultTheme = {
  colors: {
    primary: '#2962FF',
    secondary: '#00BFA5',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    success: '#00E676',
    error: '#FF5252',
    warning: '#FFEA00',
    border: '#424242'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  }
};

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      success: string;
      error: string;
      warning: string;
      border: string;
    };
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  }
} 