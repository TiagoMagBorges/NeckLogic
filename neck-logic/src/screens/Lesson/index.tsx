import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

import { styles, getProgressStyle } from './styles';
import { Fretboard, FretboardNote } from '../../components/Fretboard';
import { getNoteAtFret, TUNINGS } from '../../core/MusicEngine';
import { useLesson } from '../../hooks/useLesson';

export default function LessonScreen() {
    const {
        loading,
        isSaving,
        steps,
        currentStep,
        currentStepIndex,
        selectedFret,
        checkResult,
        handleAction,
        handleFretPress,
        goBack
    } = useLesson();

    if (loading || !currentStep) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#00D9FF" />
            </View>
        );
    }

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