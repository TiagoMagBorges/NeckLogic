import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Check, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { useSession } from '../../hooks/useSession';
import { useTheme } from '../../contexts/ThemeContext';
import { styles, getInputStyle, getButtonStyle } from './styles';
import { FeedbackModal } from '../../components/FeedbackModal';
import { LanguageDropdown } from '../../components/LanguageDropdown';
import { ForgotPasswordModal } from '../../components/ForgotPasswordModal';

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const { signIn, forgotPassword, loading } = useSession();
    const { isDarkTheme } = useTheme();
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [forgotModalVisible, setForgotModalVisible] = useState(false);

    const loginSchema = z.object({
        email: z.email({ message: t('login.errorEmailInvalid') }),
        password: z.string().min(1, t('login.errorPasswordRequired')),
    });

    async function handleLogin() {
        try {
            setErrors({});
            const data = loginSchema.parse({ email, password });
            await signIn({ email: data.email, password: data.password });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                const formattedErrors: { email?: string; password?: string } = {};
                error.issues.forEach((err) => {
                    if (err.path[0]) formattedErrors[err.path[0] as keyof typeof formattedErrors] = err.message;
                });
                setErrors(formattedErrors);
                return;
            }

            const status = error.response?.status;
            const errorData = error.response?.data;

            if (status === 403 && errorData?.message === 'ACCOUNT_DISABLED') {
                navigation.navigate('Verification', { email });
                return;
            }

            if (errorData && errorData.message) {
                setModalMessage(errorData.message);
            } else {
                setModalMessage(status === 400 || status === 401 || status === 403 || status === 404 ? t('login.errorAuthFailed') : t('login.errorNetwork'));
            }

            setModalVisible(true);
        }
    }

    async function handleForgotPasswordRequest(resetEmail: string) {
        try {
            await forgotPassword(resetEmail);
            navigation.navigate('ResetPassword', { email: resetEmail });
        } catch (error: any) {
            setModalMessage(error.response?.data?.message || t('common.error'));
            setModalVisible(true);
        }
    }

    return (
      <SafeAreaView className={styles.container}>
          <LanguageDropdown />

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className={styles.keyboardView}>
              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  <View className={styles.wrapper}>
                      <View className={styles.headerContainer}>
                          <Text className={styles.logoText}>
                              Neck<Text className={styles.logoAccent}>Logic</Text>
                          </Text>
                          <Text className={styles.subtitle}>{t('login.subtitle')}</Text>
                      </View>

                      <View className={styles.formContainer}>
                          <View className={styles.inputGroup}>
                              <Text className={styles.label}>{t('login.emailLabel')}</Text>
                              <View className={styles.inputWrapper}>
                                  <View className={styles.iconContainer}>
                                      <Mail size={18} color={errors.email ? "#F87171" : "#A1A1AA"} />
                                  </View>
                                  <TextInput
                                    placeholder={t('login.emailPlaceholder')}
                                    placeholderTextColor="#A1A1AA"
                                    className={`${styles.inputBase} ${getInputStyle(!!errors.email)}`}
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        if (errors.email) setErrors({ ...errors, email: undefined });
                                    }}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    editable={!loading}
                                  />
                              </View>
                              {errors.email && <Text className={styles.errorText}>{errors.email}</Text>}
                          </View>

                          <View className={styles.inputGroup}>
                              <Text className={styles.label}>{t('login.passwordLabel')}</Text>
                              <View className={styles.inputWrapper}>
                                  <View className={styles.iconContainer}>
                                      <Lock size={18} color={errors.password ? "#F87171" : "#A1A1AA"} />
                                  </View>
                                  <TextInput
                                    placeholder={t('login.passwordPlaceholder')}
                                    placeholderTextColor="#A1A1AA"
                                    className={`${styles.inputBase} ${styles.inputBasePassword} ${getInputStyle(!!errors.password)}`}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (errors.password) setErrors({ ...errors, password: undefined });
                                    }}
                                    secureTextEntry={!showPassword}
                                    editable={!loading}
                                  />
                                  <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className={styles.eyeButton}
                                    disabled={loading}
                                  >
                                      {showPassword ? (
                                        <EyeOff size={18} color="#A1A1AA" />
                                      ) : (
                                        <Eye size={18} color="#A1A1AA" />
                                      )}
                                  </TouchableOpacity>
                              </View>
                              {errors.password && <Text className={styles.errorText}>{errors.password}</Text>}

                              <View className="flex-row justify-between items-center mt-2 px-1">
                                  <TouchableOpacity
                                    onPress={() => setRememberMe(!rememberMe)}
                                    activeOpacity={0.8}
                                    disabled={loading}
                                    className="flex-row items-center"
                                  >
                                      <View className={`w-5 h-5 rounded border items-center justify-center mr-2 ${rememberMe ? 'bg-primary border-primary' : 'bg-input-background border-border'}`}>
                                          {rememberMe && <Check size={14} color={isDarkTheme ? "#121212" : "#FFFFFF"} />}
                                      </View>
                                      <Text className="text-sm text-muted-foreground">{t('login.rememberMe')}</Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity onPress={() => setForgotModalVisible(true)} disabled={loading}>
                                      <Text className="text-primary text-sm font-medium">{t('login.forgotPassword')}</Text>
                                  </TouchableOpacity>
                              </View>
                          </View>

                          <TouchableOpacity
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            disabled={loading}
                            className={`${styles.buttonBase} ${getButtonStyle(loading)} mt-4`}
                          >
                              {loading ? (
                                <ActivityIndicator color={isDarkTheme ? "#121212" : "#FFFFFF"} />
                              ) : (
                                <Text className={styles.buttonText}>{t('login.signInButton')}</Text>
                              )}
                          </TouchableOpacity>
                      </View>

                      <View className={styles.footerContainer}>
                          <Text className={styles.footerText}>{t('login.noAccount')}</Text>
                          <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
                              <Text className={styles.signupText}>{t('login.signUpLink')}</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </ScrollView>
          </KeyboardAvoidingView>

          <FeedbackModal
            visible={modalVisible}
            title={t('login.modalTitle')}
            message={modalMessage}
            type="error"
            confirmText={t('common.ok')}
            onConfirm={() => setModalVisible(false)}
          />

          <ForgotPasswordModal
            visible={forgotModalVisible}
            onClose={() => setForgotModalVisible(false)}
            onSubmit={handleForgotPasswordRequest}
          />
      </SafeAreaView>
    );
}