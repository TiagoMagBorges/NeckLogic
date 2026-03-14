import "./global.css";
import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import Routes from './src/navigation/Routes';

function AppContent() {
    const { isDarkTheme } = useTheme();
    return (
        <>
            <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
            <Routes />
        </>
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