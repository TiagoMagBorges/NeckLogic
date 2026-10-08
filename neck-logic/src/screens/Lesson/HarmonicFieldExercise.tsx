import React from 'react';
import { View } from 'react-native';
import { HarmonicFieldWheel } from '../../components/HarmonicFieldWheel';
import { NOTATION_COLORS } from '../../core/theme';
import { LessonStep, TheoryIllustration } from '../../types/Lesson';

interface HarmonicFieldExerciseProps {
  currentStep: LessonStep;
  isTheory: boolean;
  illustration: TheoryIllustration | undefined;
  selectedDegree: string | null;
  checkResult: 'IDLE' | 'CORRECT' | 'INCORRECT';
  onSelectDegree: (degree: string) => void;
}

export function HarmonicFieldExercise({
                                        currentStep,
                                        isTheory,
                                        illustration,
                                        selectedDegree,
                                        checkResult,
                                        onSelectDegree,
                                      }: HarmonicFieldExerciseProps) {
  return (
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
        onSelectDegree={currentStep.type === 'DRILL' && checkResult === 'IDLE' ? onSelectDegree : undefined}
        highlightColors={
          checkResult !== 'IDLE'
            ? {
              ...(selectedDegree ? { [selectedDegree]: checkResult === 'CORRECT' ? NOTATION_COLORS.correct : NOTATION_COLORS.incorrect } : {}),
              ...(checkResult === 'INCORRECT' && currentStep.targetDegree
                ? { [currentStep.targetDegree as string]: NOTATION_COLORS.correct }
                : {}),
            }
            : undefined
        }
      />
    </View>
  );
}