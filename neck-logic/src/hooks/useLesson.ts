import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import i18n from '../i18n';

import { api } from '../services/api';
import { LessonContentDTO, LessonStep, FretPosition, ExerciseType, SequenceNoteState } from '../types/Lesson';
import { RootStackParamList } from '../navigation/Routes';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import {
  AnswerInput,
  CorrectReveal,
  validateDrillStep,
  getDrillCorrectReveal,
  getSequenceTarget,
  isSequenceExerciseType,
} from '../core/exerciseValidators';

type LessonScreenRouteProp = RouteProp<RootStackParamList, 'Lesson'>;

const FRETBOARD_MULTI_TOGGLE: ExerciseType[] = ['CHORD_BUILD', 'TRIAD_INVERSION', 'FIND_ALL_OCCURRENCES'];
export const SEQUENCE_TYPES: ExerciseType[] = ['SCALE_DEGREES', 'ARPEGGIO', 'TAB_READING'];
export const FRETBOARD_EXERCISE_TYPES: ExerciseType[] = [...FRETBOARD_MULTI_TOGGLE, 'SHAPE_MATCH', 'STAFF_READING', ...SEQUENCE_TYPES];

const EMPTY_REVEAL: CorrectReveal = { correctSelected: [], incorrectSelected: [], missedPositions: [] };

function shapeMatchIsSingle(step: LessonStep): boolean {
  if (Array.isArray(step.targetShape)) return (step.targetShape as FretPosition[]).length === 1;
  if (Array.isArray(step.targetNotes)) return (step.targetNotes as string[]).length === 1;
  return true;
}

export function useLesson() {
  const navigation = useNavigation<any>();
  const route = useRoute<LessonScreenRouteProp>();
  const { moduleId } = route.params;

  const { tuning } = useAuth();
  const { updateUserProgress } = useProgress();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [steps, setSteps] = useState<LessonStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [selectedFrets, setSelectedFrets] = useState<FretPosition[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedDegree, setSelectedDegree] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<'IDLE' | 'CORRECT' | 'INCORRECT'>('IDLE');
  const [mistakesCount, setMistakesCount] = useState(0);

  const currentStep = steps[currentStepIndex];
  const exerciseType = currentStep?.exerciseType;

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      const response = await api.get<LessonContentDTO>(`/modules/${moduleId}/content`);
      const parsedSteps = JSON.parse(response.data.contentJson);

      if (Array.isArray(parsedSteps) && parsedSteps.length > 0) {
        setSteps(parsedSteps);
      } else {
        Alert.alert(i18n.t('hooks.lessonEmptyTitle'), i18n.t('hooks.lessonEmptyDesc'));
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert(i18n.t('common.error'), i18n.t('hooks.lessonLoadError'));
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  function resetSelection() {
    setSelectedFrets([]);
    setSelectedOption(null);
    setSelectedKey(null);
    setSelectedDegree(null);
    setCheckResult('IDLE');
  }

  function buildAnswerInput(): AnswerInput | null {
    switch (exerciseType) {
      case 'MULTIPLE_CHOICE':
        return selectedOption ? { kind: 'CHOICE', value: selectedOption } : null;
      case 'CIRCLE_OF_FIFTHS':
        return selectedKey ? { kind: 'CHOICE', value: selectedKey } : null;
      case 'HARMONIC_FIELD':
        return selectedDegree ? { kind: 'CHOICE', value: selectedDegree } : null;
      case 'CHORD_BUILD':
      case 'TRIAD_INVERSION':
      case 'SHAPE_MATCH':
      case 'FIND_ALL_OCCURRENCES':
        return { kind: 'FRETS', frets: selectedFrets };
      default:
        return null;
    }
  }

  function evaluateCurrentStep(): boolean {
    if (!currentStep) return false;
    const input = buildAnswerInput();
    return !!input && validateDrillStep(currentStep, input, tuning);
  }

  function getCorrectReveal(): CorrectReveal {
    if (!currentStep || !exerciseType || isSequenceExerciseType(exerciseType)) return EMPTY_REVEAL;
    return getDrillCorrectReveal(currentStep, selectedFrets, tuning);
  }

  function hasAnswerSelected(): boolean {
    if (!currentStep || !exerciseType) return false;
    if (isSequenceExerciseType(exerciseType)) {
      return false;
    }

    switch (exerciseType) {
      case 'MULTIPLE_CHOICE':
        return !!selectedOption;
      case 'CIRCLE_OF_FIFTHS':
        return !!selectedKey;
      case 'HARMONIC_FIELD':
        return !!selectedDegree;
      default:
        return selectedFrets.length > 0;
    }
  }

  function getSequenceNoteStates(): SequenceNoteState[] {
    if (!currentStep || !exerciseType || !isSequenceExerciseType(exerciseType)) return [];

    const target = getSequenceTarget(currentStep, exerciseType);
    const states: SequenceNoteState[] = [];

    for (let i = 0; i < target.length; i++) {
      if (i < selectedFrets.length) {
        states.push(target.isCorrectAt(i, selectedFrets, tuning) ? 'correct' : 'incorrect');
      } else {
        states.push(i === selectedFrets.length ? 'current' : 'pending');
      }
    }

    return states;
  }

  async function handleAction() {
    if (!currentStep) return;

    if (currentStep.type === 'DRILL') {
      if (checkResult === 'IDLE') {
        if (!hasAnswerSelected()) return;

        const isCorrect = evaluateCurrentStep();
        if (!isCorrect) {
          setMistakesCount((prev) => prev + 1);
        }

        setCheckResult(isCorrect ? 'CORRECT' : 'INCORRECT');
        return;
      }
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      resetSelection();
    } else {
      const drillCount = steps.filter((s) => s.type === 'DRILL').length;
      const skipTestForSectionId = route.params.skipTestForSectionId;

      try {
        setIsSaving(true);

        if (skipTestForSectionId) {
          const response = await api.post(`/sections/${skipTestForSectionId}/skip-test/complete`, { mistakesCount, drillCount });
          const { passed, scorePercentage, totalXp, level, leveledUp, xpGained, streak } = response.data;

          if (!passed) {
            Alert.alert(
              i18n.t('hooks.skipTestFailedTitle'),
              i18n.t('hooks.skipTestFailedDesc', { score: Math.round(scorePercentage) })
            );
            navigation.goBack();
            return;
          }

          await updateUserProgress(totalXp, level, streak);

          navigation.replace('LessonFeedback', {
            xpGained,
            leveledUp,
            currentLevel: level,
            mistakesCount,
            drillCount,
            isSkipTest: true
          });
          return;
        }

        const response = await api.post(`/modules/${moduleId}/complete`, { mistakesCount });
        const { totalXp, level, leveledUp, xpGained, streak } = response.data;

        await updateUserProgress(totalXp, level, streak);

        navigation.replace('LessonFeedback', {
          xpGained,
          leveledUp,
          currentLevel: level,
          mistakesCount,
          drillCount
        });
      } catch (error: any) {
        Alert.alert(i18n.t('common.error'), i18n.t('hooks.lessonSaveError'));
      } finally {
        setIsSaving(false);
      }
    }
  }

  function handleFretPress(stringNum: number, fretNum: number) {
    if (!currentStep || currentStep.type !== 'DRILL' || checkResult !== 'IDLE') return;
    if (!exerciseType || !FRETBOARD_EXERCISE_TYPES.includes(exerciseType)) return;

    if (isSequenceExerciseType(exerciseType)) {
      const target = getSequenceTarget(currentStep, exerciseType);
      if (selectedFrets.length >= target.length) return;

      const nextFrets = [...selectedFrets, { string: stringNum, fret: fretNum }];
      setSelectedFrets(nextFrets);

      if (nextFrets.length === target.length) {
        let incorrectCount = 0;
        for (let i = 0; i < target.length; i++) {
          if (!target.isCorrectAt(i, nextFrets, tuning)) incorrectCount++;
        }

        if (incorrectCount > 0) {
          setMistakesCount((prev) => prev + incorrectCount / target.length);
        }

        setCheckResult(incorrectCount === 0 ? 'CORRECT' : 'INCORRECT');
      }
      return;
    }

    const isSingleSelection = exerciseType === 'SHAPE_MATCH' && shapeMatchIsSingle(currentStep);

    setSelectedFrets((prev) => {
      const exists = prev.find((p) => p.string === stringNum && p.fret === fretNum);

      if (exists) {
        return prev.filter((p) => p.string !== stringNum || p.fret !== fretNum);
      }

      if (isSingleSelection) {
        return [{ string: stringNum, fret: fretNum }];
      }

      return [...prev, { string: stringNum, fret: fretNum }];
    });
  }

  function handleSelectOption(option: string) {
    if (checkResult !== 'IDLE') return;
    setSelectedOption(option);
  }

  function handleSelectKey(note: string) {
    if (checkResult !== 'IDLE') return;
    setSelectedKey(note);
  }

  function handleSelectDegree(degree: string) {
    if (checkResult !== 'IDLE') return;
    setSelectedDegree(degree);
  }

  function goBack() {
    navigation.goBack();
  }

  return {
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
    hasAnswerSelected: hasAnswerSelected(),
    correctReveal: checkResult === 'INCORRECT' ? getCorrectReveal() : EMPTY_REVEAL,
    sequenceNoteStates: getSequenceNoteStates(),
    handleAction,
    handleFretPress,
    handleSelectOption,
    handleSelectKey,
    handleSelectDegree,
    goBack,
    tuning
  };
}