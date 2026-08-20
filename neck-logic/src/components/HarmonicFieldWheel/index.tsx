import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

import { getHarmonicField, getChordFunction, ChordFunction } from '../../core/MusicEngine';

const FUNCTION_COLORS: Record<ChordFunction, string> = {
  tonic: '#00D9FF',
  subdominant: '#A855F7',
  dominant: '#F59E0B',
};

export interface HarmonicFieldWheelProps {
  size?: number;
  rootKey: string;
  mode: 'major' | 'minor';
  showFunctionColors?: boolean;
  selectedDegree?: string | null;
  onSelectDegree?: (degree: string) => void;
  checkResult?: 'IDLE' | 'CORRECT' | 'INCORRECT';
  disabled?: boolean;
}

export function HarmonicFieldWheel({
                                     size = 280,
                                     rootKey,
                                     mode,
                                     showFunctionColors = true,
                                     selectedDegree = null,
                                     onSelectDegree,
                                     checkResult = 'IDLE',
                                     disabled = false,
                                   }: HarmonicFieldWheelProps) {
  const center = size / 2;
  const radius = size / 2 - 36;

  const harmonicField = useMemo(() => getHarmonicField(rootKey, mode), [rootKey, mode]);

  const chordPositions = useMemo(() => {
    return harmonicField.map((chord, i) => {
      const angle = (i * (360 / harmonicField.length) - 90) * (Math.PI / 180);
      return {
        chord,
        index: i,
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
      };
    });
  }, [harmonicField, center, radius]);

  function colorsFor(degree: string, index: number) {
    const isSelected = onSelectDegree ? degree === selectedDegree : false;

    if (isSelected) {
      if (checkResult === 'CORRECT') return { fill: '#10B981', stroke: '#10B981', text: '#09090B' };
      if (checkResult === 'INCORRECT') return { fill: '#EF4444', stroke: '#EF4444', text: '#09090B' };
      return { fill: '#00D9FF', stroke: '#00D9FF', text: '#09090B' };
    }

    if (showFunctionColors) {
      const color = FUNCTION_COLORS[getChordFunction(index)];
      return { fill: color, stroke: color, text: '#09090B' };
    }

    return { fill: '#27272A', stroke: '#3F3F46', text: '#FFFFFF' };
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {chordPositions.map(({ chord, index, x, y }) => {
          const { fill, stroke, text } = colorsFor(chord.degree, index);
          return (
            <React.Fragment key={`chord-${chord.degree}`}>
              <Circle
                cx={x}
                cy={y}
                r={28}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
                onPress={disabled || !onSelectDegree ? undefined : () => onSelectDegree(chord.degree)}
              />
              <SvgText x={x} y={y - 2} fontSize={11} fontWeight="bold" fill={text} textAnchor="middle">
                {chord.degree}
              </SvgText>
              <SvgText x={x} y={y + 12} fontSize={10} fill={text} textAnchor="middle">
                {chord.root}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
