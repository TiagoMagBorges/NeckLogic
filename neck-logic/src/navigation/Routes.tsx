import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../contexts/AuthContext';
import { MainTabs } from './MainTabs';

import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import LessonScreen from '../screens/Lesson';
import OnboardingScreen from '../screens/Onboarding';
import LessonFeedbackScreen from '../screens/LessonFeedback';
import AccountSettingsScreen from '../screens/AccountSettings';
import GuitarTuningScreen from '../screens/GuitarTuning';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Onboarding: undefined;
    MainTabs: undefined;
    AccountSettings: undefined;
    GuitarTuning: undefined;
    Lesson: { moduleId: number; title: string };
    LessonFeedback: {
        xpGained: number;
        leveledUp: boolean;
        currentLevel: number;
        mistakesCount: number;
        drillCount: number;
    };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
    const { signed, loading, onboardingCompleted } = useAuth();

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#00D9FF" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {signed ? (
                    onboardingCompleted ? (
                        <>
                            <Stack.Screen name="MainTabs" component={MainTabs} />
                            <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
                            <Stack.Screen name="GuitarTuning" component={GuitarTuningScreen} />
                            <Stack.Screen name="Lesson" component={LessonScreen} />
                            <Stack.Screen name="LessonFeedback" component={LessonFeedbackScreen} />
                        </>
                    ) : (
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    )
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}