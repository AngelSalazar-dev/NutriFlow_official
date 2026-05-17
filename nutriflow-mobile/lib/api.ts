import axios from 'axios';
import { getToken } from './storage';

// Nota: Para desarrollo en un dispositivo físico o emulador de Android,
// usar la IP de tu computadora (por ejemplo, 'http://192.168.1.10:3000').
// 'localhost' o '127.0.0.1' solo funciona en simuladores iOS.
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000'; // Default para emulador de Android

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para inyectar automáticamente el Bearer token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
