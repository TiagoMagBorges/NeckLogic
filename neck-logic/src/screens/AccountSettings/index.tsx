import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, LogOut, User as UserIcon, Mail, Save, Lock, Trash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { useAccount } from '../../hooks/useAccount';
import { profileSchema, passwordSchema } from '../../validations/profile';
import { FeedbackModal } from '../../components/FeedbackModal';

type ModalConfig = {
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
};

export default function AccountSettingsScreen() {
    const navigation = useNavigation();

    const { user } = useAuth();
    const { updateAccountProfile, updatePassword, deleteAccount, signOut } = useAccount();

    const { t } = useTranslation();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const [modalConfig, setModalConfig] = useState<ModalConfig>({
        visible: false,
        title: '',
        message: '',
        type: 'success'
    });

    const showModal = (config: Omit<ModalConfig, 'visible'>) => setModalConfig({ ...config, visible: true });
    const hideModal = () => setModalConfig(prev => ({ ...prev, visible: false }));

    const handleSaveProfile = async () => {
        const validation = profileSchema.safeParse({ name: name.trim(), email: email.trim() });

        if (!validation.success) {
            showModal({
                title: t('account.modalCheckData'),
                message: validation.error.issues[0].message,
                type: 'error',
                onConfirm: hideModal
            });
            return;
        }

        setIsSavingProfile(true);

        try {
            await updateAccountProfile(validation.data);
            showModal({
                title: t('account.modalProfileSuccess'),
                message: t('account.modalProfileSuccessDesc'),
                type: 'success',
                onConfirm: hideModal
            });
        } catch (error: any) {
            const status = error.response?.status;
            let errorMessage = t('account.modalErrorNetwork');

            if (status === 400 || status === 409) {
                errorMessage = error.response?.data?.message || t('register.errorInvalid');
            }

            showModal({
                title: t('account.modalError'),
                message: errorMessage,
                type: 'error',
                onConfirm: hideModal
            });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleSavePassword = async () => {
        const validation = passwordSchema.safeParse({ currentPassword, newPassword, confirmPassword });

        if (!validation.success) {
            showModal({
                title: t('account.modalCheckData'),
                message: validation.error.issues[0].message,
                type: 'error',
                onConfirm: hideModal
            });
            return;
        }

        setIsSavingPassword(true);

        try {
            await updatePassword({ currentPassword, newPassword });
            showModal({
                title: t('account.modalSecurity'),
                message: t('account.modalPasswordSuccess'),
                type: 'success',
                onConfirm: hideModal
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            const status = error.response?.status;
            let errorMessage = t('account.modalPasswordError');

            if (status === 400) {
                errorMessage = error.response?.data?.message || t('account.modalErrorNetwork');
            }

            showModal({
                title: t('account.modalError'),
                message: errorMessage,
                type: 'error',
                onConfirm: hideModal
            });
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleSignOut = () => {
        showModal({
            title: t('account.modalSignOutTitle'),
            message: t('account.modalSignOutDesc'),
            type: 'warning',
            confirmText: t('account.modalYesSignOut'),
            cancelText: t('account.modalCancel'),
            onCancel: hideModal,
            onConfirm: () => {
                hideModal();
                signOut();
            }
        });
    };

    const handleDeleteAccount = () => {
        showModal({
            title: t('account.modalDeleteTitle'),
            message: t('account.modalDeleteDesc'),
            type: 'warning',
            confirmText: t('account.modalYesDelete'),
            cancelText: t('account.modalCancel'),
            onCancel: hideModal,
            onConfirm: async () => {
                hideModal();
                try {
                    await deleteAccount();
                } catch (error) {
                    setTimeout(() => {
                        showModal({
                            title: t('account.modalDeleteErrorTitle'),
                            message: t('account.modalDeleteErrorDesc'),
                            type: 'error',
                            onConfirm: hideModal
                        });
                    }, 500);
                }
            }
        });
    };

    return (
      <SafeAreaView className="flex-1 bg-background">
          <View className="flex-row items-center px-6 py-4 border-b border-border/10">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                  <ChevronLeft size={24} color="#A1A1AA" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-foreground">{t('account.title')}</Text>
          </View>

          <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
              <View className="mb-8">
                  <Text className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                      {t('account.personalInfo')}
                  </Text>

                  <View className="mb-4">
                      <Text className="text-xs text-muted-foreground mb-2 ml-1">{t('account.nameLabel')}</Text>
                      <View className="flex-row items-center bg-card border border-border/10 rounded-xl px-4 h-14">
                          <UserIcon size={20} color="#A1A1AA" />
                          <TextInput
                            className="flex-1 ml-3 text-foreground font-medium"
                            value={name}
                            onChangeText={setName}
                            placeholder={t('account.namePlaceholder')}
                            placeholderTextColor="#52525B"
                            autoCapitalize="words"
                          />
                      </View>
                  </View>

                  <View className="mb-6">
                      <Text className="text-xs text-muted-foreground mb-2 ml-1">{t('account.emailLabel')}</Text>
                      <View className="flex-row items-center bg-card border border-border/10 rounded-xl px-4 h-14">
                          <Mail size={20} color="#A1A1AA" />
                          <TextInput
                            className="flex-1 ml-3 text-foreground font-medium"
                            value={email}
                            onChangeText={setEmail}
                            placeholder={t('account.emailPlaceholder')}
                            placeholderTextColor="#52525B"
                            keyboardType="email-address"
                            autoCapitalize="none"
                          />
                      </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleSaveProfile}
                    disabled={isSavingProfile}
                    activeOpacity={0.8}
                    className={`flex-row items-center justify-center py-4 rounded-xl ${isSavingProfile ? 'bg-primary/50' : 'bg-primary'}`}
                  >
                      {isSavingProfile ? (
                        <ActivityIndicator color="#121212" />
                      ) : (
                        <>
                            <Save size={20} color="#121212" className="mr-2" />
                            <Text className="text-[#121212] font-bold text-lg">{t('account.saveProfile')}</Text>
                        </>
                      )}
                  </TouchableOpacity>
              </View>

              <View className="mb-8 border-t border-border/10 pt-8">
                  <Text className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                      {t('account.security')}
                  </Text>

                  <View className="mb-4">
                      <Text className="text-xs text-muted-foreground mb-2 ml-1">{t('account.currentPassword')}</Text>
                      <View className="flex-row items-center bg-card border border-border/10 rounded-xl px-4 h-14">
                          <Lock size={20} color="#A1A1AA" />
                          <TextInput
                            className="flex-1 ml-3 text-foreground font-medium"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="••••••••"
                            placeholderTextColor="#52525B"
                            secureTextEntry
                          />
                      </View>
                  </View>

                  <View className="mb-4">
                      <Text className="text-xs text-muted-foreground mb-2 ml-1">{t('account.newPassword')}</Text>
                      <View className="flex-row items-center bg-card border border-border/10 rounded-xl px-4 h-14">
                          <Lock size={20} color="#A1A1AA" />
                          <TextInput
                            className="flex-1 ml-3 text-foreground font-medium"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder={t('account.newPasswordPlaceholder')}
                            placeholderTextColor="#52525B"
                            secureTextEntry
                          />
                      </View>
                  </View>

                  <View className="mb-6">
                      <Text className="text-xs text-muted-foreground mb-2 ml-1">{t('account.confirmPassword')}</Text>
                      <View className="flex-row items-center bg-card border border-border/10 rounded-xl px-4 h-14">
                          <Lock size={20} color="#A1A1AA" />
                          <TextInput
                            className="flex-1 ml-3 text-foreground font-medium"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="••••••••"
                            placeholderTextColor="#52525B"
                            secureTextEntry
                          />
                      </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleSavePassword}
                    disabled={isSavingPassword}
                    activeOpacity={0.8}
                    className={`flex-row items-center justify-center py-4 rounded-xl ${isSavingPassword ? 'bg-secondary/50' : 'bg-secondary'}`}
                  >
                      {isSavingPassword ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text className="text-foreground font-bold text-lg">{t('account.updatePassword')}</Text>
                      )}
                  </TouchableOpacity>
              </View>

              <View className="mb-8 border-t border-border/10 pt-8">
                  <Text className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                      {t('account.accountActions')}
                  </Text>
                  <TouchableOpacity
                    onPress={handleSignOut}
                    activeOpacity={0.8}
                    className="flex-row items-center bg-card border border-border/10 py-4 px-4 rounded-xl mb-4"
                  >
                      <LogOut size={20} color="#A1A1AA" className="mr-3" />
                      <Text className="text-foreground font-medium text-base">{t('account.signOut')}</Text>
                  </TouchableOpacity>
              </View>

              <View className="mt-2 border-t border-border/10 pt-8 mb-10">
                  <Text className="text-sm font-semibold text-destructive mb-4 uppercase tracking-wider">
                      {t('account.dangerZone')}
                  </Text>
                  <TouchableOpacity
                    onPress={handleDeleteAccount}
                    activeOpacity={0.8}
                    className="flex-row items-center justify-center bg-destructive/10 border border-destructive/20 py-4 rounded-xl"
                  >
                      <Trash2 size={20} color="#EF4444" className="mr-2" />
                      <Text className="text-destructive font-bold text-lg">{t('account.deleteAccount')}</Text>
                  </TouchableOpacity>
              </View>
          </ScrollView>

          <FeedbackModal
            {...modalConfig}
            onConfirm={modalConfig.onConfirm}
            onCancel={modalConfig.onCancel}
          />
      </SafeAreaView>
    );
}