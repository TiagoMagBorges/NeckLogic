import "./global.css";
import "./src/i18n";
import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
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
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </AuthProvider>
    );
}