import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { styles } from './styles';
import { CircleOfFifthsWheel } from '../../components/CircleOfFifthsWheel';
import { HarmonicFieldWheel } from '../../components/HarmonicFieldWheel';
import { getRelativeKey } from '../../core/MusicEngine';

export default function HarmonicWheelScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [selectedKey, setSelectedKey] = useState('C');

  const fifthsSize = Math.min(width - 48, 320);
  const fieldSize = Math.min(width - 48, 280);

  const relativeMinor = useMemo(() => getRelativeKey(selectedKey, 'major').root, [selectedKey]);

  return (
    <SafeAreaView className={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View className={styles.header}>
          <Text className={styles.title}>{t('harmonicWheel.title')}</Text>
          <Text className={styles.subtitle}>{t('harmonicWheel.subtitle')}</Text>
        </View>

        <View className={styles.card}>
          <Text className={styles.cardTitle}>{t('harmonicWheel.circleOfFifths')}</Text>

          <View className={styles.wheelContainer}>
            <CircleOfFifthsWheel
              size={fifthsSize}
              selectedKey={selectedKey}
              onSelectKey={setSelectedKey}
            />
          </View>

          <Text className={styles.selectedKeyText}>
            {selectedKey} {t('harmonicWheel.major')}
          </Text>
          <Text className={styles.relativeKeyText}>
            {t('harmonicWheel.relativeMinor')} {relativeMinor} {t('harmonicWheel.minor')}
          </Text>
        </View>

        <View className={styles.card}>
          <Text className={styles.cardTitle}>{t('harmonicWheel.harmonicField')}</Text>

          <View className={styles.wheelContainer}>
            <HarmonicFieldWheel
              size={fieldSize}
              rootKey={selectedKey}
              mode="major"
              showFunctionColors
            />
          </View>

          <View className={styles.legendRow}>
            <View className={styles.legendItem}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#00D9FF' }} />
              <Text className={styles.legendText}>{t('harmonicWheel.tonic')}</Text>
            </View>
            <View className={styles.legendItem}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#A855F7' }} />
              <Text className={styles.legendText}>{t('harmonicWheel.subdominant')}</Text>
            </View>
            <View className={styles.legendItem}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#F59E0B' }} />
              <Text className={styles.legendText}>{t('harmonicWheel.dominant')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
