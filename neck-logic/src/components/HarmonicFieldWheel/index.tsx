import React, { useMemo } from 'react';
import Svg, { Circle, G, Text } from 'react-native-svg';
import { getHarmonicField } from '../../core/MusicEngine';

const FUNCTION_COLORS: Record<string, string> = {
  major: '#00D9FF',
  minor: '#A855F7',
  dim: '#F59E0B',
};

interface HarmonicFieldWheelProps {
  size?: number;
  rootKey: string;
  mode: 'major' | 'minor';
  selectedDegrees: string[];
  onSelectDegree?: (degree: string) => void;
  highlightColors?: Record<string, string>;
}

export function HarmonicFieldWheel({ size = 240, rootKey, mode, selectedDegrees, onSelectDegree, highlightColors }: HarmonicFieldWheelProps) {
  const center = size / 2;
  const radius = size / 2 - 32;
  const isInteractive = !!onSelectDegree;

  const harmonicField = useMemo(() => getHarmonicField(rootKey, mode), [rootKey, mode]);

  const chordPositions = useMemo(
    () =>
      harmonicField.map((chord, i) => {
        const angle = (i * (360 / harmonicField.length) - 90) * (Math.PI / 180);
        return { chord, isTonic: i === 0, x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) };
      }),
    [harmonicField, center, radius]
  );

  return (
    <Svg width={size} height={size}>
      {chordPositions.map(({ chord, isTonic, x, y }) => {
        const isSelected = selectedDegrees.includes(chord.degree);
        const override = highlightColors?.[chord.degree];

        const baseFill = isInteractive
          ? isTonic
            ? '#00D9FF'
            : '#27272A'
          : (FUNCTION_COLORS[chord.quality] ?? '#27272A');

        const fill = override ?? (isSelected ? '#00D9FF' : baseFill);
        const stroke = override ?? fill;

        return (
          <G key={chord.degree} onPress={onSelectDegree ? () => onSelectDegree(chord.degree) : undefined}>
            <Circle cx={x} cy={y} r={24} fill={fill} stroke={stroke} strokeWidth={2} />
            {!isInteractive && (
              <Text x={x} y={y - 2} fontSize={11} fontWeight="bold" fill="#09090B" textAnchor="middle">
                {chord.degree}
              </Text>
            )}
            <Text
              x={x}
              y={isInteractive ? y + 4 : y + 12}
              fontSize={isInteractive ? 12 : 10}
              fontWeight={isInteractive ? 'bold' : 'normal'}
              fill="#09090B"
              textAnchor="middle"
            >
              {chord.root}
            </Text>
          </G>
        );
      })}
    </Svg>
  );
}