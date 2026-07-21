import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Mail, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

interface ForgotPasswordModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (email: string) => Promise<void>;
}

export function ForgotPasswordModal({ visible, onClose, onSubmit }: ForgotPasswordModalProps) {
    const { t } = useTranslation();
    const { isDarkTheme } = useTheme();
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);

    async function handleSend() {
        if (!email || !email.includes('@')) return;

        setIsSending(true);

        try {
            await onSubmit(email);
            setEmail('');
        } finally {
            setIsSending(false);
        }
    }

    return (
      <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
          <View className="flex-1 justify-center items-center bg-black/80 px-6">
              <View className="w-full bg-card border border-border/10 rounded-2xl p-6">
                  <View className="flex-row justify-between items-center mb-4">
                      <Text className="text-xl font-bold text-foreground">
                          {t('login.forgotModalTitle')}
                      </Text>
                      <TouchableOpacity onPress={onClose} disabled={isSending}>
                          <X size={24} color="#A1A1AA" />
                      </TouchableOpacity>
                  </View>

                  <Text className="text-sm text-muted-foreground mb-6">
                      {t('login.forgotModalDesc')}
                  </Text>

                  <View className="mb-6 relative justify-center">
                      <View className="absolute left-4 z-10">
                          <Mail size={18} color="#A1A1AA" />
                      </View>
                      <TextInput
                        placeholder={t('login.emailPlaceholder')}
                        placeholderTextColor="#A1A1AA"
                        className="w-full bg-input-background border border-border rounded-xl pl-12 pr-4 py-4 text-foreground focus:border-primary"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        editable={!isSending}
                      />
                  </View>

                  <TouchableOpacity
                    onPress={handleSend}
                    activeOpacity={0.8}
                    disabled={isSending || !email}
                    className={`w-full py-4 rounded-xl items-center ${isSending || !email ? 'bg-primary/60' : 'bg-primary'}`}
                  >
                      {isSending ? (
                        <ActivityIndicator color={isDarkTheme ? "#121212" : "#FFFFFF"} />
                      ) : (
                        <Text className="text-primary-foreground font-bold text-base">
                            {t('login.forgotModalSend')}
                        </Text>
                      )}
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
    );
}