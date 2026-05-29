import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { styles } from '../styles/home.styles';
import { useRouter } from 'expo-router';

// Interfaz para definir el modelo de la Mesa
interface Mesa {
  id: number;
  numero: string | number;
  descripcion?: string;
  estado: 'libre' | 'ocupada' | 'reservada' | string;
  tipo?: 'fisica' | 'virtual' | string;
  pedido_activo_id?: number | null;
}

/**
 * Pantalla Principal: Listado de Mesas de GastroFlow.
 * RÉPLICA EXACTA DEL DISEÑO WEB:
 * - División de "Pedidos WhatsApp / Domicilios" y "Atención en Salón".
 * - Tarjetas 3D Cenitales estilo Restobar para las mesas físicas (sillas + brillo de cristal).
 * - Notificación fluida en tiempo real y pull-to-refresh.
 */
export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Función para obtener las mesas desde el endpoint JSON '/api/mesas/listar'
  const fetchMesas = async () => {
    try {
      setError('');
      const response = await api.get('/api/mesas/listar');
      
      const data = response.data.mesas || response.data || [];
      if (Array.isArray(data)) {
        setMesas(data);
      } else {
        setMesas([]);
      }
    } catch (err: any) {
      console.error('Error al obtener mesas:', err);
      setError('No se pudieron cargar las mesas. Arrastra para reintentar.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMesas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMesas();
  };

  // Liberar mesa física directamente desde la home (PUT /api/mesas/:id/liberar)
  const handleLiberarMesa = async (mesaId: number, mesaNumero: string | number) => {
    Alert.alert(
      '¿Liberar Mesa?',
      `Esta acción liberará la Mesa ${mesaNumero} únicamente si no tiene productos activos sin pagar.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, liberar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await api.put(`/api/mesas/${mesaId}/liberar`);
              Alert.alert('Éxito', `La mesa ${mesaNumero} ha sido liberada.`);
              fetchMesas();
            } catch (err: any) {
              console.error('Error al liberar:', err);
              Alert.alert('Error', err.response?.data?.error || 'No se pudo liberar.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Renderizar las mesas virtuales (WhatsApp / Domicilios)
  const renderMesaVirtual = (item: Mesa) => {
    const isOccupied = item.estado?.toLowerCase() === 'ocupada';
    const isReserved = item.estado?.toLowerCase() === 'reservada';
    
    let statusBg = styles.pillLibre;
    let statusColorText = '#166534';
    let statusText = 'LIBRE';
    
    if (isOccupied) {
      statusBg = styles.pillOcupada;
      statusColorText = '#C62828';
      statusText = 'OCUPADA';
    } else if (isReserved) {
      statusBg = styles.pillReservada;
      statusColorText = '#D97706';
      statusText = 'RESERVADA';
    }

    return (
      <View key={item.id} style={styles.mesaVirtualCard}>
        {/* Cabecera Tarjeta Virtual */}
        <View style={styles.virtualHeader}>
          <View style={styles.virtualTitleContainer}>
            <Text style={{ fontSize: 16 }}>🟢</Text>
            <Text style={styles.virtualTitle}>Mesa {item.numero}</Text>
          </View>
          <View style={[styles.statusPill, statusBg]}>
            <Text style={[styles.statusPillText, { color: statusColorText }]}>{statusText}</Text>
          </View>
        </View>

        {/* Descripción WhatsApp */}
        <View style={styles.virtualDesc}>
          <Text style={styles.virtualDescText} numberOfLines={1}>
            👤 {item.descripcion || 'Pedido WhatsApp'}
          </Text>
        </View>

        {/* Botonera de Acción */}
        <View>
          <TouchableOpacity
            style={[styles.btnCta, isOccupied || isReserved ? styles.btnCtaWarning : styles.btnCtaSuccess]}
            activeOpacity={0.8}
            onPress={() => router.push(`/mesa/${item.id}?numero=${item.numero}&estado=${item.estado}`)}
          >
            <Text style={styles.btnCtaText}>
              {isOccupied || isReserved ? '📝 Gestionar pedido' : '➕ Abrir pedido'}
            </Text>
          </TouchableOpacity>

          <View style={styles.btnSecContainer}>
            <TouchableOpacity
              style={styles.btnSec}
              onPress={() => router.push(`/mesa/${item.id}?numero=${item.numero}&estado=${item.estado}`)}
            >
              <Text style={styles.btnSecText}>👁️ Ver</Text>
            </TouchableOpacity>
            {!isOccupied && !isReserved ? null : (
              <TouchableOpacity
                style={styles.btnSec}
                onPress={() => handleLiberarMesa(item.id, item.numero)}
              >
                <Text style={[styles.btnSecText, { color: '#FF8A80' }]}>🔓 Liberar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Renderizar las mesas físicas reales (Estilo Restobar con vista cenital 3D)
  const renderMesaFisica = (item: Mesa) => {
    const isOccupied = item.estado?.toLowerCase() === 'ocupada';
    const isReserved = item.estado?.toLowerCase() === 'reservada';
    const isLibre = !isOccupied && !isReserved;

    // Estilos de sillas
    const sillasStyle = [
      styles.sillaRealItem,
      isLibre && styles.sillaLibre,
      isOccupied && styles.sillaOcupada,
      isReserved && styles.sillaReservada,
    ];

    return (
      <View key={item.id} style={styles.mesaRealCard}>
        {/* Representación Cenital Gráfica de la Mesa */}
        <View style={styles.mesaRealLayoutWrapper}>
          {/* Sillas alrededor de la mesa */}
          <View style={[sillasStyle, styles.sillaTop]} />
          <View style={[sillasStyle, styles.sillaBottom]} />
          <View style={[sillasStyle, styles.sillaLeft]} />
          <View style={[sillasStyle, styles.sillaRight]} />

          {/* Cuerpo Redondo de la Mesa con Relieve */}
          <View style={[
            styles.mesaRealObjetoCuerpo,
            isLibre && styles.mesaCuerpoLibre,
            isOccupied && styles.mesaCuerpoOcupada,
            isReserved && styles.mesaCuerpoReservada
          ]}>
            {/* Cristal laca superior */}
            <View style={styles.mesaRealObjetoBrillo} />
            <Text style={styles.mesaRealObjetoNum}>Mesa {item.numero}</Text>
            
            {isOccupied ? (
              <Text style={[styles.mesaRealObjetoBadge, styles.badgeOcupada]}>🍳 ACTIVA</Text>
            ) : isReserved ? (
              <Text style={[styles.mesaRealObjetoBadge, styles.badgeReservada]}>RES</Text>
            ) : (
              <Text style={[styles.mesaRealObjetoBadge, styles.badgeLibre]}>Libre</Text>
            )}
          </View>
        </View>

        {/* Botonera de Acción */}
        <View style={{ width: '100%' }}>
          <TouchableOpacity
            style={[styles.btnCta, isOccupied || isReserved ? styles.btnCtaWarning : styles.btnCtaSuccess]}
            activeOpacity={0.8}
            onPress={() => router.push(`/mesa/${item.id}?numero=${item.numero}&estado=${item.estado}`)}
          >
            <Text style={styles.btnCtaText}>
              {isOccupied || isReserved ? '📝 Gestionar mesa' : '➕ Abrir comanda'}
            </Text>
          </TouchableOpacity>

          <View style={styles.btnSecContainer}>
            <TouchableOpacity
              style={styles.btnSec}
              onPress={() => router.push(`/mesa/${item.id}?numero=${item.numero}&estado=${item.estado}`)}
            >
              <Text style={styles.btnSecText}>👁️ Ver</Text>
            </TouchableOpacity>
            {isLibre ? null : (
              <TouchableOpacity
                style={styles.btnSec}
                onPress={() => handleLiberarMesa(item.id, item.numero)}
              >
                <Text style={[styles.btnSecText, { color: '#FF8A80' }]}>🔓 Liberar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Dividir las mesas en virtuales y físicas
  const mesasVirtuales = mesas.filter((m) => m.tipo?.toLowerCase() === 'virtual');
  const mesasFisicas = mesas.filter((m) => m.tipo?.toLowerCase() !== 'virtual');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />
      
      {/* Encabezado: Perfil del usuario y logout */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hola, {user?.nombre || 'Mesero'}</Text>
          <Text style={styles.roleText}>{String(user?.rol || 'Mesero').toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido Principal con scroll de refresco */}
      <View style={styles.content}>
        {loading && mesas.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Sincronizando salón...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchMesas}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.contentScroll}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
            }
          >
            {/* SECCIÓN 1: Pedidos WhatsApp / Domicilios (Mesas Virtuales) */}
            {mesasVirtuales.length > 0 && (
              <View style={{ marginBottom: 25 }}>
                <View style={styles.sectionHeaderContainer}>
                  <Text style={{ fontSize: 18 }}>📱</Text>
                  <Text style={styles.sectionTitle}>Pedidos WhatsApp / Domicilios</Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {mesasVirtuales.map(renderMesaVirtual)}
                </View>
              </View>
            )}

            {/* SECCIÓN 2: Atención en Salón (Mesas Físicas Cenitales) */}
            <View style={{ marginBottom: 40 }}>
              <View style={styles.sectionHeaderContainer}>
                <Text style={{ fontSize: 18 }}>🪑</Text>
                <Text style={styles.sectionTitle}>Atención en Salón</Text>
              </View>
              {mesasFisicas.length === 0 ? (
                <Text style={styles.emptyText}>No hay mesas físicas en el salón.</Text>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {mesasFisicas.map(renderMesaFisica)}
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
