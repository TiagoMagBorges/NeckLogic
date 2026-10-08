import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface MultipleChoiceOptionsProps {
  options: string[];
  selectedOption: string | null;
  correctAnswer: string | undefined;
  checkResult: 'IDLE' | 'CORRECT' | 'INCORRECT';
  onSelect: (option: string) => void;
}

export function MultipleChoiceOptions({ options, selectedOption, correctAnswer, checkResult, onSelect }: MultipleChoiceOptionsProps) {
  return (
    <View className="w-full mt-2 gap-2.5">
      {options.map((option, index) => {
        const isSelected = option === selectedOption;
        let borderColor = 'border-border/15';
        let bgColor = 'bg-card';

        if (checkResult === 'CORRECT' && isSelected) {
          borderColor = 'border-green-500';
          bgColor = 'bg-green-500/10';
        } else if (checkResult === 'INCORRECT' && isSelected) {
          borderColor = 'border-red-500';
          bgColor = 'bg-red-500/10';
        } else if (checkResult === 'INCORRECT' && option === correctAnswer) {
          borderColor = 'border-green-500';
          bgColor = 'bg-green-500/10';
        } else if (isSelected) {
          borderColor = 'border-primary';
          bgColor = 'bg-primary/10';
        }

        return (
          <TouchableOpacity
            key={index}
            disabled={checkResult !== 'IDLE'}
            onPress={() => onSelect(option)}
            className={`py-3.5 px-4 rounded-xl border-[1.5px] ${borderColor} ${bgColor}`}
            activeOpacity={0.8}
          >
            <Text className="text-foreground font-semibold text-[15px]">{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}