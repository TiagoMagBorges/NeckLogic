import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export function useAccount() {
  const { user, updateUserContext, clearAuthState } = useAuth();

  const updateAccountProfile = async (data: { name: string; email: string }) => {
    await api.put('/users/profile', data);
    if (user) {
      await updateUserContext({ ...user, ...data });
    }
  };

  const updatePassword = async (data: { currentPassword: string; newPassword: string }) => {
    await api.put('/users/password', data);
  };

  const deleteAccount = async () => {
    await api.delete('/users/account');
    await clearAuthState();
  };

  const signOut = async () => {
    await clearAuthState();
  };

  return {
    updateAccountProfile,
    updatePassword,
    deleteAccount,
    signOut
  };
}