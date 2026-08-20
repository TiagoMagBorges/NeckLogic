import React, { useMemo, useState } from 'react';
import { View, ScrollView, LayoutChangeEvent } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

import { FretPosition } from '../../types/Lesson';
import { TUNINGS } from '../../core/MusicEngine';

export interface TabDisplayProps {
  notes: FretPosition[];
  tuning?: string[];
  beatsPerMeasure?: number;
}

const STRING_SPACING = 22;
const BEAT_WIDTH = 56;
const LABEL_MARGIN = 24;
const LINE_START = LABEL_MARGIN + 20;
const RIGHT_PADDING = 16;
const TOP_MARGIN = 16;

export function TabDisplay({ notes, tuning = TUNINGS.STANDARD, beatsPerMeasure = 4 }: TabDisplayProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const totalStrings = tuning.length;
  const height = TOP_MARGIN * 2 + (totalStrings - 1) * STRING_SPACING;

  // Tab convention: thinnest string (string 1) is drawn on top, thickest (highest
  // string number) on the bottom — matches the interactive Fretboard's own layout.
  const stringLines = useMemo(
    () => Array.from({ length: totalStrings }, (_, i) => ({
      y: TOP_MARGIN + i * STRING_SPACING,
      label: tuning[tuning.length - 1 - i],
    })),
    [totalStrings, tuning]
  );

  const measureWidth = beatsPerMeasure * BEAT_WIDTH;
  const usedMeasures = Math.max(Math.ceil(notes.length / beatsPerMeasure), 1);

  // Fill the available width with extra empty measures (capped at a fixed
  // measure width, never stretched) instead of centering a small block.
  const drawableWidth = Math.max(containerWidth - LINE_START - RIGHT_PADDING, 0);
  const measuresToFill = Math.floor(drawableWidth / measureWidth);
  const totalMeasures = Math.max(usedMeasures, measuresToFill);

  // Measure barlines: one before the first beat, one after every group of
  // `beatsPerMeasure` beats (used or empty), covering the full filled width.
  const barlineBeatIndices = useMemo(
    () => Array.from({ length: totalMeasures + 1 }, (_, m) => m * beatsPerMeasure),
    [totalMeasures, beatsPerMeasure]
  );

  const barlineX = (beatIndex: number) => LINE_START + beatIndex * BEAT_WIDTH - BEAT_WIDTH / 2;

  const contentWidth = barlineX(totalMeasures * beatsPerMeasure) + RIGHT_PADDING;
  const svgWidth = Math.max(contentWidth, containerWidth);

  function handleLayout(event: LayoutChangeEvent) {
    setContainerWidth(event.nativeEvent.layout.width);
  }

  return (
    <View
      onLayout={handleLayout}
      style={{ backgroundColor: '#18181B', borderRadius: 12, paddingVertical: 8 }}
    >
      {containerWidth > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ minWidth: '100%' }}
        >
          <Svg width={svgWidth} height={height}>
            {stringLines.map(({ y, label }, i) => (
              <React.Fragment key={`string-${i}`}>
                <SvgText
                  x={LABEL_MARGIN - 8}
                  y={y + 4}
                  fontSize={12}
                  fontWeight="bold"
                  fill="#71717A"
                  textAnchor="middle"
                >
                  {label}
                </SvgText>
                <Line
                  x1={barlineX(0)}
                  y1={y}
                  x2={barlineX(totalMeasures * beatsPerMeasure)}
                  y2={y}
                  stroke="#3F3F46"
                  strokeWidth={1}
                />
              </React.Fragment>
            ))}

            {barlineBeatIndices.map(beatIndex => (
              <Line
                key={`barline-${beatIndex}`}
                x1={barlineX(beatIndex)}
                y1={TOP_MARGIN - 6}
                x2={barlineX(beatIndex)}
                y2={height - TOP_MARGIN + 6}
                stroke="#52525B"
                strokeWidth={2}
              />
            ))}

            {notes.map((note, index) => {
              const x = LINE_START + index * BEAT_WIDTH;
              const y = TOP_MARGIN + (note.string - 1) * STRING_SPACING;

              return (
                <React.Fragment key={`note-${index}`}>
                  <Rect x={x - 10} y={y - 8} width={20} height={16} fill="#18181B" />
                  <SvgText
                    x={x}
                    y={y + 5}
                    fontSize={14}
                    fontWeight="bold"
                    fill="#00D9FF"
                    textAnchor="middle"
                  >
                    {note.fret}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </ScrollView>
      )}
    </View>
  );
}
