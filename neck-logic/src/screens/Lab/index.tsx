import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { styles } from './styles';
import { Fretboard } from '../../components/Fretboard';
import {
    CHROMATIC_SCALE,
    SCALES,
    INTERVAL_LABELS,
    getFretboardPositionsForNotes,
    Note
} from '../../core/MusicEngine';
import { useAuth } from '../../contexts/AuthContext';

type ScaleMode = keyof typeof SCALES | 'custom_notes' | 'custom_intervals';

export default function LabScreen() {
    const { tuning } = useAuth();
    const { width } = useWindowDimensions();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();

    const displayFrets = width > 768 ? 24 : 15;

    const [rootNote, setRootNote] = useState<Note>('C');
    const [scaleMode, setScaleMode] = useState<ScaleMode>('major');

    const [customNotes, setCustomNotes] = useState<Note[]>(['C', 'E', 'G']);
    const [customIntervals, setCustomIntervals] = useState<number[]>([0, 4, 7]);

    const activeNotes = useMemo(() => {
        const rootIndex = CHROMATIC_SCALE.indexOf(rootNote);

        if (scaleMode === 'custom_notes') {
            const notesSet = new Set([rootNote, ...customNotes]);
            return CHROMATIC_SCALE.filter(n => notesSet.has(n));
        }

        if (scaleMode === 'custom_intervals') {
            return customIntervals.map(interval => {
                const noteIndex = (rootIndex + interval) % 12;
                return CHROMATIC_SCALE[noteIndex];
            });
        }

        const predefinedScale = SCALES[scaleMode as keyof typeof SCALES];
        return predefinedScale.intervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 12;
            return CHROMATIC_SCALE[noteIndex];
        });
    }, [rootNote, scaleMode, customNotes, customIntervals]);

    const activeFormula = useMemo(() => {
        if (scaleMode !== 'custom_notes' && scaleMode !== 'custom_intervals') {
            return SCALES[scaleMode as keyof typeof SCALES].formula;
        }

        const rootIndex = CHROMATIC_SCALE.indexOf(rootNote);
        const intervals = activeNotes.map(note => {
            const noteIndex = CHROMATIC_SCALE.indexOf(note);
            return (noteIndex - rootIndex + 12) % 12;
        });

        intervals.sort((a, b) => a - b);
        return intervals.map(i => INTERVAL_LABELS[i]).join(' - ');
    }, [rootNote, activeNotes, scaleMode]);

    const fretboardPositions = useMemo(() => {
        return getFretboardPositionsForNotes(activeNotes, tuning, displayFrets, '#00D9FF', rootNote, '#A855F7');
    }, [activeNotes, tuning, rootNote, displayFrets]);

    const toggleCustomNote = (note: Note) => {
        if (note === rootNote) return;
        setCustomNotes(prev =>
          prev.includes(note) ? prev.filter(n => n !== note) : [...prev, note]
        );
    };

    const toggleCustomInterval = (interval: number) => {
        if (interval === 0) return;
        setCustomIntervals(prev => {
            const newIntervals = prev.includes(interval)
              ? prev.filter(i => i !== interval)
              : [...prev, interval];
            return newIntervals.sort((a, b) => a - b);
        });
    };

    const displayScaleName = useMemo(() => {
        if (scaleMode === 'custom_notes') return t('lab.customNotes');
        if (scaleMode === 'custom_intervals') return t('lab.customIntervals');
        return SCALES[scaleMode as keyof typeof SCALES].name;
    }, [scaleMode, t]);

    return (
      <SafeAreaView className={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

              <View className={styles.header}>
                  <Text className={styles.title}>{t('lab.title')}</Text>
                  <Text className={styles.subtitle}>{t('lab.subtitle')}</Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('HarmonicWheel')}
                activeOpacity={0.8}
                className={`${styles.typeButton} mb-8`}
              >
                  <Text className={styles.typeText}>{t('lab.openHarmonicWheel')}</Text>
              </TouchableOpacity>

              <View className={styles.activeScaleContainer}>
                  <Text className={styles.activeScaleTitle}>{rootNote} {displayScaleName}</Text>
                  <Text className={styles.activeScaleFormula}>{t('lab.formula')} {activeFormula}</Text>
                  <View className={styles.activeScaleNotesRow}>
                      {activeNotes.map((note, index) => {
                          const isRoot = note === rootNote;
                          const isLast = index === activeNotes.length - 1;
                          return (
                            <Text key={`note-text-${index}`}>
                                <Text className={isRoot ? styles.textNoteRoot : styles.textNoteNormal}>
                                    {note}
                                </Text>
                                {!isLast && <Text className={styles.textNoteSeparator}>  •  </Text>}
                            </Text>
                          );
                      })}
                  </View>
              </View>

              <View className={styles.fretboardContainer}>
                  <View className={styles.fretboardHeader}>
                      <Text className={styles.fretboardTitle}>{t('lab.mapping')}</Text>
                  </View>
                  <Fretboard
                    frets={displayFrets}
                    notes={fretboardPositions}
                    autoScroll={false}
                  />
              </View>

              <View className={`${styles.statsRow} mb-8`}>
                  <View className={styles.statBox}>
                      <Text className={styles.statLabel}>{t('lab.notes')}</Text>
                      <Text className={styles.statValueBlue}>{activeNotes.length}</Text>
                  </View>
                  <View className={styles.statBox}>
                      <Text className={styles.statLabel}>{t('lab.root')}</Text>
                      <Text className={styles.statValuePurple}>{rootNote}</Text>
                  </View>
                  <View className={styles.statBox}>
                      <Text className={styles.statLabel}>{t('lab.type')}</Text>
                      <Text className={styles.statValueGreen} numberOfLines={1} adjustsFontSizeToFit>
                          {displayScaleName.split(' ')[0]}
                      </Text>
                  </View>
              </View>

              <View className={styles.card}>
                  <Text className={styles.cardTitle}>{t('lab.rootSelection')}</Text>
                  <View className={styles.gridList}>
                      {CHROMATIC_SCALE.map((note) => {
                          const isSelected = note === rootNote;
                          return (
                            <TouchableOpacity
                              key={`root-${note}`}
                              onPress={() => setRootNote(note)}
                              activeOpacity={0.7}
                              className={`${styles.pillButton} ${isSelected ? styles.pillButtonRoot : ''}`}
                            >
                                <Text className={`${styles.pillText} ${isSelected ? styles.pillTextRoot : ''}`}>
                                    {note}
                                </Text>
                            </TouchableOpacity>
                          );
                      })}
                  </View>
              </View>

              <View className={styles.card}>
                  <Text className={styles.cardTitle}>{t('lab.shapeSelection')}</Text>

                  {Object.entries(SCALES).map(([key, scale]) => (
                    <TouchableOpacity
                      key={`scale-${key}`}
                      onPress={() => setScaleMode(key as ScaleMode)}
                      activeOpacity={0.8}
                      className={`${styles.typeButton} ${scaleMode === key ? styles.typeButtonActive : ''}`}
                    >
                        <Text className={`${styles.typeText} ${scaleMode === key ? styles.typeTextActive : ''}`}>
                            {scale.name}
                        </Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    onPress={() => setScaleMode('custom_intervals')}
                    activeOpacity={0.8}
                    className={`${styles.typeButton} ${scaleMode === 'custom_intervals' ? styles.typeButtonActive : 'mt-4'}`}
                  >
                      <Text className={`${styles.typeText} ${scaleMode === 'custom_intervals' ? styles.typeTextActive : ''}`}>
                          {t('lab.buildIntervals')}
                      </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setScaleMode('custom_notes')}
                    activeOpacity={0.8}
                    className={`${styles.typeButton} ${scaleMode === 'custom_notes' ? styles.typeButtonActive : ''}`}
                  >
                      <Text className={`${styles.typeText} ${scaleMode === 'custom_notes' ? styles.typeTextActive : ''}`}>
                          {t('lab.buildNotes')}
                      </Text>
                  </TouchableOpacity>
              </View>

              {scaleMode === 'custom_intervals' && (
                <View className={styles.card}>
                    <Text className={styles.cardTitle}>{t('lab.selectIntervals')}</Text>
                    <View className={styles.gridList}>
                        {INTERVAL_LABELS.map((label, index) => {
                            const isRoot = index === 0;
                            const isActive = customIntervals.includes(index);
                            return (
                              <TouchableOpacity
                                key={`interval-${index}`}
                                onPress={() => toggleCustomInterval(index)}
                                activeOpacity={0.7}
                                className={`${styles.pillButton} ${isActive ? (isRoot ? styles.pillButtonRoot : styles.pillButtonActive) : ''}`}
                              >
                                  <Text className={`${styles.pillText} ${isActive ? (isRoot ? styles.pillTextRoot : styles.pillTextActive) : ''}`}>
                                      {label}
                                  </Text>
                              </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
              )}

              {scaleMode === 'custom_notes' && (
                <View className={styles.card}>
                    <Text className={styles.cardTitle}>{t('lab.selectNotes')}</Text>
                    <View className={styles.gridList}>
                        {CHROMATIC_SCALE.map((note) => {
                            const isRoot = note === rootNote;
                            const isActive = customNotes.includes(note) || isRoot;
                            return (
                              <TouchableOpacity
                                key={`custom-note-${note}`}
                                onPress={() => toggleCustomNote(note)}
                                activeOpacity={0.7}
                                className={`${styles.pillButton} ${isActive ? (isRoot ? styles.pillButtonRoot : styles.pillButtonActive) : ''}`}
                              >
                                  <Text className={`${styles.pillText} ${isActive ? (isRoot ? styles.pillTextRoot : styles.pillTextActive) : ''}`}>
                                      {note}
                                  </Text>
                              </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
              )}

          </ScrollView>
      </SafeAreaView>
    );
}