import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Lock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { usePath } from '../../hooks/usePath';
import { useAuth } from '../../contexts/AuthContext';
import { styles, getNodeTheme } from './styles';
import { RootStackParamList } from '../../navigation/Routes';

type LogicPathScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LogicPath'>;

export default function LogicPathScreen() {
    const navigation = useNavigation<LogicPathScreenNavigationProp>();
    const { modules, loading } = usePath();
    const { signOut } = useAuth();

    if (loading) {
        return (
            <View className={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00D9FF" />
            </View>
        );
    }

    const completedCount = modules.filter(m => m.status === 'COMPLETED').length;
    const currentCount = modules.filter(m => m.status === 'CURRENT').length;
    const lockedCount = modules.filter(m => m.status === 'LOCKED').length;

    return (
        <SafeAreaView className={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View className={styles.contentContainer}>
                    <View className={styles.headerContainer}>
                        <View className={styles.headerTexts}>
                            <Text className={styles.title}>The Logic Path</Text>
                            <Text className={styles.subtitle}>Your journey to fretboard mastery</Text>
                        </View>

                        <TouchableOpacity onPress={signOut} className={styles.logoutButton}>
                            <Text className={styles.logoutText}>Sair</Text>
                        </TouchableOpacity>
                    </View>

                    <View className={styles.pathWrapper}>
                        <View className={styles.verticalLine} />

                        {modules.map((node) => {
                            const theme = getNodeTheme(node.status);
                            const isClickable = node.status !== 'LOCKED';

                            return (
                                <View key={node.id} className={styles.nodeRow}>
                                    <TouchableOpacity
                                        disabled={!isClickable}
                                        activeOpacity={0.7}
                                        className={`${styles.nodeBase} ${theme.bgClass}`}
                                        onPress={() => navigation.navigate('Lesson', {
                                            moduleId: node.id,
                                            title: node.title
                                        })}
                                    >
                                        {node.status === 'COMPLETED' ? (
                                            <Check size={28} color={theme.iconColor} strokeWidth={3} />
                                        ) : node.status === 'LOCKED' ? (
                                            <Lock size={20} color={theme.iconColor} />
                                        ) : (
                                            <Text className={styles.nodeText}>
                                                {node.orderIndex}
                                            </Text>
                                        )}
                                    </TouchableOpacity>

                                    <View className={styles.nodeInfoContainer}>
                                        <Text className={`${styles.nodeTitleBase} ${theme.textOpacity}`}>
                                            {node.title}
                                        </Text>
                                        {node.status === 'CURRENT' && (
                                            <Text className={styles.nodeSubtitle}>Continue learning</Text>
                                        )}
                                    </View>

                                    {node.status === 'CURRENT' && node.percentage > 0 && (
                                        <Text className={styles.percentageText}>{node.percentage}%</Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>

                    <View className={styles.statsCard}>
                        <Text className={styles.statsTitle}>Your Progress</Text>
                        <View className={styles.statsRow}>
                            <View className={styles.statItem}>
                                <Text className={styles.statValuePrimary}>{completedCount}</Text>
                                <Text className={styles.statLabel}>COMPLETED</Text>
                            </View>
                            <View className={styles.statItem}>
                                <Text className={styles.statValuePrimary}>{currentCount}</Text>
                                <Text className={styles.statLabel}>IN PROGRESS</Text>
                            </View>
                            <View className={styles.statItem}>
                                <Text className={styles.statValueMuted}>{lockedCount}</Text>
                                <Text className={styles.statLabel}>REMAINING</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}