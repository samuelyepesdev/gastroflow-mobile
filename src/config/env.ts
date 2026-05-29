/**
 * GastroFlow Mobile - Configuración Dinámica de Entorno
 * 
 * Lee automáticamente las variables de entorno cargadas por Expo desde el archivo `.env`.
 * Las variables seguras expuestas en la app móvil deben iniciar con el prefijo 'EXPO_PUBLIC_'.
 */

export const ENV = {
  // URL base para las peticiones a la API del servidor de GastroFlow (Railway o Laragon LAN)
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
};
