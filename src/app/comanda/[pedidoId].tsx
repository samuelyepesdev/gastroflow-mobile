import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../services/api';
import { styles } from '../../styles/comanda.styles';

// Definición de Interfaces
interface Product {
  id: number;
  codigo?: string;
  nombre: string;
  precio_unidad?: number;
  precio?: number;
  precio_venta?: number;
  categoria?: string | { id: number; nombre: string };
  categoria_id?: number;
}

interface CartItem {
  producto: Product;
  cantidad: number;
  nota: string;
}

export default function TomaComandaScreen() {
  const { pedidoId } = useLocalSearchParams();
  const router = useRouter();

  // Estados del POS
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Estado de carga y errores
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Carrito de compras / lote de items
  const [cart, setCart] = useState<{ [id: number]: CartItem }>({});

  // Carga inicial de productos y categorías
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Obtener categorías
      const resCategorias = await api.get('/api/productos/categorias').catch((err) => {
        console.warn('Error al cargar categorías, usando por defecto:', err);
        return { data: [] };
      });

      // 2. Obtener productos de forma segura
      const resProductos = await api.get('/api/productos/buscar?q=');
      
      const dataProductos = resProductos.data || [];
      if (Array.isArray(dataProductos)) {
        setProductos(dataProductos);
      } else {
        setProductos([]);
      }

      const dataCategorias = resCategorias.data || [];
      if (Array.isArray(dataCategorias)) {
        setCategorias(dataCategorias);
      } else {
        setCategorias([]);
      }

    } catch (err: any) {
      console.error('Error al cargar POS:', err);
      setError('No se pudieron obtener los productos. Por favor reintenta.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Agregar un producto al carrito
  const addToCart = (product: Product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        producto: product,
        cantidad: 1,
        nota: '',
      },
    }));
  };

  // Actualizar la cantidad de un producto en el carrito
  const updateQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      // Eliminar si es 0 o menor
      setCart((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    } else {
      setCart((prev) => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          cantidad: newQty,
        },
      }));
    }
  };

  // Actualizar la nota de cocina para un producto específico
  const updateNota = (productId: number, notaText: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        nota: notaText,
      },
    }));
  };

  // Enviar el lote a cocina (POST individual por item en paralelo)
  const handleEnviarCocina = async () => {
    const itemsArray = Object.values(cart);
    if (itemsArray.length === 0) return;

    try {
      setSubmitting(true);

      // Creamos las promesas para registrar cada producto
      const promesas = itemsArray.map((item) => {
        const prodPrice = item.producto.precio_unidad ?? item.producto.precio ?? item.producto.precio_venta ?? 0;
        
        return api.post(`/api/mesas/pedidos/${pedidoId}/items`, {
          producto_id: item.producto.id,
          cantidad: item.cantidad,
          precio: prodPrice,
          unidad: 'UND',
          nota: item.nota || null,
        });
      });

      // Ejecutar de forma segura
      await Promise.all(promesas);

      Alert.alert('¡Comanda Enviada!', 'Los platillos han sido enviados exitosamente a la cola de cocina.', [
        {
          text: 'Entendido',
          onPress: () => {
            // Regresar al detalle de la mesa
            router.back();
          },
        },
      ]);
    } catch (err: any) {
      console.error('Error al registrar comanda:', err);
      Alert.alert('Error', err.response?.data?.error || 'Ocurrió un error al enviar el pedido a cocina.');
    } finally {
      setSubmitting(false);
    }
  };

  // Lógica de Filtrado de Productos (Buscador + Categorías)
  const getFilteredProducts = () => {
    return productos.filter((p) => {
      // Filtrado por categoría
      let matchesCategory = true;
      if (selectedCategory !== 'todos') {
        const pCatName = typeof p.categoria === 'object' ? p.categoria.nombre : p.categoria;
        matchesCategory = String(pCatName || '').toLowerCase() === selectedCategory.toLowerCase();
      }

      // Filtrado por texto de búsqueda
      let matchesSearch = true;
      if (searchQuery.trim().length > 0) {
        matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (p.codigo || '').toLowerCase().includes(searchQuery.toLowerCase());
      }

      return matchesCategory && matchesSearch;
    });
  };

  // Calcular totales del carrito flotante
  const getCartTotals = () => {
    const items = Object.values(cart);
    const count = items.reduce((sum, i) => sum + i.cantidad, 0);
    const total = items.reduce((sum, i) => {
      const price = i.producto.precio_unidad ?? i.producto.precio ?? i.producto.precio_venta ?? 0;
      return sum + (price * i.cantidad);
    }, 0);

    return { count, total };
  };

  const { count: cartCount, total: cartTotal } = getCartTotals();
  const filteredProducts = getFilteredProducts();

  // Renderizador de pestañas de categorías
  const renderCategoryItem = ({ item }: { item: string }) => {
    const isActive = selectedCategory === item;
    return (
      <TouchableOpacity
        style={[styles.categoryTab, isActive && styles.categoryTabActive]}
        onPress={() => setSelectedCategory(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}>
          {item === 'todos' ? 'Todos' : item}
        </Text>
      </TouchableOpacity>
    );
  };

  // Renderizador de tarjetas de productos
  const renderProductItem = ({ item }: { item: Product }) => {
    const cartItem = cart[item.id];
    const inCart = !!cartItem;
    const price = item.precio_unidad ?? item.precio ?? item.precio_venta ?? 0;
    const categoryName = typeof item.categoria === 'object' ? item.categoria.nombre : item.categoria;

    return (
      <View style={styles.productCard}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.nombre}</Text>
          <Text style={styles.productCategory}>{categoryName || 'General'}</Text>
          <Text style={styles.productPrice}>${Number(price).toLocaleString()}</Text>

          {inCart && (
            <TextInput
              style={styles.noteInput}
              placeholder="Notas cocina: ej. sin cebolla..."
              placeholderTextColor="#666"
              value={cartItem.nota}
              onChangeText={(text) => updateNota(item.id, text)}
              multiline={false}
            />
          )}
        </View>

        <View style={styles.actionContainer}>
          {!inCart ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>+ Adicionar</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => updateQuantity(item.id, cartItem.cantidad - 1)}
              >
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{cartItem.cantidad}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => updateQuantity(item.id, cartItem.cantidad + 1)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Convertimos las categorías a strings únicos legibles
  const rawCatList = categorias.map((c) => {
    return typeof c === 'object' ? (c.nombre || c.name || '') : String(c);
  }).filter((c) => c.trim().length > 0);

  const categoryTabs = ['todos', ...Array.from(new Set(rawCatList))];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" />
      
      {/* Cabecera */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tomar Pedido</Text>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar platillo o bebida..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Pestañas de Categoría */}
      {!loading && categoryTabs.length > 1 && (
        <View style={styles.categoryScroll}>
          <FlatList
            data={categoryTabs}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          />
        </View>
      )}

      {/* Contenido Principal */}
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Cargando menú...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={cargarDatos}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.gridContainer}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No se encontraron platillos o bebidas.</Text>
              </View>
            }
          />
        )}
      </KeyboardAvoidingView>

      {/* Footer del Carrito Flotante */}
      {cartCount > 0 && (
        <View style={styles.cartFooter}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartSummaryText}>
              {cartCount} {cartCount === 1 ? 'producto seleccionado' : 'productos seleccionados'}
            </Text>
            <Text style={styles.cartTotalText}>
              ${Number(cartTotal).toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleEnviarCocina}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Enviar a Cocina ({cartCount})</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
