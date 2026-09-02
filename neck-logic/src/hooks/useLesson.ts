import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import i18n from '../i18n';

import { api } from '../services/api';
import { LessonContentDTO, LessonStep, FretPosition, ExerciseType, StaffNoteEntry } from '../types/Lesson';
import { RootStackParamList } from '../navigation/Routes';
import { getNoteFromStringAndFret, getChordNotes, getFretboardPositionsForNotes } from '../core/MusicEngine';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';

type LessonScreenRouteProp = RouteProp<RootStackParamList, 'Lesson'>;

const FRETBOARD_MULTI_TOGGLE: ExerciseType[] = ['CHORD_BUILD', 'TRIAD_INVERSION', 'FIND_ALL_OCCURRENCES'];
export const SEQUENCE_TYPES: ExerciseType[] = ['SCALE_DEGREES', 'ARPEGGIO', 'TAB_READING'];
export const FRETBOARD_EXERCISE_TYPES: ExerciseType[] = [...FRETBOARD_MULTI_TOGGLE, 'SHAPE_MATCH', 'STAFF_READING', ...SEQUENCE_TYPES];

function shapeMatchIsSingle(step: LessonStep): boolean {
    return !Array.isArray(step.targetShape) && !Array.isArray(step.targetNotes);
}

function positionsEqualAsSet(a: FretPosition[], b: FretPosition[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((p) => b.some((q) => q.string === p.string && q.fret === p.fret)) &&
      b.every((p) => a.some((q) => q.string === p.string && q.fret === p.fret));
}

function positionsEqualInOrder(a: FretPosition[], b: FretPosition[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((p, i) => p.string === b[i].string && p.fret === b[i].fret);
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

    function evaluateCurrentStep(): boolean {
        if (!currentStep) return false;

        switch (exerciseType) {
            case 'MULTIPLE_CHOICE':
                return !!selectedOption && selectedOption === currentStep.correctAnswer;

            case 'CIRCLE_OF_FIFTHS':
                return !!selectedKey && selectedKey === currentStep.targetKey;

            case 'HARMONIC_FIELD':
                return !!selectedDegree && selectedDegree === currentStep.targetDegree;

            case 'CHORD_BUILD':
            case 'TRIAD_INVERSION': {
                const root = (currentStep.root as string) ?? 'C';
                const quality = (currentStep.quality as string) ?? 'major';
                const targets = getChordNotes(root, quality).map((n) => n.toUpperCase());
                if (selectedFrets.length === 0 || targets.length === 0) return false;

                const selectedNoteNames = selectedFrets.map((f) => getNoteFromStringAndFret(f.string, f.fret, tuning).toUpperCase());
                const uniqueSelected = Array.from(new Set(selectedNoteNames));
                const notesMatch = uniqueSelected.every((n) => targets.includes(n)) && targets.every((n) => uniqueSelected.includes(n));
                if (!notesMatch) return false;

                if (exerciseType === 'TRIAD_INVERSION') {
                    const inversion = (currentStep.inversion as number) ?? 0;
                    const expectedBass = targets[inversion % targets.length];
                    const bassPosition = selectedFrets.reduce((lowest, p) => (p.string > lowest.string ? p : lowest), selectedFrets[0]);
                    const bassNote = getNoteFromStringAndFret(bassPosition.string, bassPosition.fret, tuning).toUpperCase();
                    return bassNote === expectedBass;
                }

                return true;
            }

            case 'SHAPE_MATCH': {
                if (Array.isArray(currentStep.targetShape)) {
                    const targetShape = currentStep.targetShape as FretPosition[];
                    return selectedFrets.length > 0 && positionsEqualAsSet(selectedFrets, targetShape);
                }
                if (Array.isArray(currentStep.targetNotes)) {
                    const targets = (currentStep.targetNotes as string[]).map((n) => n.toUpperCase());
                    const selectedNoteNames = selectedFrets.map((f) => getNoteFromStringAndFret(f.string, f.fret, tuning).toUpperCase());
                    return (
                      selectedNoteNames.length > 0 &&
                      selectedNoteNames.every((n) => targets.includes(n)) &&
                      targets.every((n) => selectedNoteNames.includes(n))
                    );
                }
                if (selectedFrets.length === 1) {
                    const clickedNoteName = getNoteFromStringAndFret(selectedFrets[0].string, selectedFrets[0].fret, tuning);
                    return clickedNoteName.toUpperCase() === ((currentStep.targetNote as string) ?? '').toUpperCase();
                }
                return false;
            }

            case 'FIND_ALL_OCCURRENCES': {
                const targetNote = (currentStep.targetNote as string) ?? '';
                const maxFret = (currentStep.maxFret as number) ?? 22;
                const targets = getFretboardPositionsForNotes([targetNote], tuning, maxFret);
                return selectedFrets.length > 0 && positionsEqualAsSet(selectedFrets, targets);
            }

            case 'SCALE_DEGREES':
            case 'ARPEGGIO':
            case 'TAB_READING': {
                const targetSequence = (currentStep.targetSequence as FretPosition[]) ?? [];
                return targetSequence.length > 0 && positionsEqualInOrder(selectedFrets, targetSequence);
            }

            case 'STAFF_READING': {
                const staffNotes = (currentStep.staffNotes as StaffNoteEntry[]) ?? [];
                const targetNotes = staffNotes.filter((n) => n.note).map((n) => (n.note as string).toUpperCase().replace(/\d+$/, ''));
                if (targetNotes.length === 0 || selectedFrets.length !== targetNotes.length) return false;

                const selectedNoteNames = selectedFrets.map((f) => getNoteFromStringAndFret(f.string, f.fret, tuning).toUpperCase());
                return selectedNoteNames.every((n, i) => n === targetNotes[i]);
            }

            default:
                return false;
        }
    }

    function hasAnswerSelected(): boolean {
        if (!currentStep) return false;

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

            if (checkResult === 'INCORRECT') {
                setSelectedFrets([]);
                setSelectedOption(null);
                setSelectedKey(null);
                setSelectedDegree(null);
                setCheckResult('IDLE');
                return;
            }
        }

        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
            resetSelection();
        } else {
            try {
                setIsSaving(true);
                const response = await api.post(`/modules/${moduleId}/complete`, { mistakesCount });

                const { totalXp, level, leveledUp, xpGained, streak } = response.data;

                await updateUserProgress(totalXp, level, streak);

                const drillCount = steps.filter((s) => s.type === 'DRILL').length;

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
        if (!currentStep || currentStep.type !== 'DRILL' || checkResult === 'CORRECT') return;
        if (!exerciseType || !FRETBOARD_EXERCISE_TYPES.includes(exerciseType)) return;

        setCheckResult('IDLE');

        if (exerciseType === 'STAFF_READING' || SEQUENCE_TYPES.includes(exerciseType)) {
            setSelectedFrets((prev) => [...prev, { string: stringNum, fret: fretNum }]);
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
        if (checkResult === 'CORRECT') return;
        setCheckResult('IDLE');
        setSelectedOption(option);
    }

    function handleSelectKey(note: string) {
        if (checkResult === 'CORRECT') return;
        setCheckResult('IDLE');
        setSelectedKey(note);
    }

    function handleSelectDegree(degree: string) {
        if (checkResult === 'CORRECT') return;
        setCheckResult('IDLE');
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
        handleAction,
        handleFretPress,
        handleSelectOption,
        handleSelectKey,
        handleSelectDegree,
        goBack,
        tuning
    };
}