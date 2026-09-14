import "./global.css";
import "./src/i18n";
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';

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
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#00D9FF" />
      </View>
    );
  }

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