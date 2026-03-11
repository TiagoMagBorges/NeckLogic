import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LabScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background justify-center items-center">
            <Text className="text-xl font-bold text-foreground">Lab</Text>
            <Text className="text-muted-foreground mt-2">Em breve</Text>
        </SafeAreaView>
    );
}