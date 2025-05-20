import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  colors: {
    primary: '#2196F3',
    secondary: '#FF4081',
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
  typography: {
    h1: {
      fontSize: '32px',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '20px',
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 'normal',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 'normal',
    },
    caption: {
      fontSize: '12px',
      fontWeight: 'normal',
    },
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.1)',
    lg: '0 8px 16px rgba(0,0,0,0.1)',
  },
  transitions: {
    default: '0.2s ease-in-out',
    fast: '0.1s ease-in-out',
    slow: '0.3s ease-in-out',
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    primary: '#90CAF9',
    secondary: '#FF80AB',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#2C2C2C',
    success: '#81C784',
    error: '#E57373',
    warning: '#FFD54F',
    info: '#64B5F6',
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  typography: lightTheme.typography,
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.2)',
    md: '0 4px 8px rgba(0,0,0,0.2)',
    lg: '0 8px 16px rgba(0,0,0,0.2)',
  },
  transitions: lightTheme.transitions,
  breakpoints: lightTheme.breakpoints,
};

// Common styles for both platforms
export const commonStyles = {
  container: {
    padding: '24px',
    maxWidth: '1440px',
    margin: '0 auto',
  },
  card: {
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: 'var(--card-bg)',
    boxShadow: 'var(--shadow-sm)',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--transition-default)',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-color)',
  },
};

// Platform-specific styles
export const platformStyles = {
  web: {
    scrollbar: {
      width: '8px',
      track: {
        backgroundColor: 'var(--scrollbar-track)',
      },
      thumb: {
        backgroundColor: 'var(--scrollbar-thumb)',
        borderRadius: '4px',
      },
    },
  },
  mobile: {
    safeArea: {
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
    },
  },
};

// Animation presets
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideIn: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
};

// Responsive helpers
export const responsive = {
  isMobile: (width: number) => width < 600,
  isTablet: (width: number) => width >= 600 && width < 960,
  isDesktop: (width: number) => width >= 960,
};

// Export theme type
export type Theme = typeof lightTheme; 