import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LogicPathScreen from '../screens/LogicPath';
import LabScreen from '../screens/Lab';
import ProfileScreen from '../screens/Profile';
import { BottomNavigation } from '../components/BottomNavigation';

export type MainTabParamList = {
    LogicPath: undefined;
    Lab: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
    return (
        <Tab.Navigator
            tabBar={(props) => <BottomNavigation {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="LogicPath" component={LogicPathScreen} />
            <Tab.Screen name="Lab" component={LabScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}