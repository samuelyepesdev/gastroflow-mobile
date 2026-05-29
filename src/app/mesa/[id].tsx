import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../services/api';
import { styles } from '../../styles/mesa.styles';

// Definición de interfaces
interface Pedido {
  id: number;
  numero: number;
  mesa_id: number;
  cliente_id: number | null;
  estado: string;
  total: number;
  notas: string | null;
  propina?: number;
}

interface PedidoItem {
  id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  estado: 'pendiente' | 'enviado' | 'preparando' | 'listo' | 'servido' | 'cancelado' | string;
  nota?: string | null;
}

/**
 * Pantalla dinámica del detalle de Mesa.
 * Muestra el ciclo operativo de la mesa en tiempo real.
 * Si está libre, permite abrirla. Si está ocupada, carga y lista la comanda de cocina.
 */
export default function MesaDetalleScreen() {
  const { id, numero, estado } = useLocalSearchParams();
  const router = useRouter();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [items, setItems] = useState<PedidoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mesaEstado, setMesaEstado] = useState<string>(String(estado || 'libre'));

  // Carga/Apertura transaccional de la mesa al montar la pantalla
  const inicializarMesa = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Llamar a /api/mesas/abrir. Devuelve el pedido activo o crea uno si está libre
      const response = await api.post('/api/mesas/abrir', { mesa_id: Number(id) });
      const pedidoActivo = response.data.pedido;
      
      if (pedidoActivo && pedidoActivo.id) {
        setPedido(pedidoActivo);
        // 2. Cargar los productos e ítems de este pedido
        await cargarDetallePedido(pedidoActivo.id);
      } else {
        throw new Error('No se pudo inicializar el pedido de la mesa.');
      }
    } catch (err: any) {
      console.error('Error al inicializar mesa:', err);
      setError(err.response?.data?.error || 'Error al comunicar con el servidor.');
      setLoading(false);
    }
  };

  // Consulta detallada de productos y estados en cocina
  const cargarDetallePedido = async (pedidoId: number) => {
    try {
      const response = await api.get(`/api/mesas/pedidos/${pedidoId}`);
      
      const { pedido: pedidoData, items: itemsData } = response.data;
      setPedido(pedidoData);
      setItems(itemsData || []);
      
      // Si la comanda tiene ítems, la mesa está ocupada
      if (itemsData && itemsData.length > 0) {
        setMesaEstado('ocupada');
      } else {
        setMesaEstado('libre');
      }
    } catch (err) {
      console.error('Error al cargar comanda:', err);
      setError('Error al obtener la comanda de la mesa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    inicializarMesa();
  }, [id]);

  // Liberar mesa física (PUT /api/mesas/:id/liberar)
  const handleLiberarMesa = async () => {
    if (!pedido) return;

    Alert.alert(
      '¿Liberar Mesa?',
      'Esta acción liberará la mesa únicamente si no hay productos activos o pendientes de pago.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, liberar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await api.put(`/api/mesas/${id}/liberar`);
              if (response.status === 200 || response.status === 204 || response.data) {
                Alert.alert('Éxito', 'La mesa ha sido liberada correctamente.');
                router.replace('/');
              }
            } catch (err: any) {
              console.error('Error al liberar mesa:', err);
              Alert.alert('Error', err.response?.data?.error || 'No se pudo liberar la mesa.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Renderiza el badge del estado de preparación de cada platillo
  const renderItemStatusPill = (estadoItem: string) => {
    const key = estadoItem.toLowerCase();
    let bg = 'rgba(71, 85, 105, 0.15)'; // Gris / Pendiente
    let text = '#94a3b8';
    
    if (key === 'preparando') {
      bg = 'rgba(217, 119, 6, 0.15)'; // Naranja
      text = '#fbbf24';
    } else if (key === 'listo') {
      bg = 'rgba(99, 102, 241, 0.15)'; // Púrpura/Índigo
      text = '#a5b4fc';
    } else if (key === 'servido') {
      bg = 'rgba(22, 163, 74, 0.15)'; // Verde
      text = '#4ade80';
    } else if (key === 'cancelado') {
      bg = 'rgba(220, 38, 38, 0.15)'; // Rojo
      text = '#fca5a5';
    }

    return (
      <View style={[styles.statusPill, { backgroundColor: bg }]}>
        <Text style={[styles.statusPillText, { color: text }]}>{estadoItem}</Text>
      </View>
    );
  };

  // Definición de colores de cabecera según estado de mesa
  const isOccupied = mesaEstado.toLowerCase() === 'ocupada';
  const isReserved = mesaEstado.toLowerCase() === 'reservada';
  const headerStatusColor = isOccupied ? '#b91c1c' : (isReserved ? '#d97706' : '#16a34a');
  const headerStatusText = isOccupied ? 'Ocupada' : (isReserved ? 'Reservada' : 'Libre');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />
      
      {/* Cabecera */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
            <Text style={styles.backButtonText}>← Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.mesaTitle}>Mesa {numero}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: headerStatusColor + '22' }]}>
          <Text style={[styles.statusBadgeText, { color: headerStatusColor }]}>{headerStatusText}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Conectando con el salón...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={inicializarMesa}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.contentScroll} contentContainerStyle={styles.content}>
          {items.length === 0 ? (
            /* Estado: Mesa Vacía (Sin Comanda) */
            <View style={[styles.card, { alignItems: 'center', paddingVertical: 40 }]}>
              <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 8 }]}>Mesa Abierta</Text>
              <Text style={{ color: '#888', fontSize: 14, textAlign: 'center', marginBottom: 25 }}>
                La mesa está vacía y lista para recibir el primer pedido del mesero.
              </Text>
              <TouchableOpacity
                style={[styles.submitButton, { width: '80%' }]}
                onPress={() => router.push(`/comanda/${pedido?.id}`)}
              >
                <Text style={styles.submitButtonText}>Adicionar Productos</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Estado: Mesa Activa (Listado de Comandas) */
            <View>
              {/* Resumen del Pedido */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Comanda Activa</Text>
                
                <View style={styles.orderMetaContainer}>
                  <Text style={styles.orderMetaText}>Comanda ID</Text>
                  <Text style={styles.orderMetaValue}>#{pedido?.id}</Text>
                </View>
                <View style={styles.orderMetaContainer}>
                  <Text style={styles.orderMetaText}>Número Pedido</Text>
                  <Text style={styles.orderMetaValue}>#{pedido?.numero}</Text>
                </View>
                <View style={styles.orderMetaContainer}>
                  <Text style={styles.orderMetaText}>Cliente</Text>
                  <Text style={styles.orderMetaValue}>{pedido?.cliente_id ? 'Registrado' : 'Consumidor Final'}</Text>
                </View>
              </View>

              {/* Listado de Productos Ordenados */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Productos Ordenados</Text>
                
                {items.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.producto_nombre}</Text>
                      <Text style={styles.itemMeta}>
                        {item.cantidad} UND x ${Number(item.precio_unitario).toLocaleString()}
                        {item.nota ? ` • "${item.nota}"` : ''}
                      </Text>
                    </View>
                    <Text style={styles.itemPrice}>
                      ${Number(item.subtotal).toLocaleString()}
                    </Text>
                    {renderItemStatusPill(item.estado)}
                  </View>
                ))}

                {/* Subtotales y Totales */}
                <View style={styles.totalsContainer}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal Consumo</Text>
                    <Text style={styles.totalValue}>${Number(pedido?.total || 0).toLocaleString()}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Propina sugerida</Text>
                    <Text style={styles.totalValue}>${Number(pedido?.propina || 0).toLocaleString()}</Text>
                  </View>
                  <View style={styles.grandTotalRow}>
                    <Text style={styles.grandTotalLabel}>TOTAL CUENTA</Text>
                    <Text style={styles.grandTotalValue}>
                      ${Number((pedido?.total || 0) + (pedido?.propina || 0)).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Acciones de la comanda */}
          {pedido ? (
            <View style={styles.actionButtonGrid}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.actionButtonPrimary]}
                onPress={() => router.push(`/comanda/${pedido.id}`)}
              >
                <Text style={styles.actionButtonPrimaryText}>Tomar Pedido</Text>
              </TouchableOpacity>

              {mesaEstado !== 'libre' ? (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.actionButtonSecondary]}
                  onPress={handleLiberarMesa}
                >
                  <Text style={styles.actionButtonSecondaryText}>Liberar Mesa</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
