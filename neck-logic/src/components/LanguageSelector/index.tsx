import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

    const toggleLanguage = (lang: string) => {
        if (currentLang !== lang) {
            i18n.changeLanguage(lang);
        }
    };

    return (
        <View className="flex-row items-center justify-center bg-card border border-border/10 rounded-xl p-1 self-center">
            <TouchableOpacity
                onPress={() => toggleLanguage('en')}
                activeOpacity={0.8}
                className={`px-4 py-2 rounded-lg ${currentLang === 'en' ? 'bg-primary' : 'bg-transparent'}`}
            >
                <Text className={`font-bold text-sm ${currentLang === 'en' ? 'text-[#121212]' : 'text-muted-foreground'}`}>
                    EN
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => toggleLanguage('pt-BR')}
                activeOpacity={0.8}
                className={`px-4 py-2 rounded-lg ${currentLang === 'pt-BR' ? 'bg-primary' : 'bg-transparent'}`}
            >
                <Text className={`font-bold text-sm ${currentLang === 'pt-BR' ? 'text-[#121212]' : 'text-muted-foreground'}`}>
                    PT-BR
                </Text>
            </TouchableOpacity>
        </View>
    );
}