import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import i18n from '../i18n';

import { api } from '../services/api';
import { LessonContentDTO, LessonStep, FretPosition } from '../types/Lesson';
import { RootStackParamList } from '../navigation/Routes';
import { validateDrillStep, isShapeMatchStep, usesChoiceInput } from '../core/exerciseValidators';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';

type LessonScreenRouteProp = RouteProp<RootStackParamList, 'Lesson'>;

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
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [checkResult, setCheckResult] = useState<'IDLE' | 'CORRECT' | 'INCORRECT'>('IDLE');
    const [mistakesCount, setMistakesCount] = useState(0);

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

    async function handleAction() {
        const currentStep = steps[currentStepIndex];

        if (currentStep.type === 'DRILL') {
            if (checkResult === 'IDLE') {
                let isCorrect = false;

                if (usesChoiceInput(currentStep)) {
                    if (!selectedChoice) return;
                    isCorrect = validateDrillStep(currentStep, { kind: 'CHOICE', value: selectedChoice }, tuning);
                } else {
                    if (selectedFrets.length === 0) return;
                    isCorrect = validateDrillStep(currentStep, { kind: 'FRETS', frets: selectedFrets }, tuning);
                }

                if (!isCorrect) {
                    setMistakesCount(prev => prev + 1);
                }

                setCheckResult(isCorrect ? 'CORRECT' : 'INCORRECT');
                return;
            }

            if (checkResult === 'INCORRECT') {
                setSelectedFrets([]);
                setSelectedChoice(null);
                setCheckResult('IDLE');
                return;
            }
        }

        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
            setSelectedFrets([]);
            setSelectedChoice(null);
            setCheckResult('IDLE');
        } else {
            try {
                setIsSaving(true);
                const response = await api.post(`/modules/${moduleId}/complete`, { mistakesCount });

                const { totalXp, level, leveledUp, xpGained, streak } = response.data;

                await updateUserProgress(totalXp, level, streak);

                const drillCount = steps.filter(s => s.type === 'DRILL').length;

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
        const currentStep = steps[currentStepIndex];

        if (currentStep.type !== 'DRILL' || checkResult === 'CORRECT') return;
        if (usesChoiceInput(currentStep)) return;

        setCheckResult('IDLE');

        const isSingleSelection = isShapeMatchStep(currentStep) && (
          !!currentStep.targetNote ||
          currentStep.targetShape?.length === 1 ||
          currentStep.targetNotes?.length === 1
        );

        setSelectedFrets(prev => {
            const exists = prev.find(p => p.string === stringNum && p.fret === fretNum);

            if (exists) {
                return prev.filter(p => p.string !== stringNum || p.fret !== fretNum);
            }

            if (isSingleSelection) {
                return [{ string: stringNum, fret: fretNum }];
            }

            return [...prev, { string: stringNum, fret: fretNum }];
        });
    }

    function handleChoicePress(option: string) {
        const currentStep = steps[currentStepIndex];
        if (currentStep.type !== 'DRILL' || checkResult === 'CORRECT') return;

        setCheckResult('IDLE');
        setSelectedChoice(option);
    }

    function goBack() {
        navigation.goBack();
    }

    return {
        loading,
        isSaving,
        steps,
        currentStep: steps[currentStepIndex],
        currentStepIndex,
        selectedFrets,
        selectedChoice,
        checkResult,
        handleAction,
        handleFretPress,
        handleChoicePress,
        goBack,
        tuning
    };
}