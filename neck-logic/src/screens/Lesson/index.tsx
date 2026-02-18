import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { api } from '../../services/api';
import { LessonContentDTO, LessonStep } from '../../@types/Lesson';
import { RootStackParamList } from '../../navigation/Routes';
import { styles, getProgressStyle } from './styles';

type LessonScreenRouteProp = RouteProp<RootStackParamList, 'Lesson'>;

export default function LessonScreen() {
    const navigation = useNavigation();
    const route = useRoute<LessonScreenRouteProp>();
    const { moduleId } = route.params;

    const [loading, setLoading] = useState(true);
    const [steps, setSteps] = useState<LessonStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

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

    function handleNext() {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            Alert.alert("Parabéns!", "Aula concluída.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        }
    }

    if (loading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#00D9FF" />
            </View>
        );
    }

    const currentStep = steps[currentStepIndex];

    return (
        <SafeAreaView className={styles.safeArea}>
            {/* Header */}
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
                    <View className="bg-card p-4 rounded-lg border border-border/20">
                        <Text className="text-primary text-center text-lg font-bold mb-2">
                            {currentStep.question}
                        </Text>
                        <Text className="text-muted-foreground text-center text-sm">
                            (O Braço da Guitarra interativo aparecerá aqui na próxima task)
                        </Text>
                    </View>
                )}
            </View>

            <View className={styles.footer}>
                <TouchableOpacity
                    className={styles.nextButton}
                    onPress={handleNext}
                    activeOpacity={0.8}
                >
                    <Text className={styles.nextButtonText}>
                        {currentStepIndex === steps.length - 1 ? 'Concluir' : 'Próximo'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}