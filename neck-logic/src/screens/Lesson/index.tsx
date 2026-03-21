import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { styles, getProgressStyle } from './styles';
import { Fretboard, FretboardNote } from '../../components/Fretboard';
import { getNoteFromStringAndFret, getFretboardPositionsForNotes } from '../../core/MusicEngine';
import { useLesson } from '../../hooks/useLesson';

export default function LessonScreen() {
    const {
        loading,
        isSaving,
        steps,
        currentStep,
        currentStepIndex,
        selectedFrets,
        checkResult,
        handleAction,
        handleFretPress,
        goBack,
        tuning
    } = useLesson();

    const { t } = useTranslation();

    const notesToRender = useMemo(() => {
        let notes: FretboardNote[] = [];
        const config = currentStep?.fretboardConfig;

        if (config) {
            if (config.explicitNotes) {
                notes = [...notes, ...config.explicitNotes];
            }
            if (config.highlightNotes && config.highlightNotes.length > 0) {
                notes = [
                    ...notes,
                    ...getFretboardPositionsForNotes(
                        config.highlightNotes,
                        config.tuning || tuning,
                        config.frets || 22
                    )
                ];
            }
        }

        if (selectedFrets.length > 0) {
            selectedFrets.forEach(selectedFret => {
                let color = '#00D9FF';
                let label: string | undefined = undefined;

                if (checkResult === 'CORRECT') {
                    color = '#10B981';
                    label = getNoteFromStringAndFret(selectedFret.string, selectedFret.fret, tuning);
                } else if (checkResult === 'INCORRECT') {
                    color = '#EF4444';
                    label = getNoteFromStringAndFret(selectedFret.string, selectedFret.fret, tuning);
                }

                notes.push({
                    string: selectedFret.string,
                    fret: selectedFret.fret,
                    color,
                    label
                });
            });
        }

        return notes;
    }, [currentStep, selectedFrets, checkResult, tuning]);

    if (loading || !currentStep) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#00D9FF" />
            </View>
        );
    }

    let buttonText = currentStepIndex === steps.length - 1 ? t('lesson.complete') : t('lesson.next');
    let isButtonDisabled = false;

    if (currentStep.type === 'DRILL') {
        if (checkResult === 'IDLE') {
            buttonText = t('lesson.check');
            isButtonDisabled = selectedFrets.length === 0;
        } else if (checkResult === 'INCORRECT') {
            buttonText = t('lesson.tryAgain');
        }
    }

    const showFretboard = currentStep.type === 'DRILL' || !!currentStep.fretboardConfig;
    const displayFrets = Math.max(12, currentStep.fretboardConfig?.frets ?? 22);

    return (
        <SafeAreaView className={styles.safeArea}>
            <View className={styles.header}>
                <TouchableOpacity onPress={goBack} className={styles.closeButton}>
                    <X size={24} color="#A1A1AA" />
                </TouchableOpacity>

                <View className={styles.progressBarContainer}>
                    <View
                        className={styles.progressBarFill}
                        style={getProgressStyle(currentStepIndex, steps.length)}
                    />
                </View>

                <View style={{ width: 24 }} />
            </View>

            <View className={styles.contentContainer}>
                <Text className={styles.typeTag}>{currentStep.type.replace('_', ' ')}</Text>

                {currentStep.imageUrl && (
                    <View className={styles.imageContainer}>
                        <Text className={styles.imagePlaceholderText}>{t('lesson.image')} {currentStep.imageUrl}</Text>
                    </View>
                )}

                <Text className={styles.title}>{currentStep.title}</Text>

                {currentStep.text && (
                    <Text className={styles.bodyText}>{currentStep.text}</Text>
                )}

                {showFretboard && (
                    <View className="w-full mt-4">
                        {currentStep.question && (
                            <Text className="text-primary text-center text-xl font-bold mb-6">
                                {currentStep.question}
                            </Text>
                        )}

                        <View style={{ marginHorizontal: -24 }}>
                            <Fretboard
                                key={`step-${currentStepIndex}`}
                                frets={displayFrets}
                                notes={notesToRender}
                                onFretPress={currentStep.type === 'DRILL' ? handleFretPress : undefined}
                                autoScroll={currentStep.type === 'THEORY'}
                            />
                        </View>
                    </View>
                )}
            </View>

            <View className={styles.footer}>
                <TouchableOpacity
                    className={`${styles.nextButton} ${isButtonDisabled || isSaving ? 'opacity-50' : 'opacity-100'}`}
                    onPress={handleAction}
                    activeOpacity={0.8}
                    disabled={isButtonDisabled || isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#121212" />
                    ) : (
                        <Text className={styles.nextButtonText}>
                            {buttonText}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}