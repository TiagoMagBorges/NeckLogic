import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { StorageService, StorageKeys } from '../services/storage';
import { User } from '../types/User';

interface AuthContextData {
    signed: boolean;
    isInitializing: boolean;
    user: User | null;
    tuning: string[];
    setAuthState: (token: string, userData?: User) => Promise<void>;
    clearAuthState: () => Promise<void>;
    updateUserContext: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [signed, setSigned] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [tuning, setTuning] = useState<string[]>(['E', 'A', 'D', 'G', 'B', 'E']);

    useEffect(() => {
        async function loadStorageData() {
            const token = await StorageService.getItem(StorageKeys.TOKEN);
            const storedUser = await StorageService.getItem('userData');

            if (token) {
                api.defaults.headers.Authorization = `Bearer ${token}`;
                setSigned(true);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            }
            setIsInitializing(false);
        }

        loadStorageData();
    }, []);

    async function setAuthState(token: string, userData?: User) {
        await StorageService.setItem(StorageKeys.TOKEN, token);
        if (userData) {
            await StorageService.setItem('userData', JSON.stringify(userData));
            setUser(userData);
        }
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setSigned(true);
    }

    async function clearAuthState() {
        await StorageService.multiRemove([...Object.values(StorageKeys), 'userData']);
        delete api.defaults.headers.Authorization;
        setSigned(false);
        setUser(null);
    }

    async function updateUserContext(userData: User) {
        await StorageService.setItem('userData', JSON.stringify(userData));
        setUser(userData);
    }

    return (
      <AuthContext.Provider value={{
          signed,
          isInitializing,
          user,
          tuning,
          setAuthState,
          clearAuthState,
          updateUserContext
      }}>
          {children}
      </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}