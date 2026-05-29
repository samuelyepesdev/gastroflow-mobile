import { StyleSheet } from 'react-native';

/**
 * Hojas de estilo premium para la pantalla de Detalle de Mesa dinámica en GastroFlow Mobile.
 * Implementa contrastes oscuros, fuentes legibles y alineación responsiva.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F', // Slate oscuro unificado
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#161616',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#262626',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mesaTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  contentScroll: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 15,
  },
  // Formulario de apertura (Mesa Libre)
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#AAA',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#262626',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 16,
    color: '#FFF',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  submitButton: {
    backgroundColor: '#6366f1', // Índigo GastroFlow
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Comanda Activa (Mesa Ocupada)
  orderMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  orderMetaText: {
    color: '#888',
    fontSize: 13,
  },
  orderMetaValue: {
    color: '#FFF',
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  itemMeta: {
    color: '#888',
    fontSize: 12,
    marginTop: 3,
  },
  itemPrice: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  statusPill: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  // Totales
  totalsContainer: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2C',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalLabel: {
    color: '#888',
    fontSize: 14,
  },
  totalValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2C',
  },
  grandTotalLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    color: '#6366f1', // Color distintivo en el total
    fontSize: 18,
    fontWeight: '800',
  },
  // Botones de acción comandas
  actionButtonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  actionButtonPrimary: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  actionButtonPrimaryText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderColor: '#444',
  },
  actionButtonSecondaryText: {
    color: '#AAA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    color: '#888',
    fontSize: 14,
    marginTop: 12,
  },
  errorText: {
    color: '#FF8A80',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
