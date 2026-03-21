import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Zap, Moon, Sun, Flame, SlidersHorizontal, ChevronRight, Globe } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { styles } from './styles';
import { RootStackParamList } from '../../navigation/Routes';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LanguageSelector } from '../../components/LanguageSelector';

export default function ProfileScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user, xp, level, streak, tuning } = useAuth();
    const { isDarkTheme, toggleTheme } = useTheme();
    const { t } = useTranslation();

    const getInitials = (name?: string) => {
        if (!name) return 'US';
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const stats = [
        { label: t('profile.totalXp'), value: xp.toString(), icon: Flame, color: '#00D9FF' },
        { label: t('profile.level'), value: level.toString(), icon: Trophy, color: '#A855F7' },
        { label: t('profile.streak'), value: `${streak} ${t('profile.days')}`, icon: Zap, color: '#10B981' },
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
                    <Text className={styles.nameText}>{user?.name || t('profile.defaultUser')}</Text>
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
                    <Text className={styles.sectionTitle}>{t('profile.fretboardLeveling')}</Text>

                    <View className={styles.progressRow}>
                        <View className={styles.chartPlaceholder}>
                            <Text className={styles.chartValue}>{Math.round(xpPercentage)}%</Text>
                        </View>

                        <View className={styles.progressDetails}>
                            <View className={styles.progressHeader}>
                                <Text className={styles.progressLabel}>{t('profile.nextLevel')}</Text>
                                <Text className={styles.progressFraction}>{xpInCurrentLevel} / {xpRequiredForNextLevel} XP</Text>
                            </View>

                            <View className={styles.progressBarBg}>
                                <View className={styles.progressBarFill} style={{ width: `${xpPercentage}%` }} />
                            </View>

                            <Text className={styles.progressDescription}>
                                {t('profile.keepGoing')}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className={styles.settingsSection}>

                    <TouchableOpacity
                        className="flex-row items-center justify-between bg-card border border-border/10 p-5 rounded-xl mb-4"
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('GuitarTuning')}
                    >
                        <View className="flex-row items-center">
                            <SlidersHorizontal size={24} color="#00D9FF" />
                            <View className="ml-3">
                                <Text className="font-medium text-foreground">{t('profile.tuning')}</Text>
                                <Text className="text-sm text-muted-foreground mt-0.5 tracking-widest">{tuning.join(' ')}</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color="#3F3F46" />
                    </TouchableOpacity>

                    <View className={styles.themeCard}>
                        <View className={styles.themeInfo}>
                            {isDarkTheme ? (
                                <Moon size={24} color="#00D9FF" />
                            ) : (
                                <Sun size={24} color="#00B8D4" />
                            )}
                            <View className={styles.themeTextContainer}>
                                <Text className={styles.themeTitle}>{t('profile.theme')}</Text>
                                <Text className={styles.themeDesc}>
                                    {isDarkTheme ? t('profile.darkMode') : t('profile.lightMode')}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            trackColor={{ false: '#E5E5E5', true: '#00D9FF' }}
                            thumbColor={'#FFFFFF'}
                            ios_backgroundColor="#E5E5E5"
                            onValueChange={toggleTheme}
                            value={isDarkTheme}
                        />
                    </View>

                    <View className="flex-row items-center justify-between bg-card border border-border/10 p-5 rounded-xl mt-4 mb-4">
                        <View className="flex-row items-center">
                            <Globe size={24} color="#00D9FF" />
                            <View className="ml-3">
                                <Text className="font-medium text-foreground">{t('profile.language')}</Text>
                            </View>
                        </View>
                        <LanguageSelector />
                    </View>

                    <TouchableOpacity
                        className={styles.accountButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('AccountSettings')}
                    >
                        <Text className={styles.accountButtonText}>{t('profile.accountSettings')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}