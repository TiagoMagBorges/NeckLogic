import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextData {
    isDarkTheme: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [isDarkTheme, setIsDarkTheme] = useState(colorScheme === 'dark');

    useEffect(() => {
        async function loadTheme() {
            const savedTheme = await AsyncStorage.getItem('@NeckLogic:theme');
            if (savedTheme) {
                const isDark = savedTheme === 'dark';
                setColorScheme(savedTheme as 'light' | 'dark');
                setIsDarkTheme(isDark);
            } else {
                setColorScheme('dark');
                setIsDarkTheme(true);
            }
        }
        loadTheme();
    }, [setColorScheme]);

    const toggleTheme = async () => {
        const newTheme = isDarkTheme ? 'light' : 'dark';
        setColorScheme(newTheme);
        setIsDarkTheme(!isDarkTheme);
        await AsyncStorage.setItem('@NeckLogic:theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useTheme() {
    return useContext(ThemeContext);
}