import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Apple, ArrowLeft, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../contexts/AuthContext';
import { styles, getCheckboxStyle, getButtonStyle } from './styles';

export default function RegisterScreen() {
    const navigation = useNavigation<any>();
    const { signUp, loading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    async function handleCreateAccount() {
        if (!termsAccepted) return;

        try {
            await signUp({ name, email, password });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaView className={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                        className={styles.backButton}
                    >
                        <ArrowLeft size={18} color="#A1A1AA" />
                        <Text className={styles.backText}>Back to login</Text>
                    </TouchableOpacity>

                    <View className={styles.headerContainer}>
                        <Text className={styles.title}>
                            Neck<Text className={styles.titleAccent}>Logic</Text>
                        </Text>
                        <Text className={styles.subtitle}>
                            Start your music theory journey
                        </Text>
                    </View>

                    <View className={styles.formContainer}>
                        <View className={styles.inputGroup}>
                            <Text className={styles.label}>Full Name</Text>
                            <View className={styles.inputWrapper}>
                                <View className={styles.iconPosition}>
                                    <User size={18} color="#A1A1AA" />
                                </View>
                                <TextInput
                                    placeholder="John Doe"
                                    placeholderTextColor="#A1A1AA"
                                    className={styles.inputBase}
                                    value={name}
                                    onChangeText={setName}
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        <View className={styles.inputGroup}>
                            <Text className={styles.label}>Email</Text>
                            <View className={styles.inputWrapper}>
                                <View className={styles.iconPosition}>
                                    <Mail size={18} color="#A1A1AA" />
                                </View>
                                <TextInput
                                    placeholder="you@example.com"
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
                            <Text className={styles.label}>Password</Text>
                            <View className={styles.inputWrapper}>
                                <View className={styles.iconPosition}>
                                    <Lock size={18} color="#A1A1AA" />
                                </View>
                                <TextInput
                                    placeholder="••••••••"
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
                                {termsAccepted && <Check size={14} color="#121212" />}
                            </TouchableOpacity>

                            <View className={styles.termsTextWrapper}>
                                <Text className={styles.termsText}>I agree to the </Text>
                                <TouchableOpacity disabled={loading}>
                                    <Text className={styles.linkText}>Terms of Service</Text>
                                </TouchableOpacity>
                                <Text className={styles.termsText}> and </Text>
                                <TouchableOpacity disabled={loading}>
                                    <Text className={styles.linkText}>Privacy Policy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleCreateAccount}
                            activeOpacity={0.8}
                            disabled={loading || !termsAccepted}
                            className={`${styles.buttonBase} ${getButtonStyle(loading)}`}
                        >
                            {loading ? (
                                <ActivityIndicator color="#121212" />
                            ) : (
                                <Text className={styles.buttonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View className={styles.dividerContainer}>
                        <View className={styles.dividerLine} />
                        <Text className={styles.dividerText}>or sign up with</Text>
                        <View className={styles.dividerLine} />
                    </View>

                    <View className={styles.socialContainer}>
                        <TouchableOpacity className={styles.socialButton} activeOpacity={0.7} disabled={loading}>
                            <Apple size={20} color="#FFFFFF" />
                            <Text className={styles.socialText}>Sign up with Apple</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className={styles.socialButton} activeOpacity={0.7} disabled={loading}>
                            <Text className={styles.googleText}>G</Text>
                            <Text className={styles.socialText}>Sign up with Google</Text>
                        </TouchableOpacity>
                    </View>

                    <View className={styles.footerContainer}>
                        <Text className={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
                            <Text className={styles.signInText}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}