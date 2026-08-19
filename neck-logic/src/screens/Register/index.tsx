import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, ArrowLeft, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useSession } from '../../hooks/useSession';
import { useTheme } from '../../contexts/ThemeContext';
import { styles, getCheckboxStyle, getButtonStyle } from './styles';
import { FeedbackModal } from '../../components/FeedbackModal';
import { LanguageDropdown } from '../../components/LanguageDropdown';

export default function RegisterScreen() {

    const navigation = useNavigation<any>();

    const { signUp, loading } = useSession();

    const { isDarkTheme } = useTheme();

    const { t } = useTranslation();

    const [name, setName] = useState('');

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [termsAccepted, setTermsAccepted] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const [modalMessage, setModalMessage] = useState('');

    async function handleCreateAccount() {
        if (!termsAccepted) return;

        try {
            await signUp({ name, email, password });
            navigation.navigate('Verification', { email });
        } catch (error: any) {
            const status = error.response?.status;
            if (status === 400) setModalMessage(t('register.errorInvalid'));
            else setModalMessage(t('register.errorGeneric'));

            setModalVisible(true);
        }
    }

    return (
      <SafeAreaView className={styles.safeArea}>
          <LanguageDropdown />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={loading}
            className={styles.backButton}
          >
              <ArrowLeft size={18} color="#A1A1AA" />
              <Text className={styles.backText}>{t('register.back')}</Text>
          </TouchableOpacity>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className={styles.keyboardView}
          >
              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  <View className={styles.wrapper}>
                      <View className={styles.headerContainer}>
                          <Text className={styles.title}>
                              Neck<Text className={styles.titleAccent}>Logic</Text>
                          </Text>
                          <Text className={styles.subtitle}>
                              {t('register.subtitle')}
                          </Text>
                      </View>

                      <View className={styles.formContainer}>
                          <View className={styles.inputGroup}>
                              <Text className={styles.label}>{t('register.nameLabel')}</Text>
                              <View className={styles.inputWrapper}>
                                  <View className={styles.iconPosition}>
                                      <User size={18} color="#A1A1AA" />
                                  </View>
                                  <TextInput
                                    placeholder={t('register.namePlaceholder')}
                                    placeholderTextColor="#A1A1AA"
                                    className={styles.inputBase}
                                    value={name}
                                    onChangeText={setName}
                                    editable={!loading}
                                  />
                              </View>
                          </View>

                          <View className={styles.inputGroup}>
                              <Text className={styles.label}>{t('login.emailLabel')}</Text>
                              <View className={styles.inputWrapper}>
                                  <View className={styles.iconPosition}>
                                      <Mail size={18} color="#A1A1AA" />
                                  </View>
                                  <TextInput
                                    placeholder={t('login.emailPlaceholder')}
                                    placeholderTextColor="#A1A1AA"
                                    className={styles.inputBase}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    editable={!loading}
                                  />
                              </View>
                          </View>

                          <View className={styles.inputGroup}>
                              <Text className={styles.label}>{t('login.passwordLabel')}</Text>
                              <View className={styles.inputWrapper}>
                                  <View className={styles.iconPosition}>
                                      <Lock size={18} color="#A1A1AA" />
                                  </View>
                                  <TextInput
                                    placeholder={t('login.passwordPlaceholder')}
                                    placeholderTextColor="#A1A1AA"
                                    className={styles.inputBase}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    editable={!loading}
                                  />
                              </View>
                          </View>

                          <View className={styles.termsContainer}>
                              <TouchableOpacity
                                onPress={() => setTermsAccepted(!termsAccepted)}
                                disabled={loading}
                                className={`${styles.checkboxBase} ${getCheckboxStyle(termsAccepted)}`}
                              >
                                  {termsAccepted && <Check size={14} color={isDarkTheme ? "#121212" : "#FFFFFF"} />}
                              </TouchableOpacity>

                              <View className={styles.termsTextWrapper}>
                                  <Text className={styles.termsText}>{t('register.agreeText')}</Text>
                                  <TouchableOpacity disabled={loading}>
                                      <Text className={styles.linkText}>{t('register.termsLink')}</Text>
                                  </TouchableOpacity>
                                  <Text className={styles.termsText}>{t('register.andText')}</Text>
                                  <TouchableOpacity disabled={loading}>
                                      <Text className={styles.linkText}>{t('register.privacyLink')}</Text>
                                  </TouchableOpacity>
                              </View>
                          </View>

                          <TouchableOpacity
                            onPress={handleCreateAccount}
                            activeOpacity={0.8}
                            disabled={loading || !termsAccepted}
                            className={`${styles.buttonBase} ${getButtonStyle(loading)} mt-6`}
                          >
                              {loading ? (
                                <ActivityIndicator color={isDarkTheme ? "#121212" : "#FFFFFF"} />
                              ) : (
                                <Text className={styles.buttonText}>{t('register.createButton')}</Text>
                              )}
                          </TouchableOpacity>
                      </View>

                      <View className={styles.footerContainer}>
                          <Text className={styles.footerText}>{t('register.hasAccount')}</Text>
                          <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
                              <Text className={styles.signInText}>{t('register.signInLink')}</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </ScrollView>
          </KeyboardAvoidingView>

          <FeedbackModal
            visible={modalVisible}
            title={t('register.modalTitle')}
            message={modalMessage}
            type="error"
            confirmText={t('register.modalButton')}
            onConfirm={() => setModalVisible(false)}
          />
      </SafeAreaView>
    );
}