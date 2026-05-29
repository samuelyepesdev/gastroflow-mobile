import { Tabs } from 'expo-router';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import LoginScreen from './login';

/**
 * TabLayoutNav: Controla el flujo de acceso de seguridad móvil.
 * Si está cargando datos de sesión, muestra un spinner de carga.
 * Si no está autenticado, renderiza exclusivamente la pantalla de login nativa.
 * Si está autenticado, despliega la interfaz operativa con pestañas estables de expo-router SDK 52.
 */
function TabLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F0F' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#161616',
        },
        headerTintColor: '#FFF',
        tabBarStyle: {
          backgroundColor: '#161616',
          borderTopColor: '#222',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Salón Mesas',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          headerShown: true,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <AuthProvider>
      <TabLayoutNav />
    </AuthProvider>
  );
}
