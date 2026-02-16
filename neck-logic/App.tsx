import "./global.css";
import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/contexts/AuthContext';
import Routes from './src/navigation/Routes';

export default function App() {
    return (
        <AuthProvider>
            <StatusBar style="light" />
            <Routes />
        </AuthProvider>
    );
}