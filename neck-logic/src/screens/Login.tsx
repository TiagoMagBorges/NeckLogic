import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Apple } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
    email: z.email({ message: "Digite um e-mail válido" }),
    password: z.string().min(1, "A senha é obrigatória"),
});

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const { signIn, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    async function handleLogin() {
        try {
            setErrors({});
            const data = loginSchema.parse({ email, password });
            await signIn({ email: data.email, password: data.password });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: { email?: string; password?: string } = {};
                error.issues.forEach((err) => {
                    if (err.path[0]) {
                        formattedErrors[err.path[0] as keyof typeof formattedErrors] = err.message;
                    }
                });
                setErrors(formattedErrors);
            }
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="items-center mb-12">
                        <Text className="text-4xl font-bold tracking-tight text-foreground mb-2">
                            Neck<Text className="text-primary">Logic</Text>
                        </Text>
                        <Text className="text-muted-foreground text-sm">
                            Master the fretboard with precision
                        </Text>
                    </View>

                    <View className="space-y-6">
                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-foreground">Email</Text>
                            <View className="relative justify-center">
                                <View className="absolute left-4 z-10">
                                    <Mail size={18} color={errors.email ? "#F87171" : "#A1A1AA"} />
                                </View>
                                <TextInput
                                    placeholder="you@example.com"
                                    placeholderTextColor="#A1A1AA"
                                    className={`w-full bg-input-background border rounded-lg pl-12 pr-4 py-3 text-white focus:border-primary ${
                                        errors.email ? 'border-destructive' : 'border-border'
                                    }`}
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
                            {errors.email && (
                                <Text className="text-destructive text-xs mt-1">{errors.email}</Text>
                            )}
                        </View>

                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-foreground">Password</Text>
                            <View className="relative justify-center">
                                <View className="absolute left-4 z-10">
                                    <Lock size={18} color={errors.password ? "#F87171" : "#A1A1AA"} />
                                </View>
                                <TextInput
                                    placeholder="••••••••"
                                    placeholderTextColor="#A1A1AA"
                                    className={`w-full bg-input-background border rounded-lg pl-12 pr-4 py-3 text-white focus:border-primary ${
                                        errors.password ? 'border-destructive' : 'border-border'
                                    }`}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (errors.password) setErrors({ ...errors, password: undefined });
                                    }}
                                    secureTextEntry
                                    editable={!loading}
                                />
                            </View>
                            {errors.password && (
                                <Text className="text-destructive text-xs mt-1">{errors.password}</Text>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            disabled={loading}
                            className={`w-full py-3 rounded-lg items-center ${loading ? 'bg-primary/60' : 'bg-primary'}`}
                        >
                            {loading ? (
                                <ActivityIndicator color="#121212" />
                            ) : (
                                <Text className="text-primary-foreground font-semibold text-base">Sign In</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-[1px] bg-border" />
                        <Text className="mx-4 text-sm text-muted-foreground">or continue with</Text>
                        <View className="flex-1 h-[1px] bg-border" />
                    </View>

                    <View className="gap-3">
                        <TouchableOpacity
                            className="w-full bg-card border border-border py-3 rounded-lg flex-row items-center justify-center gap-3"
                            activeOpacity={0.7}
                            disabled={loading}
                        >
                            <Apple size={20} color="#FFFFFF" />
                            <Text className="text-foreground font-medium">Continue with Apple</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-full bg-card border border-border py-3 rounded-lg flex-row items-center justify-center gap-3"
                            activeOpacity={0.7}
                            disabled={loading}
                        >
                            <Text className="text-foreground font-bold text-lg">G</Text>
                            <Text className="text-foreground font-medium">Continue with Google</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center mt-8 mb-4">
                        <Text className="text-sm text-muted-foreground">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
                            <Text className="text-primary font-medium">Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}