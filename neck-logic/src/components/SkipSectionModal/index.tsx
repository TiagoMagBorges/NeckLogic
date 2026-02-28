import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { FastForward } from 'lucide-react-native';
import { styles } from './styles';

interface SkipSectionModalProps {
    visible: boolean;
    sectionTitle?: string;
    isSkipping: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function SkipSectionModal({visible, sectionTitle, isSkipping, onClose, onConfirm}: SkipSectionModalProps) {
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

                    <Text className={styles.modalTitle}>Pular Seção?</Text>
                    <Text className={styles.modalText}>
                        Tem certeza que deseja marcar todo o conteúdo de "{sectionTitle}" como concluído? Você fará um teste rápido para provar seus conhecimentos.
                    </Text>

                    <View className={styles.modalButtons}>
                        <TouchableOpacity
                            className={styles.modalCancelButton}
                            onPress={onClose}
                            disabled={isSkipping}
                        >
                            <Text className={styles.modalCancelText}>Cancelar</Text>
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
                                    <Text className={styles.modalConfirmText}>Fazer Teste</Text>
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