import "./global.css";
import "./src/i18n";
import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { ProgressProvider } from './src/contexts/ProgressContext';
import Routes from './src/navigation/Routes';

function AppContent() {
  const { isDarkTheme } = useTheme();

  return (
    <View className={`flex-1 ${isDarkTheme ? 'dark' : ''}`}>
      <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
      <Routes />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}