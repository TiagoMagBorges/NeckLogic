import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, Zap, Flame } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { styles } from './styles';

type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export default function OnboardingScreen() {
    const { completeOnboarding } = useAuth();
    const { t } = useTranslation();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSelectLevel = async (level: Level) => {
        setIsProcessing(true);
        try {
            if (level === 'INTERMEDIATE') {
                await api.post('/sections/1/skip');
            } else if (level === 'ADVANCED') {
                await api.post('/sections/1/skip');
                await api.post('/sections/2/skip');
            }
            await completeOnboarding();
        } catch (error) {
            console.error(error);
            Alert.alert(t('onboarding.errorTitle'), t('onboarding.errorDesc'));
            setIsProcessing(false);
        }
    };

    return (
        <SafeAreaView className={styles.safeArea}>
            <View className={styles.container}>
                <View className={styles.header}>
                    <Text className={styles.title}>{t('onboarding.title')}</Text>
                    <Text className={styles.subtitle}>
                        {t('onboarding.subtitle')}
                    </Text>
                </View>

                <View className={styles.optionsContainer}>
                    <TouchableOpacity
                        className={`${styles.optionButton} ${isProcessing ? styles.optionButtonDisabled : ''}`}
                        onPress={() => handleSelectLevel('BEGINNER')}
                        disabled={isProcessing}
                    >
                        <View className={styles.optionIconContainer}>
                            <Target size={24} color="#00D9FF" />
                        </View>
                        <View className={styles.optionTextContainer}>
                            <Text className={styles.optionTitle}>{t('onboarding.beginner')}</Text>
                            <Text className={styles.optionDescription}>{t('onboarding.beginnerDesc')}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`${styles.optionButton} ${isProcessing ? styles.optionButtonDisabled : ''}`}
                        onPress={() => handleSelectLevel('INTERMEDIATE')}
                        disabled={isProcessing}
                    >
                        <View className={styles.optionIconContainer}>
                            <Zap size={24} color="#00D9FF" />
                        </View>
                        <View className={styles.optionTextContainer}>
                            <Text className={styles.optionTitle}>{t('onboarding.intermediate')}</Text>
                            <Text className={styles.optionDescription}>{t('onboarding.intermediateDesc')}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`${styles.optionButton} ${isProcessing ? styles.optionButtonDisabled : ''}`}
                        onPress={() => handleSelectLevel('ADVANCED')}
                        disabled={isProcessing}
                    >
                        <View className={styles.optionIconContainer}>
                            <Flame size={24} color="#00D9FF" />
                        </View>
                        <View className={styles.optionTextContainer}>
                            <Text className={styles.optionTitle}>{t('onboarding.advanced')}</Text>
                            <Text className={styles.optionDescription}>{t('onboarding.advancedDesc')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {isProcessing && (
                    <View className={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#00D9FF" />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}