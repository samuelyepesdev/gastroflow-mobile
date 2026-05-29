import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { ENV } from '../config/env';

/**
 * Pantalla de Perfil / Configuración del Mesero.
 * Muestra información del usuario autenticado, detalles de red del backend (Laragon vs Railway)
 * y una opción destacada para cerrar sesión de manera segura.
 */
export default function ExploreScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.card}>
        {/* Avatar basado en inicial del nombre */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.nombre || 'Usuario'}</Text>
        <Text style={styles.userRole}>{String(user?.rol || 'Rol').toUpperCase()}</Text>

        {/* Tabla de información del perfil */}
        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre de usuario</Text>
            <Text style={styles.infoValue}>{user?.username || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Correo electrónico</Text>
            <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Restaurante (Tenant)</Text>
            <Text style={styles.infoValue}>{user?.tenant_id ? `ID #${user.tenant_id}` : 'Superadmin'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado Cuenta</Text>
            <Text style={[styles.infoValue, { color: user?.activo ? '#2E7D32' : '#C62828' }]}>
              {user?.activo ? 'Activa' : 'Inactiva'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Servidor Conectado</Text>
            <Text style={styles.infoValue} numberOfLines={1}>{ENV.API_URL}</Text>
          </View>
        </View>

        {/* Botón de Cierre de Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  userName: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userRole: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    letterSpacing: 1,
    marginBottom: 24,
  },
  infoTable: {
    width: '100%',
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '60%',
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
