import React, { useMemo } from 'react';
import Svg, { Circle, G, Text } from 'react-native-svg';
import { CIRCLE_OF_FIFTHS } from '../../core/MusicEngine';

interface CircleOfFifthsWheelProps {
  size?: number;
  selectedKeys: string[];
  onSelectKey?: (note: string) => void;
  highlightColors?: Record<string, string>;
}

export function CircleOfFifthsWheel({ size = 240, selectedKeys, onSelectKey, highlightColors }: CircleOfFifthsWheelProps) {
  const center = size / 2;
  const radius = size / 2 - 28;

  const keyPositions = useMemo(
    () =>
      CIRCLE_OF_FIFTHS.map((note, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        return { note, x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) };
      }),
    [center, radius]
  );

  return (
    <Svg width={size} height={size}>
      {keyPositions.map(({ note, x, y }) => {
        const isSelected = selectedKeys.includes(note);
        const override = highlightColors?.[note];
        const fill = override ?? (isSelected ? '#00D9FF' : '#18181B');
        const stroke = override ?? (isSelected ? '#00D9FF' : '#3F3F46');
        const text = override || isSelected ? '#09090B' : '#FFFFFF';

        return (
          <G key={note} onPress={onSelectKey ? () => onSelectKey(note) : undefined}>
            <Circle cx={x} cy={y} r={19} fill={fill} stroke={stroke} strokeWidth={2} />
            <Text x={x} y={y + 5} fontSize={14} fontWeight="bold" fill={text} textAnchor="middle">
              {note}
            </Text>
          </G>
        );
      })}
    </Svg>
  );
}