import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react-native';

export function LanguageDropdown() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const currentLang = i18n.language;

    const toggleLanguage = (lang: string) => {
        if (currentLang !== lang) {
            i18n.changeLanguage(lang);
        }
        setIsOpen(false);
    };

    return (
        <View className="absolute top-6 right-6 z-50">
            <TouchableOpacity
                onPress={() => setIsOpen(true)}
                activeOpacity={0.8}
                className="flex-row items-center bg-card border border-border/10 rounded-full px-3 py-2 shadow-sm"
            >
                <Globe size={16} color="#A1A1AA" />
                <Text className="text-foreground font-bold text-xs mx-2">
                    {currentLang === 'pt-BR' ? 'PT' : 'EN'}
                </Text>
                <ChevronDown size={14} color="#A1A1AA" />
            </TouchableOpacity>

            <Modal visible={isOpen} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
                    <View className="flex-1">
                        <View className="absolute top-16 right-6 bg-card border border-border/10 rounded-xl shadow-lg w-32 overflow-hidden">
                            <TouchableOpacity
                                onPress={() => toggleLanguage('en')}
                                className={`px-4 py-3 border-b border-border/10 ${currentLang === 'en' ? 'bg-primary/10' : ''}`}
                            >
                                <Text className={`text-sm font-medium ${currentLang === 'en' ? 'text-primary' : 'text-foreground'}`}>English</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => toggleLanguage('pt-BR')}
                                className={`px-4 py-3 ${currentLang === 'pt-BR' ? 'bg-primary/10' : ''}`}
                            >
                                <Text className={`text-sm font-medium ${currentLang === 'pt-BR' ? 'text-primary' : 'text-foreground'}`}>Português</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}