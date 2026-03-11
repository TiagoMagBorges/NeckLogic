import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { Category, CATEGORY_LABELS, TuningPreset } from './constants';

interface PresetListProps {
    activeCategory: Category;
    setActiveCategory: (cat: Category) => void;
    filteredPresets: TuningPreset[];
    matchedPresetName?: string;
    onApplyPreset: (preset: TuningPreset) => void;
}

export function PresetList({
                               activeCategory,
                               setActiveCategory,
                               filteredPresets,
                               matchedPresetName,
                               onApplyPreset
                           }: PresetListProps) {
    return (
        <View className="px-6 pb-12">
            <Text className="text-lg font-bold text-foreground mb-4">Afinações Populares</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 flex-row">
                {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => setActiveCategory(cat)}
                        activeOpacity={0.8}
                        className={`px-4 py-2 rounded-full mr-2 ${
                            activeCategory === cat ? 'bg-primary' : 'bg-secondary'
                        }`}
                    >
                        <Text className={`font-medium ${activeCategory === cat ? 'text-[#121212]' : 'text-muted-foreground'}`}>
                            {CATEGORY_LABELS[cat]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View className="gap-3">
                {filteredPresets.map(preset => {
                    const isActive = matchedPresetName === preset.name;
                    return (
                        <TouchableOpacity
                            key={preset.name}
                            onPress={() => onApplyPreset(preset)}
                            activeOpacity={0.8}
                            className={`w-full p-4 rounded-xl border ${
                                isActive ? 'bg-primary/10 border-primary/50' : 'bg-card border-border/10'
                            }`}
                        >
                            <View className="flex-row items-center mb-1">
                                <Text className={`text-base font-bold mr-2 ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                    {preset.name}
                                </Text>
                                {isActive && (
                                    <View className="bg-primary px-2 py-0.5 rounded-full">
                                        <Text className="text-[#121212] text-[10px] font-bold uppercase">Ativa</Text>
                                    </View>
                                )}
                                <View className="flex-1 items-end">
                                    <Text className={`text-xs font-mono font-bold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {preset.notes.join(' · ')}
                                    </Text>
                                </View>
                            </View>

                            {preset.artist && (
                                <Text className="text-xs text-muted-foreground font-medium mb-1">{preset.artist}</Text>
                            )}

                            <Text className="text-xs text-muted-foreground">{preset.description}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}