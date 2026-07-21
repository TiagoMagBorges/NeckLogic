import React, { createContext, useState, useEffect, useContext } from 'react';
import { StorageService, StorageKeys } from '../services/storage';

interface ProgressContextData {
  xp: number;
  level: number;
  streak: number;
  onboardingCompleted: boolean;
  isInitializing: boolean;
  hydrateProgress: (data: any) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateUserProgress: (xp: number, level: number, streak?: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextData>({} as ProgressContextData);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageXp = await StorageService.getItem(StorageKeys.XP);
      const storageLevel = await StorageService.getItem(StorageKeys.LEVEL);
      const storageStreak = await StorageService.getItem(StorageKeys.STREAK);
      const storageOnboarding = await StorageService.getItem(StorageKeys.ONBOARDING);

      setXp(storageXp ? parseInt(storageXp, 10) : 0);
      setLevel(storageLevel ? parseInt(storageLevel, 10) : 1);
      setStreak(storageStreak ? parseInt(storageStreak, 10) : 0);
      setOnboardingCompleted(storageOnboarding === 'true');
      setIsInitializing(false);
    }

    loadStorageData();
  }, []);

  async function hydrateProgress(data: any) {
    await StorageService.setItem(StorageKeys.XP, String(data.xp || 0));
    await StorageService.setItem(StorageKeys.LEVEL, String(data.level || 1));
    await StorageService.setItem(StorageKeys.STREAK, String(data.streak || 0));
    await StorageService.setItem(StorageKeys.ONBOARDING, String(data.onboardingCompleted));

    setXp(data.xp || 0);
    setLevel(data.level || 1);
    setStreak(data.streak || 0);
    setOnboardingCompleted(data.onboardingCompleted);
  }

  async function completeOnboarding() {
    await StorageService.setItem(StorageKeys.ONBOARDING, 'true');
    setOnboardingCompleted(true);
  }

  async function updateUserProgress(newXp: number, newLevel: number, newStreak?: number) {
    await StorageService.setItem(StorageKeys.XP, String(newXp));
    await StorageService.setItem(StorageKeys.LEVEL, String(newLevel));
    setXp(newXp);
    setLevel(newLevel);

    if (newStreak !== undefined) {
      await StorageService.setItem(StorageKeys.STREAK, String(newStreak));
      setStreak(newStreak);
    }
  }

  return (
    <ProgressContext.Provider value={{
      xp, level, streak, onboardingCompleted, isInitializing,
      hydrateProgress, completeOnboarding, updateUserProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export function useProgress() {
  return useContext(ProgressContext);
}