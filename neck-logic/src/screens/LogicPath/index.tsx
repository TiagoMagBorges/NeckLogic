import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Lock, FastForward, Layers, Compass } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { usePath } from '../../hooks/usePath';
import { useProgress } from '../../contexts/ProgressContext';
import { useTheme } from '../../contexts/ThemeContext';
import { styles, getNodeTheme } from './styles';
import { RootStackParamList } from '../../navigation/Routes';
import { MainTabParamList } from '../../navigation/MainTabs';
import { api } from '../../services/api';
import { StorageService, StorageKeys } from '../../services/storage';
import { TrackDTO } from '../../types/Track';
import { SkipSectionModal } from '../../components/SkipSectionModal';

type LogicPathScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'LogicPath'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function LogicPathScreen() {
    const navigation = useNavigation<LogicPathScreenNavigationProp>();
    const route = useRoute<RouteProp<MainTabParamList, 'LogicPath'>>();
    const { xp, level } = useProgress();
    const { isDarkTheme } = useTheme();
    const { t } = useTranslation();

    const [activeTrackId, setActiveTrackId] = useState<number | undefined>(route.params?.trackId);
    const [activeTrackTitle, setActiveTrackTitle] = useState<string | undefined>(route.params?.trackTitle);
    const { modules, loading, refetch } = usePath(activeTrackId);

    const [skipModalVisible, setSkipModalVisible] = useState(false);
    const [selectedSection, setSelectedSection] = useState<{ id: number; title: string } | null>(null);
    const [isSkipping, setIsSkipping] = useState(false);

    const [switcherVisible, setSwitcherVisible] = useState(false);
    const [enrolledTracks, setEnrolledTracks] = useState<TrackDTO[]>([]);
    const [loadingTracks, setLoadingTracks] = useState(false);

    useEffect(() => {
        if (route.params?.trackId) {
            setActiveTrackId(route.params.trackId);
            setActiveTrackTitle(route.params.trackTitle);
            StorageService.setItem(
              StorageKeys.SELECTED_TRACK,
              JSON.stringify({ id: route.params.trackId, title: route.params.trackTitle })
            );
        }
    }, [route.params?.trackId, route.params?.trackTitle]);

    useEffect(() => {
        if (!route.params?.trackId) {
            (async () => {
                const stored = await StorageService.getItem(StorageKeys.SELECTED_TRACK);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setActiveTrackId(parsed.id);
                    setActiveTrackTitle(parsed.title);
                }
            })();
        }
    }, []);

    const openSwitcher = useCallback(async () => {
        setSwitcherVisible(true);
        setLoadingTracks(true);
        try {
            const response = await api.get<TrackDTO[]>('/tracks');
            setEnrolledTracks(response.data.filter((track) => track.enrolled));
        } catch (error) {
            Alert.alert(t('common.error'), t('tracks.errorLoad'));
        } finally {
            setLoadingTracks(false);
        }
    }, [t]);

    async function handleSwitchTrack(track: TrackDTO) {
        setActiveTrackId(track.id);
        setActiveTrackTitle(track.title);
        await StorageService.setItem(StorageKeys.SELECTED_TRACK, JSON.stringify({ id: track.id, title: track.title }));
        setSwitcherVisible(false);
    }

    function handleExploreMore() {
        setSwitcherVisible(false);
        navigation.navigate('TrackSelection');
    }

    if (loading) {
        return (
          <View className={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00D9FF" />
          </View>
        );
    }

    const sectionsGrouped = modules.reduce((acc, module) => {
        const key = module.sectionId || module.sectionTitle;
        if (!acc[key]) {
            acc[key] = {
                id: module.sectionId,
                title: module.sectionTitle,
                description: module.sectionDescription,
                modules: []
            };
        }
        acc[key].modules.push(module);
        return acc;
    }, {} as Record<string, any>);

    const sections = Object.values(sectionsGrouped);

    const completedCount = modules.filter(m => m.status === 'COMPLETED').length;
    const currentCount = modules.filter(m => m.status === 'CURRENT').length;
    const lockedCount = modules.filter(m => m.status === 'LOCKED').length;

    const currentXp = xp || 0;
    const currentLevel = level || 1;

    const currentLevelBaseXp = Math.pow(10 * (currentLevel - 1), 2);
    const nextLevelXp = Math.pow(10 * currentLevel, 2);
    const xpInCurrentLevel = currentXp - currentLevelBaseXp;
    const xpRequiredForNextLevel = nextLevelXp - currentLevelBaseXp;
    const xpPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNextLevel) * 100));

    const handleSkipSection = async () => {
        if (!selectedSection?.id) {
            Alert.alert(t('path.warningTitle'), t('path.warningDesc'));
            return;
        }

        setIsSkipping(true);
        try {
            await api.post(`/sections/${selectedSection.id}/skip`);
            setSkipModalVisible(false);
            if (refetch) refetch();
        } catch (error) {
            Alert.alert(t('path.errorTitle'), t('path.errorDesc'));
        } finally {
            setIsSkipping(false);
        }
    };

    const openSkipModal = (sectionId: number, sectionTitle: string) => {
        setSelectedSection({ id: sectionId, title: sectionTitle });
        setSkipModalVisible(true);
    };

    return (
      <SafeAreaView className={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
              <View className={styles.contentContainer}>
                  <View className={styles.headerContainer}>
                      <View className={styles.headerTexts}>
                          <Text className={styles.title}>{activeTrackTitle ?? t('path.title')}</Text>
                          <Text className={styles.subtitle}>{t('path.subtitle')}</Text>
                      </View>

                      <TouchableOpacity
                        className={styles.switchTrackButton}
                        onPress={openSwitcher}
                      >
                          <Layers size={20} color="#00D9FF" />
                      </TouchableOpacity>
                  </View>

                  <View className={styles.levelCard}>
                      <View className={styles.levelHeader}>
                          <Text className={styles.levelText}>{t('path.level')} {currentLevel}</Text>
                          <Text className={styles.xpText}>{xpInCurrentLevel} / {xpRequiredForNextLevel} XP</Text>
                      </View>
                      <View className={styles.progressBarBg}>
                          <View
                            className={styles.progressBarFill}
                            style={{ width: `${xpPercentage}%` }}
                          />
                      </View>
                  </View>

                  <View className={styles.pathWrapper}>
                      <View className={styles.verticalLine} />

                      {sections.map((section, sectionIndex) => (
                        <View key={`section-${sectionIndex}`} className={styles.sectionGroup}>

                            <View className={styles.sectionHeader}>
                                <View className="flex-1">
                                    <Text className={styles.sectionTitleText}>{section.title}</Text>
                                    <Text className={styles.sectionDescText}>{section.description}</Text>
                                </View>

                                <TouchableOpacity
                                  className={styles.skipButton}
                                  onPress={() => openSkipModal(section.id, section.title)}
                                >
                                    <FastForward size={20} color="#00D9FF" />
                                </TouchableOpacity>
                            </View>

                            {section.modules.map((node: any) => {
                                const theme = getNodeTheme(node.status, isDarkTheme);
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
                                            <Text className={styles.nodeSubtitle}>{t('path.continue')}</Text>
                                          )}
                                      </View>

                                      {node.status === 'CURRENT' && node.percentage > 0 && (
                                        <Text className={styles.percentageText}>{node.percentage}%</Text>
                                      )}
                                  </View>
                                );
                            })}
                        </View>
                      ))}
                  </View>

                  <View className={styles.statsCard}>
                      <Text className={styles.statsTitle}>{t('path.progressTitle')}</Text>
                      <View className={styles.statsRow}>
                          <View className={styles.statItem}>
                              <Text className={styles.statValuePrimary}>{completedCount}</Text>
                              <Text className={styles.statLabel}>{t('path.completed')}</Text>
                          </View>
                          <View className={styles.statItem}>
                              <Text className={styles.statValuePrimary}>{currentCount}</Text>
                              <Text className={styles.statLabel}>{t('path.inProgress')}</Text>
                          </View>
                          <View className={styles.statItem}>
                              <Text className={styles.statValueMuted}>{lockedCount}</Text>
                              <Text className={styles.statLabel}>{t('path.remaining')}</Text>
                          </View>
                      </View>
                  </View>
              </View>
          </ScrollView>

          <SkipSectionModal
            visible={skipModalVisible}
            sectionTitle={selectedSection?.title}
            isSkipping={isSkipping}
            onClose={() => setSkipModalVisible(false)}
            onConfirm={handleSkipSection}
          />

          <Modal visible={switcherVisible} transparent animationType="fade" onRequestClose={() => setSwitcherVisible(false)}>
              <TouchableOpacity
                className={styles.switcherBackdrop}
                activeOpacity={1}
                onPress={() => setSwitcherVisible(false)}
              >
                  <View className={styles.switcherCard}>
                      <Text className={styles.switcherTitle}>{t('tracks.switchTrackTitle')}</Text>

                      {loadingTracks ? (
                        <ActivityIndicator size="small" color="#00D9FF" style={{ marginVertical: 16 }} />
                      ) : enrolledTracks.length === 0 ? (
                        <Text className={styles.switcherEmpty}>{t('tracks.noEnrolledTracks')}</Text>
                      ) : (
                        enrolledTracks.map((track) => (
                          <TouchableOpacity
                            key={track.id}
                            className={styles.switcherItem}
                            onPress={() => handleSwitchTrack(track)}
                          >
                              <Text className={styles.switcherItemText}>{track.title}</Text>
                              {track.id === activeTrackId && <Check size={18} color="#00D9FF" />}
                          </TouchableOpacity>
                        ))
                      )}

                      <TouchableOpacity className={styles.switcherExploreButton} onPress={handleExploreMore}>
                          <Compass size={16} color="#00D9FF" />
                          <Text className={styles.switcherExploreText}>{t('tracks.exploreMore')}</Text>
                      </TouchableOpacity>
                  </View>
              </TouchableOpacity>
          </Modal>
      </SafeAreaView>
    );
}