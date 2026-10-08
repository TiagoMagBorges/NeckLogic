import React from 'react';
import { View } from 'react-native';
import { CircleOfFifthsWheel } from '../../components/CircleOfFifthsWheel';
import { NOTATION_COLORS } from '../../core/theme';
import { LessonStep, TheoryIllustration } from '../../types/Lesson';

interface CircleOfFifthsExerciseProps {
  currentStep: LessonStep;
  isTheory: boolean;
  illustration: TheoryIllustration | undefined;
  selectedKey: string | null;
  checkResult: 'IDLE' | 'CORRECT' | 'INCORRECT';
  onSelectKey: (note: string) => void;
}

export function CircleOfFifthsExercise({
                                         currentStep,
                                         isTheory,
                                         illustration,
                                         selectedKey,
                                         checkResult,
                                         onSelectKey,
                                       }: CircleOfFifthsExerciseProps) {
  return (
    <View className="w-full mt-2 items-center">
      <CircleOfFifthsWheel
        selectedKeys={
          isTheory && illustration?.kind === 'circleOfFifths'
            ? illustration.highlightedKeys
            : selectedKey
              ? [selectedKey]
              : []
        }
        onSelectKey={currentStep.type === 'DRILL' && checkResult === 'IDLE' ? onSelectKey : undefined}
        highlightColors={
          checkResult !== 'IDLE'
            ? {
              ...(selectedKey ? { [selectedKey]: checkResult === 'CORRECT' ? NOTATION_COLORS.correct : NOTATION_COLORS.incorrect } : {}),
              ...(checkResult === 'INCORRECT' && currentStep.targetKey ? { [currentStep.targetKey as string]: NOTATION_COLORS.correct } : {}),
            }
            : undefined
        }
      />
    </View>
  );
}