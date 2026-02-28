import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { api } from '../services/api';
import { LessonContentDTO, LessonStep } from '../types/Lesson';
import { RootStackParamList } from '../navigation/Routes';
import { getNoteAtFret, TUNINGS } from '../core/MusicEngine';

type LessonScreenRouteProp = RouteProp<RootStackParamList, 'Lesson'>;

export function useLesson() {
    const navigation = useNavigation<any>();
    const route = useRoute<LessonScreenRouteProp>();
    const { moduleId } = route.params;

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [steps, setSteps] = useState<LessonStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const [selectedFret, setSelectedFret] = useState<{ string: number; fret: number } | null>(null);
    const [checkResult, setCheckResult] = useState<'IDLE' | 'CORRECT' | 'INCORRECT'>('IDLE');

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
            console.error(error);
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
                if (!selectedFret) return;

                const openNote = TUNINGS.STANDARD[selectedFret.string - 1];
                const clickedNoteName = getNoteAtFret(openNote, selectedFret.fret);
                const target = currentStep.targetNote || '';

                if (clickedNoteName.toUpperCase() === target.toUpperCase()) {
                    setCheckResult('CORRECT');
                } else {
                    setCheckResult('INCORRECT');
                }
                return;
            }

            if (checkResult === 'INCORRECT') {
                setSelectedFret(null);
                setCheckResult('IDLE');
                return;
            }
        }

        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
            setSelectedFret(null);
            setCheckResult('IDLE');
        } else {
            try {
                setIsSaving(true);
                await api.post(`/modules/${moduleId}/complete`);
                navigation.navigate('LogicPath');

            } catch (error: any) {
                console.error("Erro na API:", error?.response?.data || error.message);
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
        setSelectedFret({ string: stringNum, fret: fretNum });
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
        selectedFret,
        checkResult,
        handleAction,
        handleFretPress,
        goBack
    };
}