import "./global.css";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
    return (
        <View style={styles.container}>
            <Text>NeckLogic: Setup Concluído!</Text>
            <Text>Sprint 1 pronta para começar.</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});