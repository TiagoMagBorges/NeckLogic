import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Volume2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { styles, getProgressStyle } from './styles';
import { deriveFretboardNotes } from './deriveFretboardNotes';
import { deriveFocusFret } from './deriveFocusFret';
import { MultipleChoiceOptions } from './MultipleChoiceOptions';
import { CircleOfFifthsExercise } from './CircleOfFifthsExercise';
import { HarmonicFieldExercise } from './HarmonicFieldExercise';
import { Fretboard } from '../../components/Fretboard';
import { StaffDisplay } from '../../components/StaffDisplay';
import { TabDisplay } from '../../components/TabDisplay';
import { getNoteWithOctaveFromStringAndFret } from '../../core/MusicEngine';
import { playNote, playSequence } from '../../core/AudioEngine';
import { useLesson, FRETBOARD_EXERCISE_TYPES } from '../../hooks/useLesson';
import { FretPosition, StaffNoteEntry, TabNoteEntry } from '../../types/Lesson';

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
        sequenceNoteStates,
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
    const showTab = (currentStep?.type === 'DRILL' && exerciseType === 'TAB_READING') || (isTheory && illustration?.kind === 'tab');
    const showMultipleChoice = currentStep?.type === 'DRILL' && exerciseType === 'MULTIPLE_CHOICE';

    const notesToRender = useMemo(
      () => deriveFretboardNotes({
          isTheory,
          illustration,
          markedPosition,
          exerciseType,
          checkResult,
          correctReveal,
          selectedFrets,
          sequenceNoteStates,
          tuning
      }),
      [isTheory, illustration, markedPosition, exerciseType, checkResult, correctReveal, selectedFrets, sequenceNoteStates, tuning]
    );

    const staffEntries: StaffNoteEntry[] | undefined = useMemo(() => {
        if (isTheory && illustration?.kind === 'staff') return illustration.notes;
        if (currentStep?.type === 'DRILL' && exerciseType === 'STAFF_READING') return (currentStep.staffNotes as StaffNoteEntry[]) ?? [];
        return undefined;
    }, [currentStep, isTheory, illustration, exerciseType]);

    const tabNotes: TabNoteEntry[] | undefined = useMemo(() => {
        if (isTheory && illustration?.kind === 'tab') return illustration.notes;
        if (currentStep?.type === 'DRILL' && exerciseType === 'TAB_READING') return (currentStep.tabNotes as TabNoteEntry[]) ?? [];
        return undefined;
    }, [currentStep, isTheory, illustration, exerciseType]);

    const tabBeatsPerMeasure = isTheory
      ? illustration?.kind === 'tab' ? illustration.beatsPerMeasure : 4
      : (currentStep?.beatsPerMeasure as number) ?? 4;

    const focusFret = useMemo(
      () => deriveFocusFret({ currentStep, exerciseType, markedPosition, tuning }),
      [currentStep, exerciseType, markedPosition, tuning]
    );

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

    function handleFretPressWithSound(stringNum: number, fretNum: number) {
        playNote(getNoteWithOctaveFromStringAndFret(stringNum, fretNum, tuning));
        handleFretPress(stringNum, fretNum);
    }

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

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
          >
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

              {isTheory && !!currentStep.audio && (
                <TouchableOpacity
                  onPress={() => {
                      const audio = currentStep.audio as { sequence: StaffNoteEntry[]; tempo?: number };
                      playSequence(audio.sequence, audio.tempo);
                  }}
                  className="flex-row items-center self-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mt-1 mb-2"
                  activeOpacity={0.8}
                >
                    <Volume2 size={16} color="#00D9FF" />
                    <Text className="text-primary text-sm font-semibold">{t('lesson.playAudio')}</Text>
                </TouchableOpacity>
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
                          noteStates={!isTheory ? sequenceNoteStates : undefined}
                        />
                    </View>
                </View>
              )}

              {showTab && tabNotes && tabNotes.length > 0 && (
                <View className="w-full mt-2 mb-4">
                    <View style={{ marginHorizontal: -24 }}>
                        <TabDisplay
                          notes={tabNotes}
                          beatsPerMeasure={tabBeatsPerMeasure}
                          noteStates={!isTheory ? sequenceNoteStates : undefined}
                        />
                    </View>
                </View>
              )}

              {showMultipleChoice && (
                <MultipleChoiceOptions
                  options={options}
                  selectedOption={selectedOption}
                  correctAnswer={correctAnswer}
                  checkResult={checkResult}
                  onSelect={handleSelectOption}
                />
              )}

              {showCircle && (
                <CircleOfFifthsExercise
                  currentStep={currentStep}
                  isTheory={isTheory}
                  illustration={illustration}
                  selectedKey={selectedKey}
                  checkResult={checkResult}
                  onSelectKey={handleSelectKey}
                />
              )}

              {showHarmonic && (
                <HarmonicFieldExercise
                  currentStep={currentStep}
                  isTheory={isTheory}
                  illustration={illustration}
                  selectedDegree={selectedDegree}
                  checkResult={checkResult}
                  onSelectDegree={handleSelectDegree}
                />
              )}

              {showFretboard && (
                <View className="w-full mt-4">
                    <View style={{ marginHorizontal: -24 }}>
                        <Fretboard
                          key={`step-${currentStepIndex}`}
                          frets={displayFrets}
                          notes={notesToRender}
                          onFretPress={currentStep.type === 'DRILL' ? handleFretPressWithSound : undefined}
                          autoScroll={isTheory || currentStep.type === 'DRILL'}
                          focusFret={focusFret}
                        />
                    </View>
                </View>
              )}
          </ScrollView>

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