import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import Svg, { Line, Rect, Text } from 'react-native-svg';
import { FretPosition } from '../../types/Lesson';

const STEP_WIDTH = 44;
const LEFT_MARGIN = 30;
const RIGHT_PADDING = 30;
const TOP_MARGIN = 16;
const STRING_SPACING = 18;
const STRING_COUNT = 6;
const NOTES_PER_MEASURE = 4;

interface TabDisplayProps {
  sequence: FretPosition[];
}

export function TabDisplay({ sequence }: TabDisplayProps) {
  const { width: screenWidth } = useWindowDimensions();

  const height = TOP_MARGIN * 2 + STRING_SPACING * (STRING_COUNT - 1);
  const stringY = (stringNum: number) => TOP_MARGIN + (stringNum - 1) * STRING_SPACING;

  const stepX = (position: number) => LEFT_MARGIN + position * STEP_WIDTH;
  const measureWidth = NOTES_PER_MEASURE * STEP_WIDTH;

  const contentMeasures = Math.max(Math.ceil(sequence.length / NOTES_PER_MEASURE), 1);
  const minMeasuresForScreen = Math.ceil((screenWidth - LEFT_MARGIN - RIGHT_PADDING) / measureWidth);
  const totalMeasures = Math.max(contentMeasures, minMeasuresForScreen, 1);

  const width = Math.max(stepX(totalMeasures * NOTES_PER_MEASURE) + RIGHT_PADDING, screenWidth);

  const barlineSteps = Array.from({ length: totalMeasures + 1 }, (_, m) => m * NOTES_PER_MEASURE);

  return (
    <View style={{ width, height, backgroundColor: '#18181B' }}>
      <Svg width={width} height={height}>
        {Array.from({ length: STRING_COUNT }, (_, i) => (
          <Line
            key={`string-${i}`}
            x1={LEFT_MARGIN - 10}
            y1={stringY(i + 1)}
            x2={stepX(totalMeasures * NOTES_PER_MEASURE)}
            y2={stringY(i + 1)}
            stroke="#52525B"
            strokeWidth={1}
          />
        ))}

        {barlineSteps.map((step) => (
          <Line
            key={`bar-${step}`}
            x1={stepX(step)}
            y1={stringY(1)}
            x2={stepX(step)}
            y2={stringY(STRING_COUNT)}
            stroke="#3F3F46"
            strokeWidth={1}
          />
        ))}

        {sequence.map((pos, index) => {
          const x = stepX(index) + STEP_WIDTH / 2;
          const y = stringY(pos.string);
          return (
            <React.Fragment key={`note-${index}`}>
              <Rect x={x - 10} y={y - 8} width={20} height={16} fill="#18181B" />
              <Text x={x} y={y + 4} fontSize={12} fontWeight="bold" fill="#00D9FF" textAnchor="middle">
                {pos.fret}
              </Text>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}