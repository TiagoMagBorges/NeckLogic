import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import LogicPathScreen from '../screens/LogicPath';

const Stack = createNativeStackNavigator();

export default function Routes() {
    const { signed, loading } = useAuth();

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#00D9FF" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'fade'
                }}
            >
                {signed ? (
                    <Stack.Screen name="Home" component={LogicPathScreen} />
                ) : (
                    <Stack.Group screenOptions={{ animation: 'slide_from_right' }}>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </Stack.Group>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}