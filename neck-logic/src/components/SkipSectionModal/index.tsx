import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { FastForward } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';

interface SkipSectionModalProps {
    visible: boolean;
    sectionTitle?: string;
    isSkipping: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function SkipSectionModal({visible, sectionTitle, isSkipping, onClose, onConfirm}: SkipSectionModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={() => !isSkipping && onClose()}
        >
            <View className={styles.modalOverlay}>
                <View className={styles.modalContent}>
                    <View className={styles.modalIconContainer}>
                        <FastForward size={32} color="#00D9FF" />
                    </View>

                    <Text className={styles.modalTitle}>{t('modals.skipTitle')}</Text>
                    <Text className={styles.modalText}>
                        {t('modals.skipDesc', { section: sectionTitle })}
                    </Text>

                    <View className={styles.modalButtons}>
                        <TouchableOpacity
                            className={styles.modalCancelButton}
                            onPress={onClose}
                            disabled={isSkipping}
                        >
                            <Text className={styles.modalCancelText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`${styles.modalConfirmButton} ${isSkipping ? 'opacity-70' : ''}`}
                            onPress={onConfirm}
                            disabled={isSkipping}
                        >
                            {isSkipping ? (
                                <ActivityIndicator color="#121212" />
                            ) : (
                                <>
                                    <Text className={styles.modalConfirmText}>{t('modals.takeTest')}</Text>
                                    <FastForward size={16} color="#121212" style={{ marginLeft: 8 }} />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}