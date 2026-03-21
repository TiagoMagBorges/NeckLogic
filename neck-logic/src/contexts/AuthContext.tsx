import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export interface User {
    name: string;
    email: string;
}

interface AuthContextData {
    signed: boolean;
    loading: boolean;
    isInitializing: boolean;
    onboardingCompleted: boolean;
    xp: number;
    level: number;
    streak: number;
    user: User | null;
    tuning: string[];
    signIn(credentials: any): Promise<void>;
    signUp(data: any): Promise<void>;
    signOut(): void;
    completeOnboarding(): Promise<void>;
    updateUserProgress(newXp: number, newLevel: number, newStreak?: number): Promise<void>;
    updateAccountProfile(data: { name: string, email: string }): Promise<void>;
    updatePassword(data: any): Promise<void>;
    deleteAccount(): Promise<void>;
    updateTuning(newTuning: string[]): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const DEFAULT_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(false); // Agora começa como false
    const [isInitializing, setIsInitializing] = useState(true); // Novo estado para o root do app
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [streak, setStreak] = useState(0);
    const [user, setUser] = useState<User | null>(null);
    const [tuning, setTuning] = useState<string[]>(DEFAULT_TUNING);

    useEffect(() => {
        async function loadStorageData() {
            const storageToken = await AsyncStorage.getItem('@NeckLogic:token');
            const storageOnboarding = await AsyncStorage.getItem('@NeckLogic:onboarding');
            const storageXp = await AsyncStorage.getItem('@NeckLogic:xp');
            const storageLevel = await AsyncStorage.getItem('@NeckLogic:level');
            const storageStreak = await AsyncStorage.getItem('@NeckLogic:streak');
            const storageUser = await AsyncStorage.getItem('@NeckLogic:user');
            const storageTuning = await AsyncStorage.getItem('@NeckLogic:tuning');

            if (storageToken) {
                api.defaults.headers.Authorization = `Bearer ${storageToken}`;
                setSigned(true);
                setOnboardingCompleted(storageOnboarding === 'true');
                setXp(storageXp ? parseInt(storageXp, 10) : 0);
                setLevel(storageLevel ? parseInt(storageLevel, 10) : 1);
                setStreak(storageStreak ? parseInt(storageStreak, 10) : 0);

                if (storageUser) {
                    setUser(JSON.parse(storageUser));
                }

                if (storageTuning) {
                    setTuning(JSON.parse(storageTuning));
                }
            }
            setIsInitializing(false);
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
            const { token, onboardingCompleted: isCompleted, xp: userXp, level: userLevel, streak: userStreak, name, email } = response.data;

            const loggedUser: User = {
                name: name || 'Guitarrista',
                email: email || credentials.email
            };

            await AsyncStorage.setItem('@NeckLogic:token', token);
            await AsyncStorage.setItem('@NeckLogic:onboarding', String(isCompleted));
            await AsyncStorage.setItem('@NeckLogic:xp', String(userXp || 0));
            await AsyncStorage.setItem('@NeckLogic:level', String(userLevel || 1));
            await AsyncStorage.setItem('@NeckLogic:streak', String(userStreak || 0));
            await AsyncStorage.setItem('@NeckLogic:user', JSON.stringify(loggedUser));

            api.defaults.headers.Authorization = `Bearer ${token}`;

            setSigned(true);
            setOnboardingCompleted(isCompleted);
            setXp(userXp || 0);
            setLevel(userLevel || 1);
            setStreak(userStreak || 0);
            setUser(loggedUser);
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

    async function updateUserProgress(newXp: number, newLevel: number, newStreak?: number) {
        await AsyncStorage.setItem('@NeckLogic:xp', String(newXp));
        await AsyncStorage.setItem('@NeckLogic:level', String(newLevel));
        setXp(newXp);
        setLevel(newLevel);

        if (newStreak !== undefined) {
            await AsyncStorage.setItem('@NeckLogic:streak', String(newStreak));
            setStreak(newStreak);
        }
    }

    async function updateAccountProfile(data: { name: string, email: string }) {
        try {
            const response = await api.put('/users/profile', data);
            const updatedUser: User = { name: response.data.name, email: response.data.email };
            await AsyncStorage.setItem('@NeckLogic:user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function updatePassword(data: any) {
        try {
            await api.put('/users/password', data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function deleteAccount() {
        try {
            await api.delete('/users/account');
            signOut();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function updateTuning(newTuning: string[]) {
        await AsyncStorage.setItem('@NeckLogic:tuning', JSON.stringify(newTuning));
        setTuning(newTuning);
    }

    function signOut() {
        AsyncStorage.multiRemove([
            '@NeckLogic:token',
            '@NeckLogic:onboarding',
            '@NeckLogic:xp',
            '@NeckLogic:level',
            '@NeckLogic:streak',
            '@NeckLogic:user',
            '@NeckLogic:tuning'
        ]).then(() => {
            setSigned(false);
            setOnboardingCompleted(false);
            setXp(0);
            setLevel(1);
            setStreak(0);
            setUser(null);
            setTuning(DEFAULT_TUNING);
        });
    }

    return (
        <AuthContext.Provider value={{
            signed,
            loading,
            isInitializing,
            onboardingCompleted,
            xp,
            level,
            streak,
            user,
            tuning,
            signIn,
            signUp,
            signOut,
            completeOnboarding,
            updateUserProgress,
            updateAccountProfile,
            updatePassword,
            deleteAccount,
            updateTuning
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}