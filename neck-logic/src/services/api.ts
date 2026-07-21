import axios from 'axios';
import i18n from '../i18n';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.language;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);