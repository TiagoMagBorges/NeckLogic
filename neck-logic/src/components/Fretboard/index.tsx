import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, useWindowDimensions, Animated } from 'react-native';
import Svg, { Rect, Line, Circle, Text, G } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

export interface FretboardNote {
    string: number;
    fret: number;
    label?: string;
    color?: string;
    blink?: boolean;
    fadeOut?: boolean;
}

function BlinkingMarker({ cx, cy, radius, color }: { cx: number; cy: number; radius: number; color: string }) {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const animation = Animated.loop(
          Animated.sequence([
              Animated.timing(opacity, { toValue: 0.25, duration: 500, useNativeDriver: false }),
              Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: false })
          ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return <AnimatedCircle cx={cx} cy={cy} r={radius} fill={color} opacity={opacity} />;
}

function FadingGroup({ children }: { children: React.ReactNode }) {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const animation = Animated.sequence([
            Animated.delay(400),
            Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: false })
        ]);
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return <AnimatedG opacity={opacity}>{children}</AnimatedG>;
}

interface FretboardProps {
    frets?: number;
    notes?: FretboardNote[];
    onFretPress?: (stringNum: number, fretNum: number) => void;
    autoScroll?: boolean;
    focusFret?: number;
}

export function Fretboard({ frets = 22, notes = [], onFretPress, autoScroll = false, focusFret }: FretboardProps) {
    const scrollViewRef = useRef<ScrollView>(null);
    const [viewportWidth, setViewportWidth] = useState(0);
    const { width } = useWindowDimensions();
    const { isDarkTheme } = useTheme();

    const bgColor = isDarkTheme ? '#18181B' : '#F5F5F5';
    const inlayColor = isDarkTheme ? '#3F3F46' : '#D4D4D8';
    const nutColor = isDarkTheme ? '#D4D4D8' : '#71717A';
    const fretLineColor = isDarkTheme ? '#52525B' : '#A1A1AA';
    const stringColor = isDarkTheme ? '#A1A1AA' : '#52525B';
    const fretNumberColor = isDarkTheme ? '#71717A' : '#A1A1AA';
    const noteTextColor = isDarkTheme ? '#09090B' : '#FFFFFF';

    const isWidescreen = width > 768;
    const FRET_WIDTH = isWidescreen ? 85 : 75;
    const SVG_HEIGHT = isWidescreen ? 340 : 260;
    const NUT_OFFSET = isWidescreen ? 60 : 50;

    const FRET_TOP = isWidescreen ? 30 : 20;
    const FRET_BOTTOM = SVG_HEIGHT - (isWidescreen ? 50 : 40);
    const MARKER_RADIUS = isWidescreen ? 16 : 14;
    const FONT_SIZE = isWidescreen ? "16" : "14";

    const STRING_COUNT = 6;
    const SVG_WIDTH = (frets * FRET_WIDTH) + NUT_OFFSET;

    const availableHeight = FRET_BOTTOM - FRET_TOP;
    const stringSpacing = availableHeight / (STRING_COUNT - 1);
    const shouldCenter = SVG_WIDTH < (width - 48);

    const fretsArray = Array.from({ length: frets + 1 }, (_, i) => i);
    const stringsArray = Array.from({ length: STRING_COUNT }, (_, i) => i);

    const singleInlays = [3, 5, 7, 9, 15, 17, 19, 21];
    const doubleInlays = [12, 24];
    const markedFrets = [0, ...singleInlays, ...doubleInlays];

    useEffect(() => {
        if (!scrollViewRef.current || !autoScroll || !viewportWidth || shouldCenter) return;

        const targetFret = focusFret ?? (notes.length > 0 ? Math.min(...notes.map(n => n.fret)) : undefined);
        if (targetFret === undefined) return;

        const targetX = targetFret === 0
          ? NUT_OFFSET / 2
          : (targetFret * FRET_WIDTH) - (FRET_WIDTH / 2) + NUT_OFFSET;

        const leftEdge = targetX - MARKER_RADIUS;
        const rightEdge = targetX + MARKER_RADIUS;

        if (leftEdge >= 0 && rightEdge <= viewportWidth) return;

        const margin = FRET_WIDTH / 2;
        const scrollX = Math.max(0, rightEdge + margin - viewportWidth);

        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: scrollX, animated: true });
        }, 50);
    }, [notes, autoScroll, FRET_WIDTH, focusFret, viewportWidth, shouldCenter, NUT_OFFSET, MARKER_RADIUS]);

    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={isWidescreen}
        className="w-full"
        bounces={false}
        onLayout={(e) => setViewportWidth(e.nativeEvent.layout.width)}
        contentContainerStyle={{
            flexGrow: 1,
            minWidth: '100%',
            justifyContent: shouldCenter ? 'center' : 'flex-start'
        }}
      >
          <View style={{ width: SVG_WIDTH, height: SVG_HEIGHT }} className="bg-card border-y border-border/20 shadow-xl">
              <Svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} width="100%" height="100%">
                  <Rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill={bgColor} />

                  {singleInlays.map((fret) => {
                      if (fret > frets) return null;
                      const cx = (fret * FRET_WIDTH) - (FRET_WIDTH / 2) + NUT_OFFSET;
                      const cy = FRET_TOP + (availableHeight / 2);
                      return <Circle key={`inlay-${fret}`} cx={cx} cy={cy} r={isWidescreen ? "12" : "10"} fill={inlayColor} />;
                  })}

                  {doubleInlays.map((fret) => {
                      if (fret > frets) return null;
                      const cx = (fret * FRET_WIDTH) - (FRET_WIDTH / 2) + NUT_OFFSET;
                      const cyCenter = FRET_TOP + (availableHeight / 2);
                      const offset = isWidescreen ? 40 : 30;
                      return (
                        <React.Fragment key={`double-inlay-${fret}`}>
                            <Circle cx={cx} cy={cyCenter - offset} r={isWidescreen ? "10" : "8"} fill={inlayColor} />
                            <Circle cx={cx} cy={cyCenter + offset} r={isWidescreen ? "10" : "8"} fill={inlayColor} />
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
                          stroke={isNut ? nutColor : fretLineColor}
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
                          stroke={stringColor}
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
                          y={SVG_HEIGHT - (isWidescreen ? 20 : 15)}
                          fill={fretNumberColor}
                          fontSize={isWidescreen ? "14" : "12"}
                          fontFamily="SpaceMono_700Bold"
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
                      const markerColor = note.color || (isDarkTheme ? '#00D9FF' : '#00B8D4');

                      const markerContent = (
                        <>
                            {note.blink ? (
                              <BlinkingMarker cx={cx} cy={cy} radius={MARKER_RADIUS} color={markerColor} />
                            ) : (
                              <Circle cx={cx} cy={cy} r={MARKER_RADIUS} fill={markerColor} />
                            )}
                            {note.label && (
                              <Text
                                x={cx}
                                y={cy + (isWidescreen ? 5 : 4)}
                                fill={noteTextColor}
                                fontSize={FONT_SIZE}
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                  {note.label}
                              </Text>
                            )}
                        </>
                      );

                      return (
                        <G key={`note-${index}-${note.string}-${note.fret}`}>
                            {note.fadeOut ? <FadingGroup>{markerContent}</FadingGroup> : markerContent}
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