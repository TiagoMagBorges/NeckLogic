import React from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import Svg, { Line, Rect, Text } from 'react-native-svg';
import { TabNoteEntry, SequenceNoteState } from '../../types/Lesson';
import { getDurationBeats } from '../../core/MusicEngine';
import { NOTATION_COLORS } from '../../core/theme';

const BEAT_WIDTH = 48;
const NOTE_INSET = 20;
const LEFT_MARGIN = 30;
const RIGHT_PADDING = 30;
const TOP_MARGIN = 16;
const STRING_SPACING = 18;
const STRING_COUNT = 6;

const STATE_COLORS: Record<SequenceNoteState, string> = {
  correct: NOTATION_COLORS.correct,
  incorrect: NOTATION_COLORS.incorrect,
  current: NOTATION_COLORS.current,
  pending: NOTATION_COLORS.accent,
};

interface TabDisplayProps {
  notes: TabNoteEntry[];
  beatsPerMeasure?: number;
  noteStates?: SequenceNoteState[];
}

export function TabDisplay({ notes, beatsPerMeasure = 4, noteStates }: TabDisplayProps) {
  const { width: screenWidth } = useWindowDimensions();

  const height = TOP_MARGIN * 2 + STRING_SPACING * (STRING_COUNT - 1);
  const stringY = (stringNum: number) => TOP_MARGIN + (stringNum - 1) * STRING_SPACING;

  const entries = notes.map((entry) => ({ ...entry, beats: getDurationBeats(entry.duration, entry.dotted) }));
  const totalBeats = entries.reduce((sum, entry) => sum + entry.beats, 0);

  const beatX = (beatPosition: number) => LEFT_MARGIN + beatPosition * BEAT_WIDTH;
  const measureWidth = beatsPerMeasure * BEAT_WIDTH;
  const contentMeasures = Math.max(Math.ceil((totalBeats + 0.5) / beatsPerMeasure), 1);
  const minMeasuresForScreen = Math.ceil((screenWidth - LEFT_MARGIN - RIGHT_PADDING) / measureWidth);
  const totalMeasures = Math.max(contentMeasures, minMeasuresForScreen, 1);

  const width = Math.max(beatX(totalMeasures * beatsPerMeasure) + RIGHT_PADDING, screenWidth);

  const barlineBeats = Array.from({ length: totalMeasures + 1 }, (_, m) => m * beatsPerMeasure);

  const beatOffsets: number[] = [];
  entries.reduce((cumulative, entry) => {
    beatOffsets.push(cumulative);
    return cumulative + entry.beats;
  }, 0);

  let noteCounter = -1;
  const notePositions = entries.map((entry, index) => {
    const x = beatX(beatOffsets[index]) + NOTE_INSET;
    const hasNote = entry.string !== undefined && entry.fret !== undefined;
    if (hasNote) noteCounter++;
    const color = hasNote ? STATE_COLORS[noteStates?.[noteCounter] ?? 'pending'] : NOTATION_COLORS.line;
    return { key: `note-${index}`, entry, x, hasNote, color };
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full">
      <View style={{ width, height, backgroundColor: NOTATION_COLORS.background }}>
        <Svg width={width} height={height}>
          {Array.from({ length: STRING_COUNT }, (_, i) => (
            <Line
              key={`string-${i}`}
              x1={LEFT_MARGIN - 10}
              y1={stringY(i + 1)}
              x2={beatX(totalMeasures * beatsPerMeasure)}
              y2={stringY(i + 1)}
              stroke="#52525B"
              strokeWidth={1}
            />
          ))}

          {barlineBeats.map((beatPosition) => (
            <Line
              key={`bar-${beatPosition}`}
              x1={beatX(beatPosition)}
              y1={stringY(1)}
              x2={beatX(beatPosition)}
              y2={stringY(STRING_COUNT)}
              stroke="#3F3F46"
              strokeWidth={1}
            />
          ))}

          {notePositions.map(({ key, entry, x, hasNote, color }) => {
            if (!hasNote) {
              return (
                <Text
                  key={key}
                  x={x}
                  y={stringY(1) + (stringY(STRING_COUNT) - stringY(1)) / 2 + 4}
                  fontSize={12}
                  fill={NOTATION_COLORS.line}
                  textAnchor="middle"
                >
                  𝄽
                </Text>
              );
            }

            const y = stringY(entry.string as number);
            return (
              <React.Fragment key={key}>
                <Rect x={x - 10} y={y - 8} width={20} height={16} fill={NOTATION_COLORS.background} />
                <Text x={x} y={y + 4} fontSize={12} fontWeight="bold" fill={color} textAnchor="middle">
                  {entry.fret}
                </Text>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </ScrollView>
  );
}