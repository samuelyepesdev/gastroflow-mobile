import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/login.styles'; // Importación de estilos externos

/**
 * Pantalla de inicio de sesión (Login) nativa y de alta calidad estética.
 * Aplica el principio SRP separando la hoja de estilos a un archivo externo.
 */
export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Por favor, ingresa tu usuario y contraseña.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const result = await login(username.trim(), password);
      if (!result.success) {
        setErrorMessage(result.message || 'Error al iniciar sesión.');
      }
    } catch (error) {
      setErrorMessage('Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            {/* Sección superior: Logo y branding */}
            <View style={styles.logoContainer}>
              <View style={styles.brandIconCircle}>
                <Text style={styles.brandIconText}>GF</Text>
              </View>
              <Text style={styles.brandName}>GastroFlow</Text>
              <Text style={styles.brandTagline}>Sistema de Facturación Móvil</Text>
            </View>

            {/* Sección intermedia: Formulario de inicio de sesión */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Iniciar Sesión</Text>
              <Text style={styles.formSubtitle}>Ingresa tus credenciales de mesero, cocinero o caja</Text>

              {errorMessage ? (
                <View style={styles.errorAlert}>
                  <Text style={styles.errorAlertText}>{errorMessage}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Usuario</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. mesero1"
                  placeholderTextColor="#666"
                  value={username}
                  onChangeText={(val) => {
                    setUsername(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#666"
                  secureTextEntry
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.loginButtonText}>Ingresar al Sistema</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Sección inferior: Footer */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                GastroFlow Multi-tenant © 2026. Todos los derechos reservados.
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
