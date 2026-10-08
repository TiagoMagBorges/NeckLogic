import axios from 'axios';
import i18n from '../i18n';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
});

let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.language;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthenticatedRequest = Boolean(error.config?.headers?.Authorization);
    const status = error.response?.status;
    if ((status === 401 || status === 403) && isAuthenticatedRequest) {
      onSessionExpired?.();
    }
    return Promise.reject(error);
  }
);