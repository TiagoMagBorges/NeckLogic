import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, RotateCcw, Check } from 'lucide-react-native';

import { useAuth } from '../../contexts/AuthContext';
import {
    NOTES,
    STRING_LABELS,
    STRING_NAMES,
    DEFAULT_TUNING,
    POPULAR_TUNINGS,
    Category,
    TuningPreset
} from '../../components/GuitarTuning/constants';
import { HeadstockSVG } from '../../components/GuitarTuning/HeadstockSVG';
import { PresetList } from '../../components/GuitarTuning/PresetList';

export default function GuitarTuningScreen() {
    const navigation = useNavigation();
    const { tuning: globalTuning, updateTuning } = useAuth();

    const [localTuning, setLocalTuning] = useState<string[]>(globalTuning);
    const [selectedString, setSelectedString] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<Category>('all');
    const [saved, setSaved] = useState(false);

    const matchedPreset = POPULAR_TUNINGS.find(p => p.notes.every((n, i) => n === localTuning[i]));
    const currentTuningName = matchedPreset?.name ?? 'Custom';

    const applyPreset = (preset: TuningPreset) => {
        setLocalTuning([...preset.notes]);
        setSelectedString(null);
    };

    const updateString = (idx: number, note: string) => {
        const next = [...localTuning];
        next[idx] = note;
        setLocalTuning(next);
        setSelectedString(null);
    };

    const handleSelectString = (idx: number) => {
        setSelectedString(prev => (prev === idx ? null : idx));
    };

    const handleSave = async () => {
        await updateTuning(localTuning);
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
    };

    const handleReset = () => {
        setLocalTuning([...DEFAULT_TUNING]);
        setSelectedString(null);
    };

    const filtered = activeCategory === 'all'
        ? POPULAR_TUNINGS
        : POPULAR_TUNINGS.filter(t => t.category === activeCategory);

    return (
        <SafeAreaView className="flex-1 bg-background flex-col">
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-border/10 shrink-0">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                    className="w-10 h-10 rounded-full items-center justify-center bg-secondary mr-3 shrink-0"
                >
                    <ChevronLeft size={24} color="#A1A1AA" />
                </TouchableOpacity>

                <View className="flex-1">
                    <Text className="text-xl font-bold text-foreground leading-tight">Guitar Tuning</Text>
                    <Text className="text-sm text-primary">{currentTuningName}</Text>
                </View>

                <TouchableOpacity
                    onPress={handleReset}
                    activeOpacity={0.8}
                    className="w-10 h-10 rounded-full items-center justify-center bg-secondary mr-2 shrink-0"
                >
                    <RotateCcw size={18} color="#A1A1AA" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSave}
                    activeOpacity={0.8}
                    className={`px-4 h-10 rounded-full flex-row items-center justify-center shrink-0 ${saved ? 'bg-[#10B981]' : 'bg-primary'}`}
                >
                    {saved && <Check size={16} color="#121212" className="mr-1" />}
                    <Text className="text-[#121212] font-bold text-sm">{saved ? 'Salvo' : 'Salvar'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 pt-6 pb-2 items-center">
                    <HeadstockSVG
                        tuning={localTuning}
                        selectedString={selectedString}
                        onSelectString={handleSelectString}
                    />
                </View>

                <Text className="text-center text-xs text-muted-foreground mb-6">
                    Toque em uma tarraxa para alterar a nota da corda
                </Text>

                {selectedString !== null && (
                    <View className="w-full max-w-md self-center px-6 mb-8">
                        <View className="bg-card border border-primary/40 rounded-2xl overflow-hidden">
                            <View className="flex-row items-center justify-between px-4 py-3 border-b border-border/10">
                                <View className="flex-row items-center">
                                    <View className="w-6 h-6 rounded-full items-center justify-center bg-primary mr-2">
                                        <Text className="text-[#121212] text-xs font-bold">{STRING_LABELS[selectedString]}</Text>
                                    </View>
                                    <Text className="text-sm text-muted-foreground mr-1">
                                        {STRING_NAMES[selectedString]}
                                    </Text>
                                    <Text className="text-sm text-foreground">
                                        · Atual: <Text className="text-primary font-bold">{localTuning[selectedString]}</Text>
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => setSelectedString(null)} className="p-1">
                                    <Text className="text-muted-foreground text-lg">✕</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row flex-wrap p-4 gap-2 justify-center">
                                {NOTES.map(note => {
                                    const isActive = localTuning[selectedString] === note;
                                    return (
                                        <TouchableOpacity
                                            key={note}
                                            onPress={() => updateString(selectedString, note)}
                                            activeOpacity={0.8}
                                            className={`w-[14%] aspect-square min-w-[40px] max-w-[55px] rounded-xl items-center justify-center ${
                                                isActive ? 'bg-primary' : 'bg-secondary'
                                            }`}
                                        >
                                            <Text className={`font-bold ${isActive ? 'text-[#121212]' : 'text-foreground'}`}>
                                                {note}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                )}

                <View className="flex-row w-full max-w-md self-center px-6 mb-8 gap-2">
                    {localTuning.map((note, i) => (
                        <TouchableOpacity
                            key={`strip-${i}`}
                            onPress={() => handleSelectString(i)}
                            activeOpacity={0.8}
                            className={`flex-1 items-center py-3 rounded-xl border ${
                                selectedString === i
                                    ? 'bg-primary/10 border-primary'
                                    : 'bg-card border-border/10'
                            }`}
                        >
                            <Text className={`text-[10px] mb-1 ${selectedString === i ? 'text-primary' : 'text-muted-foreground'}`}>
                                {STRING_LABELS[i]}
                            </Text>
                            <Text className={`text-base font-bold ${selectedString === i ? 'text-primary' : 'text-foreground'}`}>
                                {note}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="w-full max-w-2xl self-center">
                    <PresetList
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        filteredPresets={filtered}
                        matchedPresetName={matchedPreset?.name}
                        onApplyPreset={applyPreset}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}