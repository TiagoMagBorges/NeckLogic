import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { StorageService, StorageKeys } from '../services/storage';
import { TokenStorage } from '../services/secureTokenStorage';
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
            const token = await TokenStorage.getToken();
            const storedUser = await StorageService.getItem(StorageKeys.USER);

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
        await TokenStorage.setToken(token);
        if (userData) {
            await StorageService.setItem(StorageKeys.USER, JSON.stringify(userData));
            setUser(userData);
        }
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setSigned(true);
    }

    async function clearAuthState() {
        await TokenStorage.removeToken();
        await StorageService.multiRemove(Object.values(StorageKeys));
        delete api.defaults.headers.Authorization;
        setSigned(false);
        setUser(null);
    }

    async function updateUserContext(userData: User) {
        await StorageService.setItem(StorageKeys.USER, JSON.stringify(userData));
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