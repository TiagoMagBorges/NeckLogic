import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { api } from '../../services/api';
import { TrackDTO } from '../../types/Track';
import { RootStackParamList } from '../../navigation/Routes';
import { styles } from './styles';

function formatPrice(priceCents: number | null, language: string): string {
  const value = (priceCents ?? 0) / 100;
  if (language.startsWith('pt')) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }
  return `$${value.toFixed(2)}`;
}

export default function TrackSelectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t, i18n } = useTranslation();

  const [tracks, setTracks] = useState<TrackDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTracks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tracks;

    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(query) ||
        track.ownerName.toLowerCase().includes(query)
    );
  }, [tracks, searchQuery]);

  const fetchTracks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<TrackDTO[]>('/tracks');
      setTracks(response.data);
    } catch (error) {
      Alert.alert(t('common.error'), t('tracks.errorLoad'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      fetchTracks();
    }, [fetchTracks])
  );

  async function enrollAndOpen(track: TrackDTO) {
    try {
      if (!track.enrolled) {
        setEnrollingId(track.id);
        await api.post(`/tracks/${track.id}/enroll`);
      }

      navigation.navigate('MainTabs', {
        screen: 'LogicPath',
        params: { trackId: track.id, trackTitle: track.title },
      });
    } catch (error) {
      Alert.alert(t('common.error'), t('tracks.errorEnroll'));
    } finally {
      setEnrollingId(null);
    }
  }

  function handleSelect(track: TrackDTO) {
    if (!track.enrolled && track.paid) {
      Alert.alert(
        t('tracks.confirmPurchaseTitle'),
        t('tracks.confirmPurchaseDesc', { price: formatPrice(track.priceCents, i18n.language) }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('tracks.confirmPurchaseConfirm'), onPress: () => enrollAndOpen(track) },
        ]
      );
      return;
    }

    enrollAndOpen(track);
  }

  if (loading) {
    return (
      <View className={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D9FF" />
      </View>
    );
  }

  return (
    <SafeAreaView className={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View className={styles.contentContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} className={styles.backButton}>
            <ArrowLeft size={18} color="#A1A1AA" />
            <Text className={styles.backText}>{t('tracks.back')}</Text>
          </TouchableOpacity>

          <View className={styles.headerContainer}>
            <Text className={styles.title}>{t('tracks.title')}</Text>
            <Text className={styles.subtitle}>{t('tracks.subtitle')}</Text>
          </View>

          <View className={styles.searchWrapper}>
            <Search size={18} color="#A1A1AA" />
            <TextInput
              placeholder={t('tracks.searchPlaceholder')}
              placeholderTextColor="#A1A1AA"
              className={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
          </View>

          {tracks.length === 0 && <Text className={styles.emptyText}>{t('tracks.empty')}</Text>}

          {tracks.length > 0 && filteredTracks.length === 0 && (
            <Text className={styles.emptyText}>{t('tracks.searchEmpty')}</Text>
          )}

          {filteredTracks.map((track) => (
            <View key={track.id} className={styles.card}>
              <View className={styles.cardHeader}>
                <Text className={styles.cardTitle}>{track.title}</Text>
                {track.official && (
                  <Text className={`${styles.badge} ${styles.badgeOfficial}`}>
                    {t('tracks.official')}
                  </Text>
                )}
                <Text className={`${styles.badge} ${track.paid ? styles.badgePaid : styles.badgeFree}`}>
                  {track.paid ? formatPrice(track.priceCents, i18n.language) : t('tracks.free')}
                </Text>
              </View>

              {!!track.description && (
                <Text className={styles.cardDescription}>{track.description}</Text>
              )}

              <TouchableOpacity
                disabled={enrollingId === track.id}
                onPress={() => handleSelect(track)}
                className={`${styles.actionButton} ${track.enrolled ? styles.actionButtonEnrolled : styles.actionButtonNew}`}
              >
                {enrollingId === track.id ? (
                  <ActivityIndicator color={track.enrolled ? '#FFFFFF' : '#121212'} />
                ) : (
                  <Text className={track.enrolled ? styles.actionTextEnrolled : styles.actionTextNew}>
                    {track.enrolled ? t('tracks.continue') : t('tracks.start')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}