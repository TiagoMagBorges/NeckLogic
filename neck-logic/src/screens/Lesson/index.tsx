import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { styles, getProgressStyle } from './styles';
import { Fretboard, FretboardNote } from '../../components/Fretboard';
import { CircleOfFifthsWheel } from '../../components/CircleOfFifthsWheel';
import { HarmonicFieldWheel } from '../../components/HarmonicFieldWheel';
import { StaffDisplay, StaffNoteEntry as StaffDisplayEntry } from '../../components/StaffDisplay';
import { TabDisplay } from '../../components/TabDisplay';
import { getNoteFromStringAndFret } from '../../core/MusicEngine';
import { useLesson, FRETBOARD_EXERCISE_TYPES } from '../../hooks/useLesson';
import { FretPosition, StaffNoteEntry } from '../../types/Lesson';

const CORRECT_COLOR = '#10B981';
const INCORRECT_COLOR = '#EF4444';

export default function LessonScreen() {
    const {
        loading,
        isSaving,
        steps,
        currentStep,
        currentStepIndex,
        selectedFrets,
        selectedOption,
        selectedKey,
        selectedDegree,
        checkResult,
        hasAnswerSelected,
        correctReveal,
        handleAction,
        handleFretPress,
        handleSelectOption,
        handleSelectKey,
        handleSelectDegree,
        goBack,
        tuning
    } = useLesson();

    const { t } = useTranslation();

    const [imageFailed, setImageFailed] = useState(false);

    useEffect(() => {
        setImageFailed(false);
    }, [currentStepIndex]);

    const exerciseType = currentStep?.exerciseType;
    const isTheory = currentStep?.type === 'THEORY';
    const illustration = currentStep?.illustration;

    const markedPosition = currentStep?.type === 'DRILL' && exerciseType === 'MULTIPLE_CHOICE'
      ? (currentStep.markedPosition as FretPosition | undefined)
      : undefined;

    const showFretboard =
      (currentStep?.type === 'DRILL' && !!exerciseType && FRETBOARD_EXERCISE_TYPES.includes(exerciseType)) ||
      (currentStep?.type === 'DRILL' && exerciseType === 'MULTIPLE_CHOICE' && !!markedPosition) ||
      (isTheory && illustration?.kind === 'fretboard');
    const showCircle = (currentStep?.type === 'DRILL' && exerciseType === 'CIRCLE_OF_FIFTHS') || (isTheory && illustration?.kind === 'circleOfFifths');
    const showHarmonic = (currentStep?.type === 'DRILL' && exerciseType === 'HARMONIC_FIELD') || (isTheory && illustration?.kind === 'harmonicField');
    const showStaff = (currentStep?.type === 'DRILL' && exerciseType === 'STAFF_READING') || (isTheory && illustration?.kind === 'staff');
    const showTab = currentStep?.type === 'DRILL' && exerciseType === 'TAB_READING';
    const showMultipleChoice = currentStep?.type === 'DRILL' && exerciseType === 'MULTIPLE_CHOICE';

    const notesToRender = useMemo(() => {
        let notes: FretboardNote[] = [];

        if (isTheory && illustration?.kind === 'fretboard') {
            notes = illustration.notes.map((p) => ({ ...p, label: getNoteFromStringAndFret(p.string, p.fret, tuning) }));
        }

        if (markedPosition) {
            notes = [...notes, { ...markedPosition }];
        }

        if (checkResult === 'INCORRECT') {
            correctReveal.missedPositions.forEach((position) => {
                notes.push({
                    ...position,
                    color: CORRECT_COLOR,
                    label: getNoteFromStringAndFret(position.string, position.fret, tuning),
                    blink: true
                });
            });
        }

        if (selectedFrets.length > 0) {
            selectedFrets.forEach((selectedFret) => {
                let color = '#00D9FF';
                let label: string | undefined;

                if (checkResult === 'CORRECT') {
                    color = CORRECT_COLOR;
                    label = getNoteFromStringAndFret(selectedFret.string, selectedFret.fret, tuning);
                } else if (checkResult === 'INCORRECT') {
                    const isCorrectPick = correctReveal.correctSelected.some(
                      (p) => p.string === selectedFret.string && p.fret === selectedFret.fret
                    );
                    color = isCorrectPick ? CORRECT_COLOR : INCORRECT_COLOR;
                    label = getNoteFromStringAndFret(selectedFret.string, selectedFret.fret, tuning);
                }

                notes.push({ ...selectedFret, color, label });
            });
        }

        return notes;
    }, [currentStep, selectedFrets, checkResult, tuning, correctReveal]);

    const staffEntries: StaffDisplayEntry[] | undefined = useMemo(() => {
        if (isTheory && illustration?.kind === 'staff') return illustration.notes;
        if (currentStep?.type === 'DRILL' && exerciseType === 'STAFF_READING') return (currentStep.staffNotes as StaffNoteEntry[]) ?? [];
        return undefined;
    }, [currentStep, isTheory, illustration, exerciseType]);

    const tabSequence: FretPosition[] | undefined = useMemo(() => {
        if (currentStep?.type === 'DRILL' && exerciseType === 'TAB_READING') return (currentStep.targetSequence as FretPosition[]) ?? [];
        return undefined;
    }, [currentStep, exerciseType]);

    if (loading || !currentStep) {
        return (
          <View className="flex-1 bg-background justify-center items-center">
              <ActivityIndicator size="large" color="#00D9FF" />
          </View>
        );
    }

    let buttonText = currentStepIndex === steps.length - 1 ? t('lesson.complete') : t('lesson.next');
    let isButtonDisabled = false;

    if (currentStep.type === 'DRILL' && checkResult === 'IDLE') {
        buttonText = t('lesson.check');
        isButtonDisabled = !hasAnswerSelected;
    }

    const displayFrets = currentStep.type === 'DRILL' ? 22 : 12;

    const question = (currentStep.question as string | undefined) ?? undefined;
    const options = (currentStep.options as string[] | undefined) ?? [];
    const correctAnswer = currentStep.correctAnswer as string | undefined;

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

              {!!currentStep.imageUrl && (
                <View className={`${styles.imageContainer} overflow-hidden`}>
                    {imageFailed ? (
                      <Text className={styles.imagePlaceholderText}>{t('lesson.imageUnavailable')}</Text>
                    ) : (
                      <Image
                        source={{ uri: currentStep.imageUrl as string }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                        onError={() => setImageFailed(true)}
                      />
                    )}
                </View>
              )}

              <Text className={styles.title}>{currentStep.title}</Text>

              {currentStep.text && (
                <Text className={styles.bodyText}>{currentStep.text as string}</Text>
              )}

              {currentStep.type === 'DRILL' && exerciseType !== 'STAFF_READING' && question && (
                <Text className="text-primary text-center text-xl font-bold mb-4 mt-2">{question}</Text>
              )}

              {currentStep.type === 'DRILL' && exerciseType === 'STAFF_READING' && (
                <Text className="text-primary text-center text-xl font-bold mb-4 mt-2">{t('lesson.staffReadingHint')}</Text>
              )}

              {showStaff && staffEntries && staffEntries.length > 0 && (
                <View className="w-full mt-2 mb-4">
                    <View style={{ marginHorizontal: -24 }}>
                        <StaffDisplay
                          notes={staffEntries}
                          clef={isTheory ? illustration?.kind === 'staff' ? illustration.clef : 'treble' : (currentStep.clef as 'treble' | 'bass') ?? 'treble'}
                          beatsPerMeasure={isTheory ? illustration?.kind === 'staff' ? illustration.beatsPerMeasure : 4 : (currentStep.beatsPerMeasure as number) ?? 4}
                        />
                    </View>
                </View>
              )}

              {showTab && tabSequence && tabSequence.length > 0 && (
                <View className="w-full mt-2 mb-4">
                    <View style={{ marginHorizontal: -24 }}>
                        <TabDisplay sequence={tabSequence} />
                    </View>
                </View>
              )}

              {showMultipleChoice && (
                <View className="w-full mt-2 gap-2.5">
                    {options.map((option, index) => {
                        const isSelected = option === selectedOption;
                        let borderColor = 'border-border/15';
                        let bgColor = 'bg-card';

                        if (checkResult === 'CORRECT' && isSelected) {
                            borderColor = 'border-green-500';
                            bgColor = 'bg-green-500/10';
                        } else if (checkResult === 'INCORRECT' && isSelected) {
                            borderColor = 'border-red-500';
                            bgColor = 'bg-red-500/10';
                        } else if (checkResult === 'INCORRECT' && option === correctAnswer) {
                            borderColor = 'border-green-500';
                            bgColor = 'bg-green-500/10';
                        } else if (isSelected) {
                            borderColor = 'border-primary';
                            bgColor = 'bg-primary/10';
                        }

                        return (
                          <TouchableOpacity
                            key={index}
                            disabled={checkResult !== 'IDLE'}
                            onPress={() => handleSelectOption(option)}
                            className={`py-3.5 px-4 rounded-xl border-[1.5px] ${borderColor} ${bgColor}`}
                            activeOpacity={0.8}
                          >
                              <Text className="text-foreground font-semibold text-[15px]">{option}</Text>
                          </TouchableOpacity>
                        );
                    })}
                </View>
              )}

              {showCircle && (
                <View className="w-full mt-2 items-center">
                    <CircleOfFifthsWheel
                      selectedKeys={
                          isTheory && illustration?.kind === 'circleOfFifths'
                            ? illustration.highlightedKeys
                            : selectedKey
                              ? [selectedKey]
                              : []
                      }
                      onSelectKey={currentStep.type === 'DRILL' && checkResult === 'IDLE' ? handleSelectKey : undefined}
                      highlightColors={
                          checkResult !== 'IDLE'
                            ? {
                                ...(selectedKey ? { [selectedKey]: checkResult === 'CORRECT' ? CORRECT_COLOR : INCORRECT_COLOR } : {}),
                                ...(checkResult === 'INCORRECT' && currentStep.targetKey ? { [currentStep.targetKey as string]: CORRECT_COLOR } : {})
                            }
                            : undefined
                      }
                    />
                </View>
              )}

              {showHarmonic && (
                <View className="w-full mt-2 items-center">
                    <HarmonicFieldWheel
                      rootKey={isTheory && illustration?.kind === 'harmonicField' ? illustration.key : (currentStep.key as string) ?? 'C'}
                      mode={isTheory && illustration?.kind === 'harmonicField' ? illustration.mode : (currentStep.mode as 'major' | 'minor') ?? 'major'}
                      selectedDegrees={
                          isTheory && illustration?.kind === 'harmonicField'
                            ? illustration.highlightedDegrees
                            : selectedDegree
                              ? [selectedDegree]
                              : []
                      }
                      onSelectDegree={currentStep.type === 'DRILL' && checkResult === 'IDLE' ? handleSelectDegree : undefined}
                      highlightColors={
                          checkResult !== 'IDLE'
                            ? {
                                ...(selectedDegree ? { [selectedDegree]: checkResult === 'CORRECT' ? CORRECT_COLOR : INCORRECT_COLOR } : {}),
                                ...(checkResult === 'INCORRECT' && currentStep.targetDegree ? { [currentStep.targetDegree as string]: CORRECT_COLOR } : {})
                            }
                            : undefined
                      }
                    />
                </View>
              )}

              {showFretboard && (
                <View className="w-full mt-4">
                    <View style={{ marginHorizontal: -24 }}>
                        <Fretboard
                          key={`step-${currentStepIndex}`}
                          frets={displayFrets}
                          notes={notesToRender}
                          onFretPress={currentStep.type === 'DRILL' ? handleFretPress : undefined}
                          autoScroll={isTheory}
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