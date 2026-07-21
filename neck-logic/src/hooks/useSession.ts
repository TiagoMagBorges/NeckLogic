import { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { User } from "@/src/types/User";

export function useSession() {
  const [loading, setLoading] = useState(false);

  const { setAuthState, clearAuthState } = useAuth();
  const { hydrateProgress } = useProgress();

  const orchestrateSession = async (data: any) => {
    const token = data.token || data.accessToken;
    const user = data.user || data;

    await hydrateProgress(data);
    await setAuthState(token, user as User);
  };

  const signIn = async (credentials: any) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', credentials);
      await orchestrateSession(response.data);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: any) => {
    try {
      setLoading(true);
      await api.post('/auth/register', data);
    } finally {
      setLoading(false);
    }
  };

  const verifyAccount = async (email: string, token: string) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/verify-account', { email, token });
      await orchestrateSession(response.data);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    await api.post('/auth/resend-verification', { email });
  };

  const forgotPassword = async (email: string) => {
    await api.post('/auth/forgot-password', { email });
  };

  const resetPassword = async (data: any) => {
    await api.post('/auth/reset-password', data);
  };

  const signOut = async () => {
    await clearAuthState();
  };

  return {
    signIn,
    signUp,
    verifyAccount,
    resendVerification,
    forgotPassword,
    resetPassword,
    signOut,
    loading
  };
}