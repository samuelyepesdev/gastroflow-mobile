import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  Platform,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { ENV } from '../config/env';

/**
 * GastroFlow Mobile - Contenedor WebView Principal
 * 
 * Carga directamente la interfaz web de GastroFlow con máxima fidelidad visual y de rendimiento.
 * Soporta retroceso nativo con el botón físico en Android y áreas seguras de hardware.
 */
export default function GastroFlowWebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);

  // Controlar el botón físico de retroceso en Android
  useEffect(() => {
    const onBackPress = () => {
      if (webViewRef.current && canGoBack) {
        webViewRef.current.goBack();
        return true; // Bloquea la salida de la aplicación
      }
      return false; // Permite la acción de retroceso por defecto (salir)
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      subscription.remove();
    };
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: ENV.API_URL }}
          style={styles.webview}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          // Permite reproducir videos y media inline
          allowsInlineMediaPlayback={true}
        />

        {/* Pantalla de carga / Transición premium de GastroFlow */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Conectando a GastroFlow...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
