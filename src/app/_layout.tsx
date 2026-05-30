import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

/**
 * GastroFlow Mobile - Layout de Navegación Principal
 * Configura un Stack nativo simplificado de pantalla completa para el WebView.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
