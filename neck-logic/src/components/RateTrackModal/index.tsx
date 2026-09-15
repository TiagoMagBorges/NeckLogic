import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';

interface RateTrackModalProps {
  visible: boolean;
  initialStars: number | null;
  initialComment: string | null;
  isSubmitting: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (stars: number, comment: string) => void;
}

export function RateTrackModal({
                                 visible,
                                 initialStars,
                                 initialComment,
                                 isSubmitting,
                                 error,
                                 onClose,
                                 onSubmit,
                               }: RateTrackModalProps) {
  const { t } = useTranslation();
  const [stars, setStars] = useState(initialStars ?? 5);
  const [comment, setComment] = useState(initialComment ?? '');

  useEffect(() => {
    if (visible) {
      setStars(initialStars ?? 5);
      setComment(initialComment ?? '');
    }
  }, [visible, initialStars, initialComment]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => !isSubmitting && onClose()}
    >
      <View className={styles.modalOverlay}>
        <View className={styles.modalContent}>
          <View className={styles.modalIconContainer}>
            <Star size={32} color="#00D9FF" />
          </View>

          <Text className={styles.modalTitle}>{t('rating.modalTitle')}</Text>
          <Text className={styles.modalText}>{t('rating.modalHint')}</Text>

          <View className={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity key={value} onPress={() => setStars(value)} disabled={isSubmitting}>
                <Star
                  size={36}
                  color="#FBBF24"
                  fill={value <= stars ? '#FBBF24' : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            className={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder={t('rating.commentPlaceholder')}
            placeholderTextColor="#52525B"
            multiline
            textAlignVertical="top"
            editable={!isSubmitting}
          />

          {error && <Text className={styles.errorText}>{error}</Text>}

          <View className={styles.modalButtons}>
            <TouchableOpacity
              className={styles.modalCancelButton}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text className={styles.modalCancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`${styles.modalConfirmButton} ${isSubmitting ? 'opacity-70' : ''}`}
              onPress={() => onSubmit(stars, comment.trim())}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#121212" />
              ) : (
                <Text className={styles.modalConfirmText}>{t('rating.submit')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}