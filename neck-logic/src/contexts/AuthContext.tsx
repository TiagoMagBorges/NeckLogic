import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface AuthContextData {
    signed: boolean;
    loading: boolean;
    signIn(credentials: object): Promise<void>;
    signUp(data: object): Promise<void>;
    signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storageToken = await AsyncStorage.getItem('@NeckLogic:token');

            if (storageToken) {
                api.defaults.headers.Authorization = `Bearer ${storageToken}`;
                setSigned(true);
            }
            setLoading(false);
        }
        loadStorageData();
    }, []);

    async function signIn(credentials: object) {
        try {
            setLoading(true);
            const response = await api.post('/auth/login', credentials);
            const { token } = response.data;

            await AsyncStorage.setItem('@NeckLogic:token', token);
            api.defaults.headers.Authorization = `Bearer ${token}`;

            setSigned(true);
        } catch (error) {
            alert('E-mail ou senha inválidos');
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function signUp(data: object) {
        try {
            setLoading(true);
            await api.post('/auth/register', data);
        } catch (error) {
            alert('Erro ao criar conta');
            throw error;
        } finally {
            setLoading(false);
        }
    }

    function signOut() {
        AsyncStorage.clear().then(() => {
            setSigned(false);
        });
    }

    return (
        <AuthContext.Provider value={{ signed, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}