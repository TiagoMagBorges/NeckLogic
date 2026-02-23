import React from 'react';
import { View, ScrollView } from 'react-native';
import Svg, { Rect, Line, Circle, Text, G } from 'react-native-svg';

export interface FretboardNote {
    string: number;
    fret: number;
    label?: string;
    color?: string;
}

interface FretboardProps {
    frets?: number;
    notes?: FretboardNote[];
    onFretPress?: (stringNum: number, fretNum: number) => void;
}

export function Fretboard({ frets = 22, notes = [], onFretPress }: FretboardProps) {
    const FRET_WIDTH = 75;
    const NUT_OFFSET = 50;
    const SVG_HEIGHT = 260;
    const STRING_COUNT = 6;

    const SVG_WIDTH = (frets * FRET_WIDTH) + NUT_OFFSET;

    const FRET_TOP = 20;
    const FRET_BOTTOM = 220;
    const availableHeight = FRET_BOTTOM - FRET_TOP;
    const stringSpacing = availableHeight / (STRING_COUNT - 1);

    const fretsArray = Array.from({ length: frets + 1 }, (_, i) => i);
    const stringsArray = Array.from({ length: STRING_COUNT }, (_, i) => i);

    const singleInlays = [3, 5, 7, 9, 15, 17, 19, 21];
    const doubleInlays = [12, 24];
    const markedFrets = [0, ...singleInlays, ...doubleInlays];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="w-full"
            bounces={false}
        >
            <View style={{ width: SVG_WIDTH, height: SVG_HEIGHT }} className="bg-[#18181B] border-y border-border/20 shadow-xl">
                <Svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} width="100%" height="100%">
                    <Rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill="#18181B" />

                    {singleInlays.map((fret) => {
                        if (fret > frets) return null;
                        const cx = (fret * FRET_WIDTH) - (FRET_WIDTH / 2) + NUT_OFFSET;
                        const cy = FRET_TOP + (availableHeight / 2);
                        return <Circle key={`inlay-${fret}`} cx={cx} cy={cy} r="10" fill="#3F3F46" />;
                    })}

                    {doubleInlays.map((fret) => {
                        if (fret > frets) return null;
                        const cx = (fret * FRET_WIDTH) - (FRET_WIDTH / 2) + NUT_OFFSET;
                        const cyCenter = FRET_TOP + (availableHeight / 2);
                        return (
                            <React.Fragment key={`double-inlay-${fret}`}>
                                <Circle cx={cx} cy={cyCenter - 30} r="8" fill="#3F3F46" />
                                <Circle cx={cx} cy={cyCenter + 30} r="8" fill="#3F3F46" />
                            </React.Fragment>
                        );
                    })}

                    {fretsArray.map((i) => {
                        const x = (i * FRET_WIDTH) + NUT_OFFSET;
                        const isNut = i === 0;
                        return (
                            <Line
                                key={`fret-${i}`}
                                x1={x}
                                y1={FRET_TOP}
                                x2={x}
                                y2={FRET_BOTTOM}
                                stroke={isNut ? "#D4D4D8" : "#52525B"}
                                strokeWidth={isNut ? "6" : "3"}
                            />
                        );
                    })}

                    {stringsArray.map((i) => {
                        const y = FRET_TOP + (i * stringSpacing);
                        const stringThickness = 1.5 + (i * 0.7);
                        return (
                            <Line
                                key={`string-${i}`}
                                x1="0"
                                y1={y}
                                x2={SVG_WIDTH}
                                y2={y}
                                stroke="#A1A1AA"
                                strokeWidth={stringThickness}
                            />
                        );
                    })}

                    {markedFrets.map((fret) => {
                        if (fret > frets) return null;
                        const x = fret === 0
                            ? NUT_OFFSET / 2
                            : (fret * FRET_WIDTH) - (FRET_WIDTH / 2) + NUT_OFFSET;

                        return (
                            <Text
                                key={`fret-text-${fret}`}
                                x={x}
                                y={SVG_HEIGHT - 15}
                                fill="#71717A"
                                fontSize="12"
                                fontWeight="bold"
                                textAnchor="middle"
                            >
                                {fret}
                            </Text>
                        );
                    })}

                    {notes.map((note, index) => {
                        const cx = note.fret === 0
                            ? NUT_OFFSET / 2
                            : (note.fret * FRET_WIDTH) - (FRET_WIDTH / 2) + NUT_OFFSET;

                        const cy = FRET_TOP + ((note.string - 1) * stringSpacing);
                        const markerColor = note.color || '#00D9FF';

                        return (
                            <G key={`note-${index}-${note.string}-${note.fret}`}>
                                <Circle cx={cx} cy={cy} r="14" fill={markerColor} />
                                {note.label && (
                                    <Text
                                        x={cx}
                                        y={cy + 4}
                                        fill="#09090B"
                                        fontSize="14"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                    >
                                        {note.label}
                                    </Text>
                                )}
                            </G>
                        );
                    })}

                    {stringsArray.map((stringIndex) => {
                        return fretsArray.map((fretIndex) => {
                            const stringNum = stringIndex + 1;
                            const rectWidth = fretIndex === 0 ? NUT_OFFSET : FRET_WIDTH;
                            const rectX = fretIndex === 0 ? 0 : NUT_OFFSET + ((fretIndex - 1) * FRET_WIDTH);
                            const rectY = FRET_TOP + (stringIndex * stringSpacing) - (stringSpacing / 2);
                            const rectHeight = stringSpacing;

                            return (
                                <Rect
                                    key={`touch-${stringNum}-${fretIndex}`}
                                    x={rectX}
                                    y={rectY}
                                    width={rectWidth}
                                    height={rectHeight}
                                    fill="transparent"
                                    onPress={() => onFretPress && onFretPress(stringNum, fretIndex)}
                                />
                            );
                        });
                    })}
                </Svg>
            </View>
        </ScrollView>
    );
}