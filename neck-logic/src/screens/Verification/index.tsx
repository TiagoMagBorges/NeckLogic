import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../contexts/ThemeContext';
import { useSession } from '../../hooks/useSession';
import { useOTP } from '../../hooks/useOTP';
import { useFeedbackModal } from '../../hooks/useFeedbackModal';
import { styles, getButtonStyle } from './styles';
import { FeedbackModal } from '../../components/FeedbackModal';

type RouteParams = {
  Verification: { email: string };
};

export default function VerificationScreen() {

  const navigation = useNavigation<any>();

  const route = useRoute<RouteProp<RouteParams, 'Verification'>>();

  const { email } = route.params;

  const { verifyAccount, resendVerification } = useSession();

  const { code, countdown, inputRefs, handleCodeChange, handleKeyPress, resetCountdown, getFullCode } = useOTP();

  const { modalConfig, showModal } = useFeedbackModal();

  const { isDarkTheme } = useTheme();

  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    resetCountdown();
    try {
      await resendVerification(email);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    const fullCode = getFullCode();

    if (fullCode.length < 6) {
      showModal(t('common.error'), t('verification.errorIncomplete'), 'error');
      return;
    }

    setIsLoading(true);

    try {
      await verifyAccount(email, fullCode);
    } catch (error: any) {
      showModal(
        t('common.error'),
        error.response?.data?.message || t('common.error'),
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={styles.safeArea}>
      <TouchableOpacity onPress={() => navigation.goBack()} className={styles.backButton}>
        <ArrowLeft size={24} color="#A1A1AA" />
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View className={styles.wrapper}>

            <View className={styles.headerContainer}>
              <View className={styles.iconContainer}>
                <Mail size={32} color="#00D9FF" />
              </View>
              <Text className={styles.title}>{t('verification.title')}</Text>
              <Text className={styles.subtitle}>
                {t('verification.subtitle')}
                <Text className={styles.emailHighlight}>{email}</Text>
              </Text>
            </View>

            <View className={styles.otpContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  className={styles.otpInput}
                  maxLength={6}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  editable={!isLoading}
                  selectTextOnFocus
                />
              ))}
            </View>

            <View className={styles.resendContainer}>
              {countdown > 0 ? (
                <Text className={styles.resendText}>
                  {t('verification.resendIn', { time: countdown })}
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend} disabled={isLoading}>
                  <Text className={styles.resendButtonText}>{t('verification.resendCode')}</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={isLoading}
              className={`${styles.buttonBase} ${getButtonStyle(isLoading)}`}
            >
              {isLoading ? (
                <ActivityIndicator color={isDarkTheme ? "#121212" : "#FFFFFF"} />
              ) : (
                <Text className={styles.buttonText}>{t('verification.verifyAccount')}</Text>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <FeedbackModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={t('common.ok')}
        onConfirm={modalConfig.onConfirm}
      />
    </SafeAreaView>
  );
}