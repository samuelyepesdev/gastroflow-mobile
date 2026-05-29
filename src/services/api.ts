import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENV } from '../config/env';

// Crear una instancia de Axios configurada con la URL base del Backend GastroFlow
const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Interceptor de Peticiones:
 * Recupera el token de seguridad del almacenamiento seguro nativo (SecureStore)
 * e inyecta la cabecera 'Authorization: Bearer <TOKEN>' de forma automática.
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al inyectar JWT desde el almacenamiento seguro:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Respuestas:
 * Si el servidor responde con 401 (No autorizado o Sesión Expirada),
 * limpia automáticamente el token inválido del almacenamiento.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Sesión móvil expirada o inválida (401). Limpiando token...');
      try {
        await SecureStore.deleteItemAsync('auth_token');
      } catch (e) {
        console.error('Error al eliminar token expirado:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
