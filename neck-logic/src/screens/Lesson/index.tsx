import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { api } from '../../services/api';
import { LessonContentDTO, LessonStep } from '../../@types/Lesson';
import { RootStackParamList } from '../../navigation/Routes';
import { styles, getProgressStyle } from './styles';
import { Fretboard, FretboardNote } from '../../components/Fretboard';
import { getNoteAtFret, TUNINGS } from '../../core/MusicEngine';

type LessonScreenRouteProp = RouteProp<RootStackParamList, 'Lesson'>;

export default function LessonScreen() {
    const navigation = useNavigation();
    const route = useRoute<LessonScreenRouteProp>();
    const { moduleId } = route.params;

    const [loading, setLoading] = useState(true);
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

    function handleAction() {
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
            Alert.alert("Parabéns!", "Aula concluída.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        }
    }

    function handleFretPress(stringNum: number, fretNum: number) {
        const currentStep = steps[currentStepIndex];

        if (currentStep.type !== 'DRILL' || checkResult === 'CORRECT') return;

        setCheckResult('IDLE');
        setSelectedFret({ string: stringNum, fret: fretNum });
    }

    if (loading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#00D9FF" />
            </View>
        );
    }

    const currentStep = steps[currentStepIndex];

    const notesToRender: FretboardNote[] = [];
    if (selectedFret) {
        let color = '#00D9FF';
        let label: string | undefined = undefined;

        if (checkResult === 'CORRECT') {
            color = '#10B981';
            label = getNoteAtFret(TUNINGS.STANDARD[selectedFret.string - 1], selectedFret.fret);
        } else if (checkResult === 'INCORRECT') {
            color = '#EF4444';
            label = getNoteAtFret(TUNINGS.STANDARD[selectedFret.string - 1], selectedFret.fret);
        }

        notesToRender.push({
            string: selectedFret.string,
            fret: selectedFret.fret,
            color,
            label
        });
    }

    let buttonText = currentStepIndex === steps.length - 1 ? 'Concluir' : 'Próximo';
    let isButtonDisabled = false;

    if (currentStep.type === 'DRILL') {
        if (checkResult === 'IDLE') {
            buttonText = 'Conferir';
            isButtonDisabled = !selectedFret;
        } else if (checkResult === 'INCORRECT') {
            buttonText = 'Tentar Novamente';
        }
    }

    return (
        <SafeAreaView className={styles.safeArea}>
            <View className={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} className={styles.closeButton}>
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
                        <Text className={styles.imagePlaceholderText}>Image: {currentStep.imageUrl}</Text>
                    </View>
                )}

                <Text className={styles.title}>{currentStep.title}</Text>

                {currentStep.type === 'THEORY' ? (
                    <Text className={styles.bodyText}>{currentStep.text}</Text>
                ) : (
                    <View className="w-full mt-4">
                        <Text className="text-primary text-center text-xl font-bold mb-6">
                            {currentStep.question}
                        </Text>

                        <View style={{ marginHorizontal: -24 }}>
                            <Fretboard
                                frets={22}
                                notes={notesToRender}
                                onFretPress={handleFretPress}
                            />
                        </View>
                    </View>
                )}
            </View>

            <View className={styles.footer}>
                <TouchableOpacity
                    className={`${styles.nextButton} ${isButtonDisabled ? 'opacity-50' : 'opacity-100'}`}
                    onPress={handleAction}
                    activeOpacity={0.8}
                    disabled={isButtonDisabled}
                >
                    <Text className={styles.nextButtonText}>
                        {buttonText}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}