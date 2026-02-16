import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
    const { signOut, user } = useAuth();

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="text-2xl font-bold mb-4">Bem-vindo, Músico!</Text>
            <Button title="Sair do App" onPress={signOut} color="red" />
        </View>
    );
}