import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Line, Path, Circle, Text as SvgText, G } from 'react-native-svg';

import { PEG_POSITIONS, STRING_NUT_X, STRING_THICKNESS } from './constants';

interface HeadstockSVGProps {
    tuning: string[];
    selectedString: number | null;
    onSelectString: (index: number) => void;
}

export function HeadstockSVG({ tuning, selectedString, onSelectString }: HeadstockSVGProps) {
    return (
        <View className="w-full items-center" style={{ height: 360 }}>
            <Svg viewBox="0 0 260 390" width="100%" height="100%">
                <Defs>
                    <LinearGradient id="headGrad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0%" stopColor="#151515" />
                        <Stop offset="35%" stopColor="#202020" />
                        <Stop offset="65%" stopColor="#202020" />
                        <Stop offset="100%" stopColor="#151515" />
                    </LinearGradient>
                    <LinearGradient id="neckGrad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0%" stopColor="#141414" />
                        <Stop offset="50%" stopColor="#1c1c1c" />
                        <Stop offset="100%" stopColor="#141414" />
                    </LinearGradient>
                    <LinearGradient id="nutGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#999" />
                        <Stop offset="100%" stopColor="#555" />
                    </LinearGradient>
                </Defs>

                <Rect x="108" y="306" width="64" height="84" rx="5" fill="url(#neckGrad)" />
                <Line x1="140" y1="306" x2="140" y2="390" stroke="#242424" strokeWidth="0.6" />

                <Path
                    d="M 97,302 C 80,280 58,256 58,240 L 58,28 Q 58,10 80,10 L 180,10 Q 202,10 202,28 L 202,240 C 202,256 180,280 163,302 Z"
                    fill="url(#headGrad)"
                    stroke="#2c2c2c"
                    strokeWidth="1.5"
                />

                <Line x1="130" y1="48" x2="130" y2="294" stroke="#272727" strokeWidth="0.8" />

                <SvgText
                    x="130" y="36"
                    textAnchor="middle"
                    fill="#2a2a2a"
                    fontSize="7.5"
                    letterSpacing="4"
                    fontWeight="bold"
                >
                    NECKLOGIC
                </SvgText>

                {[0, 1, 2].map(i => (
                    <Rect
                        key={`la-${i}`}
                        x="46" y={PEG_POSITIONS[i].y - 5}
                        width="16" height="10" rx="3"
                        fill="#1e1e1e" stroke="#2d2d2d" strokeWidth="0.8"
                    />
                ))}

                {[3, 4, 5].map(i => (
                    <Rect
                        key={`ra-${i}`}
                        x="198" y={PEG_POSITIONS[i].y - 5}
                        width="16" height="10" rx="3"
                        fill="#1e1e1e" stroke="#2d2d2d" strokeWidth="0.8"
                    />
                ))}

                <Rect x="101" y="296" width="58" height="10" rx="2.5" fill="url(#nutGrad)" />
                {STRING_NUT_X.map((x, i) => (
                    <Rect key={`slot-${i}`} x={x - 0.5} y={296} width={1} height={10} fill="#3a3a3a" />
                ))}

                {STRING_NUT_X.map((nutX, i) => {
                    const peg = PEG_POSITIONS[i];
                    const isSelected = selectedString === i;
                    const isDimmed = selectedString !== null && !isSelected;
                    return (
                        <Line
                            key={`str-${i}`}
                            x1={nutX} y1={306}
                            x2={peg.x} y2={peg.y}
                            stroke={isSelected ? '#00D9FF' : '#484848'}
                            strokeWidth={STRING_THICKNESS[i]}
                            strokeOpacity={isDimmed ? 0.25 : 1}
                            strokeLinecap="round"
                        />
                    );
                })}

                {PEG_POSITIONS.map((peg, i) => {
                    const isSelected = selectedString === i;
                    return (
                        <G key={`peg-${i}`} onPress={() => onSelectString(i)}>
                            <Circle cx={peg.x} cy={peg.y} r={28} fill="transparent" />

                            {isSelected && (
                                <Circle
                                    cx={peg.x} cy={peg.y} r={25}
                                    fill="none"
                                    stroke="#00D9FF"
                                    strokeWidth="1.2"
                                    opacity="0.35"
                                />
                            )}

                            <Circle
                                cx={peg.x} cy={peg.y} r={21}
                                fill={isSelected ? '#00D9FF' : '#1a1a1a'}
                                stroke={isSelected ? '#00D9FF' : '#383838'}
                                strokeWidth="1.5"
                            />

                            <Circle
                                cx={peg.x} cy={peg.y} r={7}
                                fill={isSelected ? 'rgba(0,0,0,0.3)' : '#101010'}
                                stroke={isSelected ? 'rgba(0,0,0,0.15)' : '#2a2a2a'}
                                strokeWidth="1"
                            />

                            <SvgText
                                x={peg.x} y={peg.y + 3}
                                textAnchor="middle"
                                fill={isSelected ? '#121212' : '#e0e0e0'}
                                fontSize="12"
                                fontWeight="bold"
                            >
                                {tuning[i]}
                            </SvgText>
                        </G>
                    );
                })}
            </Svg>
        </View>
    );
}