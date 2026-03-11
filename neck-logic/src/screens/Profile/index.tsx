import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Zap, Moon, Sun, Flame, CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from './styles';
import { RootStackParamList } from '../../navigation/Routes';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user, xp, level, streak } = useAuth();

    const [isDarkTheme, setIsDarkTheme] = useState(true);

    const toggleTheme = () => setIsDarkTheme(previousState => !previousState);

    const getInitials = (name?: string) => {
        if (!name) return 'US';
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const stats = [
        { label: 'Total XP', value: xp.toString(), icon: Flame, color: '#00D9FF' },
        { label: 'Level', value: level.toString(), icon: Trophy, color: '#A855F7' },
        { label: 'Ofensiva', value: `${streak} dias`, icon: Zap, color: '#10B981' },
    ];

    const currentLevelBaseXp = Math.pow(10 * (level - 1), 2);
    const nextLevelXp = Math.pow(10 * level, 2);
    const xpInCurrentLevel = xp - currentLevelBaseXp;
    const xpRequiredForNextLevel = nextLevelXp - currentLevelBaseXp;
    const xpPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNextLevel) * 100));

    return (
        <SafeAreaView className={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View className={styles.header}>
                    <View className={styles.avatarContainer}>
                        <Text className={styles.avatarText}>{getInitials(user?.name)}</Text>
                    </View>
                    <Text className={styles.nameText}>{user?.name || 'Usuário'}</Text>
                    <Text className={styles.emailText}>{user?.email}</Text>
                </View>

                <View className={styles.statsGrid}>
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const isLast = index === stats.length - 1;

                        return (
                            <View
                                key={index}
                                className={`${styles.statCard} ${isLast ? 'w-full flex-row items-center justify-between' : 'w-[48%]'}`}
                            >
                                <View className={styles.statHeader}>
                                    <Icon size={16} color={stat.color} />
                                    <Text className={styles.statLabel}>{stat.label}</Text>
                                </View>
                                <Text className={styles.statValue}>{stat.value}</Text>
                            </View>
                        );
                    })}
                </View>

                <View className={styles.progressSection}>
                    <Text className={styles.sectionTitle}>Nivelamento de Fretboard</Text>

                    <View className={styles.progressRow}>
                        <View className={styles.chartPlaceholder}>
                            <Text className={styles.chartValue}>{Math.round(xpPercentage)}%</Text>
                        </View>

                        <View className={styles.progressDetails}>
                            <View className={styles.progressHeader}>
                                <Text className={styles.progressLabel}>Próximo Nível</Text>
                                <Text className={styles.progressFraction}>{xpInCurrentLevel} / {xpRequiredForNextLevel} XP</Text>
                            </View>

                            <View className={styles.progressBarBg}>
                                <View className={styles.progressBarFill} style={{ width: `${xpPercentage}%` }} />
                            </View>

                            <Text className={styles.progressDescription}>
                                Continue a trilha para expandir seu vocabulário no braço.
                            </Text>
                        </View>
                    </View>
                </View>

                <View className={styles.settingsSection}>
                    <View className={styles.themeCard}>
                        <View className={styles.themeInfo}>
                            {isDarkTheme ? (
                                <Moon size={24} color="#00D9FF" />
                            ) : (
                                <Sun size={24} color="#00D9FF" />
                            )}
                            <View className={styles.themeTextContainer}>
                                <Text className={styles.themeTitle}>Theme</Text>
                                <Text className={styles.themeDesc}>
                                    {isDarkTheme ? 'Dark Mode' : 'Light Mode'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            trackColor={{ false: '#3F3F46', true: '#00D9FF' }}
                            thumbColor={'#FFFFFF'}
                            ios_backgroundColor="#3F3F46"
                            onValueChange={toggleTheme}
                            value={isDarkTheme}
                        />
                    </View>

                    <TouchableOpacity
                        className={styles.accountButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('AccountSettings')}
                    >
                        <Text className={styles.accountButtonText}>Account Settings</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}