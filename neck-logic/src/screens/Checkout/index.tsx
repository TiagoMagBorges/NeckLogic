import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { api } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { CheckoutResponseDTO, PurchaseResponseDTO } from '../../types/Payment';
import { RootStackParamList } from '../../navigation/Routes';
import { styles } from './styles';

/** Simulates the wait for an external payment provider's response. */
const MOCK_PROCESSING_DELAY_MS = 1400;

type CheckoutRouteProp = RouteProp<RootStackParamList, 'Checkout'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;

type Status = 'loading' | 'ready' | 'processing' | 'error';

export default function CheckoutScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CheckoutRouteProp>();
  const { t, i18n } = useTranslation();

  const { trackId, trackTitle, priceCents } = route.params;

  const [status, setStatus] = useState<Status>('loading');
  const [session, setSession] = useState<CheckoutResponseDTO | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startCheckout = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);
    try {
      const response = await api.post<CheckoutResponseDTO>(`/tracks/${trackId}/checkout`);
      setSession(response.data);
      setStatus('ready');
    } catch (error) {
      setErrorMessage(t('tracks.checkout.errorInit'));
      setStatus('error');
    }
  }, [trackId, t]);

  useEffect(() => {
    startCheckout();
  }, [startCheckout]);

  async function resolvePayment(outcome: 'PAID' | 'FAILED') {
    if (!session) return;

    setStatus('processing');
    await new Promise((resolve) => setTimeout(resolve, MOCK_PROCESSING_DELAY_MS));

    try {
      const response = await api.post<PurchaseResponseDTO>(`/payments/${session.sessionId}/confirm`, { outcome });

      if (response.data.status === 'PAID') {
        navigation.navigate('MainTabs', {
          screen: 'LogicPath',
          params: { trackId, trackTitle },
        });
        return;
      }

      setErrorMessage(t('tracks.checkout.errorDeclined'));
      setStatus('error');
    } catch (error) {
      setErrorMessage(t('tracks.checkout.errorConfirm'));
      setStatus('error');
    }
  }

  const displayAmount = session?.amountCents ?? priceCents;
  const isBusy = status === 'loading' || status === 'processing';

  return (
    <SafeAreaView className={styles.safeArea}>
      <View className={styles.centerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className={styles.backButton}
          disabled={status === 'processing'}
          style={{ position: 'absolute', top: 16, left: 24 }}
        >
          <ArrowLeft size={18} color="#A1A1AA" />
          <Text className={styles.backText}>{t('tracks.back')}</Text>
        </TouchableOpacity>

        <View className={styles.card}>
          <Text className={styles.trackTitle}>{trackTitle}</Text>
          <Text className={styles.simulationTag}>{t('tracks.checkout.simulationTag')}</Text>

          <Text className={styles.priceLabel}>{t('tracks.checkout.priceLabel')}</Text>
          <Text className={styles.priceValue}>{formatPrice(displayAmount, i18n.language)}</Text>

          {status === 'error' ? (
            <>
              <Text className={styles.errorText}>{errorMessage}</Text>
              <TouchableOpacity
                onPress={startCheckout}
                className={`${styles.buttonBase} ${styles.retryButton}`}
              >
                <Text className={styles.retryButtonText}>{t('tracks.checkout.retry')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => resolvePayment('PAID')}
                disabled={isBusy}
                className={`${styles.buttonBase} ${styles.payButton} ${isBusy ? 'opacity-60' : 'opacity-100'}`}
              >
                {isBusy ? (
                  <ActivityIndicator color="#121212" />
                ) : (
                  <Text className={styles.payButtonText}>{t('tracks.checkout.pay')}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => resolvePayment('FAILED')}
                disabled={isBusy}
                className={`${styles.buttonBase} ${styles.failButton} ${isBusy ? 'opacity-60' : 'opacity-100'}`}
              >
                <Text className={styles.failButtonText}>{t('tracks.checkout.simulateFailure')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}