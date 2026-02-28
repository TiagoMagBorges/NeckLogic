import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface AuthContextData {
    signed: boolean;
    loading: boolean;
    onboardingCompleted: boolean;
    signIn(credentials: any): Promise<void>;
    signUp(data: any): Promise<void>;
    signOut(): void;
    completeOnboarding(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(true);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);

    useEffect(() => {
        async function loadStorageData() {
            const storageToken = await AsyncStorage.getItem('@NeckLogic:token');
            const storageOnboarding = await AsyncStorage.getItem('@NeckLogic:onboarding');

            if (storageToken) {
                api.defaults.headers.Authorization = `Bearer ${storageToken}`;
                setSigned(true);
                setOnboardingCompleted(storageOnboarding === 'true');
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
            const { token, onboardingCompleted: isCompleted } = response.data;

            await AsyncStorage.setItem('@NeckLogic:token', token);
            await AsyncStorage.setItem('@NeckLogic:onboarding', String(isCompleted));
            api.defaults.headers.Authorization = `Bearer ${token}`;

            setSigned(true);
            setOnboardingCompleted(isCompleted);
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

    function signOut() {
        AsyncStorage.multiRemove(['@NeckLogic:token', '@NeckLogic:onboarding']).then(() => {
            setSigned(false);
            setOnboardingCompleted(false);
        });
    }

    return (
        <AuthContext.Provider value={{ signed, loading, onboardingCompleted, signIn, signUp, signOut, completeOnboarding }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}