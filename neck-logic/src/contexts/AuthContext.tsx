import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface AuthContextData {
    signed: boolean;
    loading: boolean;
    onboardingCompleted: boolean;
    xp: number;
    level: number;
    signIn(credentials: any): Promise<void>;
    signUp(data: any): Promise<void>;
    signOut(): void;
    completeOnboarding(): Promise<void>;
    updateUserProgress(newXp: number, newLevel: number): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(true);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);

    useEffect(() => {
        async function loadStorageData() {
            const storageToken = await AsyncStorage.getItem('@NeckLogic:token');
            const storageOnboarding = await AsyncStorage.getItem('@NeckLogic:onboarding');
            const storageXp = await AsyncStorage.getItem('@NeckLogic:xp');
            const storageLevel = await AsyncStorage.getItem('@NeckLogic:level');

            if (storageToken) {
                api.defaults.headers.Authorization = `Bearer ${storageToken}`;
                setSigned(true);
                setOnboardingCompleted(storageOnboarding === 'true');
                setXp(storageXp ? parseInt(storageXp, 10) : 0);
                setLevel(storageLevel ? parseInt(storageLevel, 10) : 1);
            }
            setLoading(false);
        }

        loadStorageData();

        const interceptor = api.interceptors.response.use(
            response => response,
            error => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    signOut();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    async function signIn(credentials: any) {
        try {
            setLoading(true);
            const response = await api.post('/auth/login', credentials);
            const { token, onboardingCompleted: isCompleted, xp: userXp, level: userLevel } = response.data;

            await AsyncStorage.setItem('@NeckLogic:token', token);
            await AsyncStorage.setItem('@NeckLogic:onboarding', String(isCompleted));
            await AsyncStorage.setItem('@NeckLogic:xp', String(userXp || 0));
            await AsyncStorage.setItem('@NeckLogic:level', String(userLevel || 1));

            api.defaults.headers.Authorization = `Bearer ${token}`;

            setSigned(true);
            setOnboardingCompleted(isCompleted);
            setXp(userXp || 0);
            setLevel(userLevel || 1);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function signUp(data: any) {
        try {
            setLoading(true);
            await api.post('/auth/register', data);
            await signIn({ email: data.email, password: data.password });
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function completeOnboarding() {
        try {
            await api.patch('/users/onboarding');
            await AsyncStorage.setItem('@NeckLogic:onboarding', 'true');
            setOnboardingCompleted(true);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function updateUserProgress(newXp: number, newLevel: number) {
        await AsyncStorage.setItem('@NeckLogic:xp', String(newXp));
        await AsyncStorage.setItem('@NeckLogic:level', String(newLevel));
        setXp(newXp);
        setLevel(newLevel);
    }

    function signOut() {
        AsyncStorage.multiRemove([
            '@NeckLogic:token',
            '@NeckLogic:onboarding',
            '@NeckLogic:xp',
            '@NeckLogic:level'
        ]).then(() => {
            setSigned(false);
            setOnboardingCompleted(false);
            setXp(0);
            setLevel(1);
        });
    }

    return (
        <AuthContext.Provider value={{
            signed,
            loading,
            onboardingCompleted,
            xp,
            level,
            signIn,
            signUp,
            signOut,
            completeOnboarding,
            updateUserProgress
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}