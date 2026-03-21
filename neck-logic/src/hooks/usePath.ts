import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import i18n from '../i18n';

import { api } from '../services/api';
import { ModuleDTO } from '../types/Module';

export function usePath() {
    const [modules, setModules] = useState<ModuleDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPath = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<ModuleDTO[]>('/modules');
            setModules(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert(i18n.t('common.error'), i18n.t('hooks.pathLoadError'));
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchPath();
        }, [fetchPath])
    );

    return {
        modules,
        loading,
        refetch: fetchPath
    };
}