import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { api } from '../services/api';
import { LessonContentDTO, LessonStep } from '../types/Lesson';
import { RootStackParamList } from '../navigation/Routes';
import { getNoteAtFret, TUNINGS } from '../core/MusicEngine';
import { useAuth } from '../contexts/AuthContext';

type LessonScreenRouteProp = RouteProp<RootStackParamList, 'Lesson'>;

export function useLesson() {
    const navigation = useNavigation<any>();
    const route = useRoute<LessonScreenRouteProp>();
    const { moduleId } = route.params;
    const { updateUserProgress } = useAuth();

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [steps, setSteps] = useState<LessonStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const [selectedFrets, setSelectedFrets] = useState<{ string: number; fret: number }[]>([]);
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
                Alert.alert("Aviso", "Esta aula ainda não tem conteúdo.");
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert("Erro", "Falha ao carregar a aula.");
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    }

    async function handleAction() {
        const currentStep = steps[currentStepIndex];

        if (currentStep.type === 'DRILL') {
            if (checkResult === 'IDLE') {
                if (selectedFrets.length === 0) return;

                let isCorrect = false;

                if (currentStep.targetShape && currentStep.targetShape.length > 0) {
                    if (selectedFrets.length === currentStep.targetShape.length) {
                        isCorrect = currentStep.targetShape.every(target =>
                            selectedFrets.some(sel => sel.string === target.string && sel.fret === target.fret)
                        );
                    }
                } else if (currentStep.targetNotes && currentStep.targetNotes.length > 0) {
                    const selectedNoteNames = selectedFrets.map(f =>
                        getNoteAtFret(TUNINGS.STANDARD[f.string - 1], f.fret).toUpperCase()
                    );
                    const targets = currentStep.targetNotes.map(n => n.toUpperCase());

                    const allSelectedValid = selectedNoteNames.every(n => targets.includes(n));
                    const allTargetsFound = targets.every(t => selectedNoteNames.includes(t));

                    isCorrect = allSelectedValid && allTargetsFound;
                } else if (currentStep.targetNote) {
                    if (selectedFrets.length === 1) {
                        const openNote = TUNINGS.STANDARD[selectedFrets[0].string - 1];
                        const clickedNoteName = getNoteAtFret(openNote, selectedFrets[0].fret);
                        isCorrect = clickedNoteName.toUpperCase() === currentStep.targetNote.toUpperCase();
                    }
                }

                if (!isCorrect) {
                    setMistakesCount(prev => prev + 1);
                }

                setCheckResult(isCorrect ? 'CORRECT' : 'INCORRECT');
                return;
            }

            if (checkResult === 'INCORRECT') {
                setSelectedFrets([]);
                setCheckResult('IDLE');
                return;
            }
        }

        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
            setSelectedFrets([]);
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
                Alert.alert("Erro", "Não foi possível salvar o progresso.");
            } finally {
                setIsSaving(false);
            }
        }
    }

    function handleFretPress(stringNum: number, fretNum: number) {
        const currentStep = steps[currentStepIndex];

        if (currentStep.type !== 'DRILL' || checkResult === 'CORRECT') return;

        setCheckResult('IDLE');

        const isSingleSelection = !!currentStep.targetNote ||
            currentStep.targetShape?.length === 1 ||
            currentStep.targetNotes?.length === 1;

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
        checkResult,
        handleAction,
        handleFretPress,
        goBack
    };
}