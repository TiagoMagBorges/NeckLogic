import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react-native';

interface FeedbackModalProps {
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export function FeedbackModal({
                                  visible,
                                  title,
                                  message,
                                  type,
                                  confirmText = 'OK',
                                  cancelText,
                                  onConfirm,
                                  onCancel
                              }: FeedbackModalProps) {
    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={32} color="#10B981" />;
            case 'warning': return <AlertTriangle size={32} color="#EF4444" />;
            case 'error': return <XCircle size={32} color="#EF4444" />;
        }
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/80 px-6">
                <View className="w-full bg-card border border-border/10 rounded-2xl p-6 items-center">
                    <View className="mb-4">
                        {getIcon()}
                    </View>

                    <Text className="text-xl font-bold text-foreground text-center mb-2">
                        {title}
                    </Text>

                    <Text className="text-sm text-muted-foreground text-center mb-6">
                        {message}
                    </Text>

                    <View className="flex-row w-full justify-between">
                        {cancelText && (
                            <TouchableOpacity
                                onPress={onCancel}
                                activeOpacity={0.8}
                                className="flex-1 bg-secondary rounded-xl py-3 items-center mr-3"
                            >
                                <Text className="text-foreground font-semibold">{cancelText}</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={onConfirm}
                            activeOpacity={0.8}
                            className={`flex-1 rounded-xl py-3 items-center ${type === 'warning' ? 'bg-destructive' : 'bg-primary'}`}
                        >
                            <Text className={`font-bold ${type === 'warning' ? 'text-white' : 'text-[#121212]'}`}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}