import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Line, Path, Circle, Text as SvgText, G } from 'react-native-svg';

import { PEG_POSITIONS, STRING_NUT_X, STRING_THICKNESS } from './constants';
import { useTheme } from '../../contexts/ThemeContext';

interface HeadstockSVGProps {
    tuning: string[];
    selectedString: number | null;
    onSelectString: (index: number) => void;
}

export function HeadstockSVG({ tuning, selectedString, onSelectString }: HeadstockSVGProps) {
    const { isDarkTheme } = useTheme();

    const headStart = isDarkTheme ? '#151515' : '#E5E5E5';
    const headMid = isDarkTheme ? '#202020' : '#F5F5F5';
    const neckStart = isDarkTheme ? '#141414' : '#D4D4D8';
    const neckMid = isDarkTheme ? '#1c1c1c' : '#E5E5E5';
    const strokeColor = isDarkTheme ? '#2c2c2c' : '#D4D4D8';
    const textColor = isDarkTheme ? '#2a2a2a' : '#A1A1AA';
    const pegFill = isDarkTheme ? '#1e1e1e' : '#FFFFFF';
    const pegStroke = isDarkTheme ? '#2d2d2d' : '#D4D4D8';
    const nutGradStart = isDarkTheme ? '#999' : '#D4D4D8';
    const nutGradEnd = isDarkTheme ? '#555' : '#A1A1AA';
    const slotColor = isDarkTheme ? '#3a3a3a' : '#71717A';
    const unselectedString = isDarkTheme ? '#484848' : '#A1A1AA';
    const pegBaseFill = isDarkTheme ? '#1a1a1a' : '#F5F5F5';
    const pegBaseStroke = isDarkTheme ? '#383838' : '#D4D4D8';
    const pegCenterFill = isDarkTheme ? '#101010' : '#FFFFFF';
    const pegCenterStroke = isDarkTheme ? '#2a2a2a' : '#D4D4D8';

    const primaryHighlight = isDarkTheme ? '#00D9FF' : '#00B8D4';
    const pegTextSelected = isDarkTheme ? '#121212' : '#FFFFFF';
    const pegTextUnselected = isDarkTheme ? '#e0e0e0' : '#71717A';

    return (
        <View className="w-full items-center" style={{ height: 360 }}>
            <Svg viewBox="0 0 260 390" width="100%" height="100%">
                <Defs>
                    <LinearGradient id="headGrad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0%" stopColor={headStart} />
                        <Stop offset="35%" stopColor={headMid} />
                        <Stop offset="65%" stopColor={headMid} />
                        <Stop offset="100%" stopColor={headStart} />
                    </LinearGradient>
                    <LinearGradient id="neckGrad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0%" stopColor={neckStart} />
                        <Stop offset="50%" stopColor={neckMid} />
                        <Stop offset="100%" stopColor={neckStart} />
                    </LinearGradient>
                    <LinearGradient id="nutGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor={nutGradStart} />
                        <Stop offset="100%" stopColor={nutGradEnd} />
                    </LinearGradient>
                </Defs>

                <Rect x="98" y="306" width="64" height="84" rx="5" fill="url(#neckGrad)" />
                <Line x1="130" y1="306" x2="130" y2="390" stroke={strokeColor} strokeWidth="0.6" />

                <Path
                    d="M 97,302 C 80,280 58,256 58,240 L 58,28 Q 58,10 80,10 L 180,10 Q 202,10 202,28 L 202,240 C 202,256 180,280 163,302 Z"
                    fill="url(#headGrad)"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                />

                <Line x1="130" y1="48" x2="130" y2="294" stroke={strokeColor} strokeWidth="0.8" />

                <SvgText
                    x="130" y="36"
                    textAnchor="middle"
                    fill={textColor}
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
                        fill={pegFill} stroke={pegStroke} strokeWidth="0.8"
                    />
                ))}

                {[3, 4, 5].map(i => (
                    <Rect
                        key={`ra-${i}`}
                        x="198" y={PEG_POSITIONS[i].y - 5}
                        width="16" height="10" rx="3"
                        fill={pegFill} stroke={pegStroke} strokeWidth="0.8"
                    />
                ))}

                <Rect x="101" y="296" width="58" height="10" rx="2.5" fill="url(#nutGrad)" />
                {STRING_NUT_X.map((x, i) => (
                    <Rect key={`slot-${i}`} x={x - 0.5} y={296} width={1} height={10} fill={slotColor} />
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
                            stroke={isSelected ? primaryHighlight : unselectedString}
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
                                    stroke={primaryHighlight}
                                    strokeWidth="1.2"
                                    opacity="0.35"
                                />
                            )}

                            <Circle
                                cx={peg.x} cy={peg.y} r={21}
                                fill={isSelected ? primaryHighlight : pegBaseFill}
                                stroke={isSelected ? primaryHighlight : pegBaseStroke}
                                strokeWidth="1.5"
                            />

                            <Circle
                                cx={peg.x} cy={peg.y} r={7}
                                fill={isSelected ? 'rgba(0,0,0,0.3)' : pegCenterFill}
                                stroke={isSelected ? 'rgba(0,0,0,0.15)' : pegCenterStroke}
                                strokeWidth="1"
                            />

                            <SvgText
                                x={peg.x} y={peg.y + 3}
                                textAnchor="middle"
                                fill={isSelected ? pegTextSelected : pegTextUnselected}
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