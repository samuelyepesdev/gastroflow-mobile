import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

// Definición de la interfaz del Usuario autenticado
export interface User {
  id: number;
  nombre: string;
  username: string;
  email: string;
  rol: string;
  tenant_id: number | null;
  activo: boolean;
}

// Interfaz que describe el estado y métodos expuestos por el Contexto de Autenticación
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider: Componente proveedor que envuelve la aplicación móvil
 * para proveer acceso global al estado de autenticación y sesión.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Efecto que restaura automáticamente la sesión al arrancar la app
  useEffect(() => {
    const loadStoredSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('auth_token');
        if (storedToken) {
          setToken(storedToken);
          
          // Consultar los datos actualizados del usuario para verificar validez del token
          const response = await api.get('/auth/me');
          if (response.data && response.data.user) {
            setUser(response.data.user);
          } else {
            // Token inválido o corrupto, limpiar sesión local
            await clearSession();
          }
        }
      } catch (error) {
        console.error('Error al restaurar sesión persistente móvil:', error);
        await clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredSession();
  }, []);

  // Método interno auxiliar para limpiar los estados
  const clearSession = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
    } catch (e) {
      console.error('Error al borrar token:', e);
    }
    setToken(null);
    setUser(null);
  };

  /**
   * login: Realiza la petición POST de inicio de sesión al backend de GastroFlow
   * y guarda el token JWT retornado de manera persistente y encriptada en el dispositivo.
   */
  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { success, token: returnedToken, user: returnedUser, error } = response.data;

      if (success && returnedToken) {
        // Almacenamiento seguro encriptado a nivel nativo
        await SecureStore.setItemAsync('auth_token', returnedToken);
        setToken(returnedToken);
        setUser(returnedUser);
        return { success: true };
      } else {
        return { success: false, message: error || 'Credenciales incorrectas.' };
      }
    } catch (error: any) {
      console.error('Error en proceso de login móvil:', error);
      const msg = error.response?.data?.error || 'No se pudo conectar con el servidor. Verifica tu conexión de red.';
      return { success: false, message: msg };
    }
  };

  /**
   * logout: Cierra la sesión activa notificando opcionalmente al backend y
   * purgando toda la información del dispositivo de forma segura.
   */
  const logout = async () => {
    try {
      // Informar al backend del cierre de sesión para purgar cookies si aplica
      await api.post('/auth/logout').catch(() => {});
    } catch (e) {
      // Ignorar fallas de red durante el cierre de sesión
    } finally {
      await clearSession();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook useAuth: Facilita el acceso rápido al contexto de autenticación
 * en cualquier pantalla o componente de la aplicación móvil.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe utilizarse dentro del alcance de un AuthProvider');
  }
  return context;
};
