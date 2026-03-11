import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Route, Beaker, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

export function BottomNavigation({ state, navigation }: BottomTabBarProps) {
    const getIcon = (routeName: string, isFocused: boolean) => {
        const color = isFocused ? '#00D9FF' : '#A1A1AA';
        const strokeWidth = isFocused ? 2.5 : 2;

        switch (routeName) {
            case 'LogicPath':
                return <Route size={24} color={color} strokeWidth={strokeWidth} />;
            case 'Lab':
                return <Beaker size={24} color={color} strokeWidth={strokeWidth} />;
            case 'Profile':
                return <User size={24} color={color} strokeWidth={strokeWidth} />;
            default:
                return <Route size={24} color={color} strokeWidth={strokeWidth} />;
        }
    };

    const getLabel = (routeName: string) => {
        switch (routeName) {
            case 'LogicPath': return 'Path';
            case 'Lab': return 'Lab';
            case 'Profile': return 'Profile';
            default: return '';
        }
    };

    return (
        <BlurView
            intensity={80}
            tint="dark"
            className="absolute bottom-0 left-0 right-0 border-t border-border/10 flex-row justify-around items-center h-20 px-6"
        >
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        activeOpacity={0.8}
                        className="flex-1 items-center justify-center gap-1"
                    >
                        {getIcon(route.name, isFocused)}
                        <Text className={`text-xs font-medium ${isFocused ? 'text-primary' : 'text-muted-foreground'}`}>
                            {getLabel(route.name)}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </BlurView>
    );
}