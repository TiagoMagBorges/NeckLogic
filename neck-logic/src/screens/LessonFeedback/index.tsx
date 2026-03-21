import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Music, Flame, Crosshair } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../../navigation/Routes';
import { styles } from './styles';

type LessonFeedbackRouteProp = RouteProp<RootStackParamList, 'LessonFeedback'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'LessonFeedback'>;

export default function LessonFeedbackScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<LessonFeedbackRouteProp>();
    const { t } = useTranslation();

    const { xpGained, leveledUp, currentLevel, mistakesCount, drillCount } = route.params;

    const fadeAnimNote1 = useRef(new Animated.Value(0)).current;
    const fadeAnimNote2 = useRef(new Animated.Value(0)).current;
    const fadeAnimNote3 = useRef(new Animated.Value(0)).current;

    const accuracy = useMemo(() => {
        if (drillCount === 0) return 100;
        const correctHits = Math.max(0, drillCount - mistakesCount);
        return Math.round((correctHits / drillCount) * 100);
    }, [mistakesCount, drillCount]);

    const activeNotes = useMemo(() => {
        if (mistakesCount === 0) return 3;
        if (mistakesCount <= 2) return 2;
        return 1;
    }, [mistakesCount]);

    useEffect(() => {
        const animations = [
            Animated.spring(fadeAnimNote1, { toValue: activeNotes >= 1 ? 1 : 0, tension: 50, friction: 8, useNativeDriver: true }),
            Animated.spring(fadeAnimNote2, { toValue: activeNotes >= 2 ? 1 : 0, tension: 50, friction: 8, useNativeDriver: true }),
            Animated.spring(fadeAnimNote3, { toValue: activeNotes === 3 ? 1 : 0, tension: 50, friction: 8, useNativeDriver: true })
        ];

        Animated.stagger(150, animations).start();
    }, [activeNotes]);

    function handleContinue() {
        navigation.navigate('MainTabs');
    }

    return (
        <SafeAreaView className={styles.safeArea}>
            <View className={styles.container}>

                <Text className={styles.title}>
                    {mistakesCount === 0 ? t('feedback.perfect') : t('feedback.completed')}
                </Text>
                <Text className={styles.subtitle}>
                    {t('feedback.expanding')}
                </Text>

                <View className={styles.notesContainer}>
                    {[fadeAnimNote1, fadeAnimNote2, fadeAnimNote3].map((animValue, index) => {
                        const noteNum = index + 1;
                        const isCenter = noteNum === 2;
                        const size = isCenter ? 64 : 48;

                        const iconScale = animValue.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [1, 1.2, 1.1]
                        });

                        return (
                            <View
                                key={noteNum}
                                className={`${styles.noteWrapper} ${isCenter ? styles.noteCenter : ''}`}
                            >
                                <View style={{ width: size, height: size }}>
                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                                        <Music size={size} color="#3F3F46" strokeWidth={2} />
                                    </View>

                                    <Animated.View
                                        style={{
                                            position: 'absolute',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            alignItems: 'center', justifyContent: 'center',
                                            opacity: animValue,
                                            transform: [{ scale: iconScale }]
                                        }}
                                    >
                                        <Music size={size} color="#00D9FF" strokeWidth={2} />
                                    </Animated.View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View className={styles.statsGrid}>
                    <View className={styles.statCard}>
                        <Flame size={24} color="#00D9FF" className="mb-2" />
                        <Text className={styles.statValuePrimary}>+{xpGained}</Text>
                        <Text className={styles.statLabel}>{t('feedback.xpGained')}</Text>
                    </View>

                    <View className={styles.statCard}>
                        <Crosshair size={24} color="#A1A1AA" className="mb-2" />
                        <Text className={styles.statValueSecondary}>{accuracy}%</Text>
                        <Text className={styles.statLabel}>{t('feedback.accuracy')}</Text>
                    </View>
                </View>

                {leveledUp && (
                    <View className={styles.levelUpCard}>
                        <Text className={styles.levelUpTitle}>{t('feedback.levelUp')}</Text>
                        <Text className={styles.levelUpText}>
                            {t('feedback.reachedLevel')} {currentLevel}.
                        </Text>
                    </View>
                )}

            </View>

            <View className={styles.footer}>
                <TouchableOpacity
                    className={styles.button}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    <Text className={styles.buttonText}>{t('feedback.continue')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}