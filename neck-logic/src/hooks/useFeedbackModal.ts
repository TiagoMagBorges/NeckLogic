import { useState } from 'react';

type ModalType = 'error' | 'success';

export function useFeedbackModal() {
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'error' as ModalType,
    onConfirm: () => setModalConfig(prev => ({ ...prev, visible: false }))
  });

  const showModal = (title: string, message: string, type: ModalType, onConfirmAction?: () => void) => {
    setModalConfig({
      visible: true,
      title,
      message,
      type,
      onConfirm: () => {
        setModalConfig(prev => ({ ...prev, visible: false }));
        if (onConfirmAction) onConfirmAction();
      }
    });
  };

  return { modalConfig, showModal };
}