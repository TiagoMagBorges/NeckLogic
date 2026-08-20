import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

import { CIRCLE_OF_FIFTHS } from '../../core/MusicEngine';

export interface CircleOfFifthsWheelProps {
  size?: number;
  selectedKey: string | null;
  onSelectKey: (note: string) => void;
  checkResult?: 'IDLE' | 'CORRECT' | 'INCORRECT';
  disabled?: boolean;
}

export function CircleOfFifthsWheel({
                                      size = 280,
                                      selectedKey,
                                      onSelectKey,
                                      checkResult = 'IDLE',
                                      disabled = false,
                                    }: CircleOfFifthsWheelProps) {
  const center = size / 2;
  const radius = size / 2 - 32;

  const keyPositions = useMemo(() => {
    return CIRCLE_OF_FIFTHS.map((note, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      return {
        note,
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
      };
    });
  }, [center, radius]);

  function colorsFor(note: string) {
    const isSelected = note === selectedKey;
    if (!isSelected) {
      return { fill: '#18181B', stroke: '#3F3F46', text: '#FFFFFF' };
    }
    if (checkResult === 'CORRECT') {
      return { fill: '#10B981', stroke: '#10B981', text: '#09090B' };
    }
    if (checkResult === 'INCORRECT') {
      return { fill: '#EF4444', stroke: '#EF4444', text: '#09090B' };
    }
    return { fill: '#00D9FF', stroke: '#00D9FF', text: '#09090B' };
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {keyPositions.map(({ note, x, y }) => {
          const { fill, stroke, text } = colorsFor(note);
          return (
            <React.Fragment key={`key-${note}`}>
              <Circle
                cx={x}
                cy={y}
                r={22}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
                onPress={disabled ? undefined : () => onSelectKey(note)}
              />
              <SvgText
                x={x}
                y={y + 6}
                fontSize={16}
                fontWeight="bold"
                fill={text}
                textAnchor="middle"
                onPress={disabled ? undefined : () => onSelectKey(note)}
              >
                {note}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
