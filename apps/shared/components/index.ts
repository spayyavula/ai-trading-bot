import React from 'react';
import styled from 'styled-components';
import { lightTheme } from '../theme';

// Button Component
export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: white;
          &:hover {
            background-color: ${theme.colors.primary}dd;
          }
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary};
          color: white;
          &:hover {
            background-color: ${theme.colors.secondary}dd;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          border: 1px solid ${theme.colors.primary};
          color: ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary}11;
          }
        `;
    }
  }}
`;

// Card Component
export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

// Input Component
export const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// Typography Components
export const H1 = styled.h1`
  font-size: ${({ theme }) => theme.typography.h1.fontSize};
  font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const H2 = styled.h2`
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const H3 = styled.h3`
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const Body1 = styled.p`
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  font-weight: ${({ theme }) => theme.typography.body1.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const Body2 = styled.p`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  font-weight: ${({ theme }) => theme.typography.body2.fontWeight};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

// Badge Component
export const Badge = styled.span<{ variant?: 'success' | 'error' | 'warning' | 'info' }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 600;

  ${({ variant = 'info', theme }) => {
    switch (variant) {
      case 'success':
        return `
          background-color: ${theme.colors.success}22;
          color: ${theme.colors.success};
        `;
      case 'error':
        return `
          background-color: ${theme.colors.error}22;
          color: ${theme.colors.error};
        `;
      case 'warning':
        return `
          background-color: ${theme.colors.warning}22;
          color: ${theme.colors.warning};
        `;
      case 'info':
        return `
          background-color: ${theme.colors.info}22;
          color: ${theme.colors.info};
        `;
    }
  }}
`;

// Flex Container
export const Flex = styled.div<{
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: string;
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ align = 'stretch' }) => align};
  gap: ${({ gap = '0' }) => gap};
`;

// Grid Container
export const Grid = styled.div<{
  columns?: number;
  gap?: string;
}>`
  display: grid;
  grid-template-columns: repeat(${({ columns = 1 }) => columns}, 1fr);
  gap: ${({ gap = '0' }) => gap};
`;

// Loading Spinner
export const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ theme }) => theme.colors.primary}22;
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Divider
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

// Tooltip
export const Tooltip = styled.div<{ position?: 'top' | 'bottom' | 'left' | 'right' }>`
  position: relative;
  display: inline-block;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    background-color: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.background};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: ${({ theme }) => theme.typography.caption.fontSize};
    white-space: nowrap;
    z-index: 1000;

    ${({ position = 'top' }) => {
      switch (position) {
        case 'top':
          return `
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: ${({ theme }) => theme.spacing.xs};
          `;
        case 'bottom':
          return `
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: ${({ theme }) => theme.spacing.xs};
          `;
        case 'left':
          return `
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-right: ${({ theme }) => theme.spacing.xs};
          `;
        case 'right':
          return `
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-left: ${({ theme }) => theme.spacing.xs};
          `;
      }
    }}
  }
`;

// Export all components
export default {
  Button,
  Card,
  Input,
  H1,
  H2,
  H3,
  Body1,
  Body2,
  Badge,
  Flex,
  Grid,
  Spinner,
  Divider,
  Tooltip,
}; 