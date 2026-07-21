import React from 'react';
import { AuthProvider } from './AuthContext';
import { ProgressProvider } from './ProgressContext';
import { ThemeProvider } from './ThemeContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ProgressProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </ProgressProvider>
    </AuthProvider>
  );
};