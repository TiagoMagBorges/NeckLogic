import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Apple, ArrowLeft, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen() {
    const navigation = useNavigation<any>();
    const { signUp, loading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    async function handleCreateAccount() {
        if (!termsAccepted) {
            alert('Please accept the terms');
            return;
        }

        try {
            await signUp({name, email, password});

            alert('Account created! You can now login.');
            navigation.navigate('Login');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, padding: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                        className="flex-row items-center gap-2 mb-8 self-start"
                    >
                        <ArrowLeft size={18} color="#A1A1AA" />
                        <Text className="text-sm text-muted-foreground">Back to login</Text>
                    </TouchableOpacity>

                    <View className="items-center mb-12">
                        <Text className="text-4xl font-bold tracking-tight text-foreground mb-2">
                            Neck<Text className="text-primary">Logic</Text>
                        </Text>
                        <Text className="text-muted-foreground text-sm">
                            Start your music theory journey
                        </Text>
                    </View>

                    <View className="space-y-6">
                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-foreground">Full Name</Text>
                            <View className="relative justify-center">
                                <View className="absolute left-4 z-10">
                                    <User size={18} color="#A1A1AA" />
                                </View>
                                <TextInput
                                    placeholder="John Doe"
                                    placeholderTextColor="#A1A1AA"
                                    className="w-full bg-input-background border border-border rounded-lg pl-12 pr-4 py-3 text-white focus:border-primary"
                                    value={name}
                                    onChangeText={setName}
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-foreground">Email</Text>
                            <View className="relative justify-center">
                                <View className="absolute left-4 z-10">
                                    <Mail size={18} color="#A1A1AA" />
                                </View>
                                <TextInput
                                    placeholder="you@example.com"
                                    placeholderTextColor="#A1A1AA"
                                    className="w-full bg-input-background border border-border rounded-lg pl-12 pr-4 py-3 text-white focus:border-primary"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-foreground">Password</Text>
                            <View className="relative justify-center">
                                <View className="absolute left-4 z-10">
                                    <Lock size={18} color="#A1A1AA" />
                                </View>
                                <TextInput
                                    placeholder="••••••••"
                                    placeholderTextColor="#A1A1AA"
                                    className="w-full bg-input-background border border-border rounded-lg pl-12 pr-4 py-3 text-white focus:border-primary"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        <View className="flex-row items-start gap-3 mt-2">
                            <TouchableOpacity
                                onPress={() => setTermsAccepted(!termsAccepted)}
                                disabled={loading}
                                className={`mt-1 w-5 h-5 rounded border items-center justify-center ${
                                    termsAccepted ? 'bg-primary border-primary' : 'bg-input-background border-border'
                                }`}
                            >
                                {termsAccepted && <Check size={14} color="#121212" />}
                            </TouchableOpacity>

                            <View className="flex-1 flex-row flex-wrap">
                                <Text className="text-sm text-muted-foreground">I agree to the </Text>
                                <TouchableOpacity disabled={loading}>
                                    <Text className="text-sm text-primary font-medium">Terms of Service</Text>
                                </TouchableOpacity>
                                <Text className="text-sm text-muted-foreground"> and </Text>
                                <TouchableOpacity disabled={loading}>
                                    <Text className="text-sm text-primary font-medium">Privacy Policy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleCreateAccount}
                            activeOpacity={0.8}
                            disabled={loading}
                            className={`w-full py-3 rounded-lg items-center ${loading ? 'bg-primary/60' : 'bg-primary'}`}
                        >
                            {loading ? (
                                <ActivityIndicator color="#121212" />
                            ) : (
                                <Text className="text-primary-foreground font-semibold text-base">Create Account</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-[1px] bg-border" />
                        <Text className="mx-4 text-sm text-muted-foreground">or sign up with</Text>
                        <View className="flex-1 h-[1px] bg-border" />
                    </View>

                    <View className="gap-3">
                        <TouchableOpacity
                            className="w-full bg-card border border-border py-3 rounded-lg flex-row items-center justify-center gap-3"
                            activeOpacity={0.7}
                            disabled={loading}
                        >
                            <Apple size={20} color="#FFFFFF" />
                            <Text className="text-foreground font-medium">Sign up with Apple</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-full bg-card border border-border py-3 rounded-lg flex-row items-center justify-center gap-3"
                            activeOpacity={0.7}
                            disabled={loading}
                        >
                            <Text className="text-foreground font-bold text-lg">G</Text>
                            <Text className="text-foreground font-medium">Sign up with Google</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center mt-8 mb-4">
                        <Text className="text-sm text-muted-foreground">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
                            <Text className="text-primary font-medium">Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}