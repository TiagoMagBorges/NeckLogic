import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Apple } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { z } from 'zod';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { styles, getInputStyle, getButtonStyle } from './styles';
import { FeedbackModal } from '../../components/FeedbackModal';

const loginSchema = z.object({
    email: z.email({ message: "Digite um e-mail válido" }),
    password: z.string().min(1, "A senha é obrigatória"),
});

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const { signIn, loading } = useAuth();
    const { isDarkTheme } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

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

            if (status === 400 || status === 401 || status === 403 || status === 404) {
                setModalMessage('E-mail ou senha incorretos.');
            } else {
                setModalMessage('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
            }

            setModalVisible(true);
        }
    }

    return (
        <SafeAreaView className={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View className={styles.wrapper}>
                        <View className={styles.headerContainer}>
                            <Text className={styles.logoText}>
                                Neck<Text className={styles.logoAccent}>Logic</Text>
                            </Text>
                            <Text className={styles.subtitle}>Master the fretboard with precision</Text>
                        </View>

                        <View className={styles.formContainer}>
                            <View className={styles.inputGroup}>
                                <Text className={styles.label}>Email</Text>
                                <View className={styles.inputWrapper}>
                                    <View className={styles.iconContainer}>
                                        <Mail size={18} color={errors.email ? "#F87171" : "#A1A1AA"} />
                                    </View>
                                    <TextInput
                                        placeholder="you@example.com"
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
                                <Text className={styles.label}>Password</Text>
                                <View className={styles.inputWrapper}>
                                    <View className={styles.iconContainer}>
                                        <Lock size={18} color={errors.password ? "#F87171" : "#A1A1AA"} />
                                    </View>
                                    <TextInput
                                        placeholder="••••••••"
                                        placeholderTextColor="#A1A1AA"
                                        className={`${styles.inputBase} ${getInputStyle(!!errors.password)}`}
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            if (errors.password) setErrors({ ...errors, password: undefined });
                                        }}
                                        secureTextEntry
                                        editable={!loading}
                                    />
                                </View>
                                {errors.password && <Text className={styles.errorText}>{errors.password}</Text>}
                            </View>

                            <TouchableOpacity
                                onPress={handleLogin}
                                activeOpacity={0.8}
                                disabled={loading}
                                className={`${styles.buttonBase} ${getButtonStyle(loading)}`}
                            >
                                {loading ? (
                                    <ActivityIndicator color={isDarkTheme ? "#121212" : "#FFFFFF"} />
                                ) : (
                                    <Text className={styles.buttonText}>Sign In</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View className={styles.dividerContainer}>
                            <View className={styles.dividerLine} />
                            <Text className={styles.dividerText}>or continue with</Text>
                            <View className={styles.dividerLine} />
                        </View>

                        <View className={styles.socialContainer}>
                            <TouchableOpacity className={styles.socialButton} activeOpacity={0.7} disabled={loading}>
                                <Apple size={20} color={isDarkTheme ? "#FFFFFF" : "#121212"} />
                                <Text className={styles.socialText}>Continue with Apple</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className={styles.socialButton} activeOpacity={0.7} disabled={loading}>
                                <Text className={styles.googleIcon}>G</Text>
                                <Text className={styles.socialText}>Continue with Google</Text>
                            </TouchableOpacity>
                        </View>

                        <View className={styles.footerContainer}>
                            <Text className={styles.footerText}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
                                <Text className={styles.signupText}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <FeedbackModal
                visible={modalVisible}
                title="Falha na Autenticação"
                message={modalMessage}
                type="error"
                confirmText="Tentar novamente"
                onConfirm={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
}