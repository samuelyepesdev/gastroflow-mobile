import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { styles } from '../styles/home.styles'; // Importación de estilos externos

// Interfaz para definir el modelo de la Mesa
interface Mesa {
  id: number;
  numero: string | number;
  capacidad: number;
  estado: 'libre' | 'ocupada' | 'reservada' | string;
  pedido_activo_id?: number | null;
}

/**
 * Pantalla Principal: Listado de Mesas de GastroFlow.
 * Aplica el principio SRP separando la hoja de estilos a un archivo externo.
 */
export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Función para obtener las mesas desde el endpoint seguro del backend
  const fetchMesas = async () => {
    try {
      setError('');
      const response = await api.get('/api/mesas');
      
      // Manejar la estructura de respuesta (sea el array directo o envoltura { mesas })
      const data = response.data.mesas || response.data || [];
      setMesas(data);
    } catch (err: any) {
      console.error('Error al obtener mesas:', err);
      setError('No se pudieron cargar las mesas del restaurante. Arrastra para reintentar.');
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

  // Renderizado individual de cada tarjeta de Mesa
  const renderMesaItem = ({ item }: { item: Mesa }) => {
    const isOccupied = item.estado?.toLowerCase() === 'ocupada';
    const isReserved = item.estado?.toLowerCase() === 'reservada';
    
    let statusColor = '#2E7D32'; // Verde para libre
    let statusText = 'Libre';
    
    if (isOccupied) {
      statusColor = '#C62828'; // Rojo para ocupada
      statusText = 'Ocupada';
    } else if (isReserved) {
      statusColor = '#EF6C00'; // Naranja para reservada
      statusText = 'Reservada';
    }

    return (
      <TouchableOpacity 
        style={[styles.mesaCard, { borderColor: statusColor + '44' }]}
        activeOpacity={0.7}
      >
        {/* Indicador superior de estado */}
        <View style={[styles.mesaStatusIndicator, { backgroundColor: statusColor }]} />
        <View style={styles.mesaCardBody}>
          <Text style={styles.mesaNumber}>Mesa {item.numero}</Text>
          <Text style={styles.mesaCapacity}>Capacidad: {item.capacidad} personas</Text>
          <View style={styles.statusBadgeContainer}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
              <Text style={[styles.statusBadgeText, { color: statusColor }]}>{statusText}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Encabezado: Perfil del usuario y botón de salida */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hola, {user?.nombre || 'Mesero'}</Text>
          <Text style={styles.roleText}>{String(user?.rol || 'Mesero').toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido Principal: Rejilla de Mesas */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Salón Principal</Text>
        <Text style={styles.sectionSubtitle}>Selecciona una mesa para tomar comandas o ver estado</Text>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#FF6F00" />
            <Text style={styles.loadingText}>Cargando mesas...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchMesas}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : mesas.length === 0 ? (
          <FlatList
            data={[]}
            renderItem={null}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6F00" />
            }
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No hay mesas configuradas en este restaurante.</Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={mesas}
            renderItem={renderMesaItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6F00" />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
