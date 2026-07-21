import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  TOKEN: '@NeckLogic:token',
  USER: '@NeckLogic:user',
  ONBOARDING: '@NeckLogic:onboarding',
  XP: '@NeckLogic:xp',
  LEVEL: '@NeckLogic:level',
  STREAK: '@NeckLogic:streak',
  TUNING: '@NeckLogic:tuning',
} as const;

export const StorageService = {
  setItem: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },
  getItem: async (key: string): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  },
  multiRemove: async (keys: string[]): Promise<void> => {
    await AsyncStorage.multiRemove(keys);
  }
};