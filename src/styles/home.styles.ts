import { StyleSheet } from 'react-native';

/**
 * Hojas de estilo premium para la pantalla principal (Salón de Mesas) de GastroFlow Mobile.
 * REPLICA EXACTA del diseño web: Estilo Loggro Restobar con Relieve 3D,
 * representación cenital de mesas con sillas interactivas y división de
 * "Pedidos WhatsApp / Domicilios" (Mesas Virtuales) y "Atención en Salón".
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
  welcomeText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleText: {
    color: '#6366f1', // Índigo GastroFlow
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: 'rgba(211, 47, 47, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(211, 47, 47, 0.5)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutButtonText: {
    color: '#FF8A80',
    fontSize: 13,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentScroll: {
    paddingHorizontal: 16,
    paddingTop: 15,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5,
    gap: 8,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#888',
    fontSize: 12,
    marginBottom: 15,
  },
  gridContainer: {
    paddingBottom: 25,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  // 3D PHYSICAL TABLE CARD (Loggro Restobar Style)
  mesaRealCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    width: '48%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#262626',
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  mesaRealLayoutWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  // Sillas cenitales en 2D alrededor de la mesa
  sillaRealItem: {
    position: 'absolute',
    backgroundColor: '#475569',
    borderColor: '#64748b',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  sillaTop: {
    width: 22,
    height: 12,
    top: 6,
    borderRadius: 5,
  },
  sillaBottom: {
    width: 22,
    height: 12,
    bottom: 6,
    borderRadius: 5,
  },
  sillaLeft: {
    width: 12,
    height: 22,
    left: 6,
    borderRadius: 5,
  },
  sillaRight: {
    width: 12,
    height: 22,
    right: 6,
    borderRadius: 5,
  },
  // Sillas color por estado de mesa
  sillaLibre: {
    backgroundColor: '#0f766e',
    borderColor: '#14b8a6',
  },
  sillaOcupada: {
    backgroundColor: '#475569',
    borderColor: '#94a3b8',
  },
  sillaReservada: {
    backgroundColor: '#78350f',
    borderColor: '#b45309',
  },
  // Cuerpo redondo de la mesa 3D
  mesaRealObjetoCuerpo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 3,
  },
  mesaCuerpoLibre: {
    backgroundColor: '#059669',
    borderColor: '#34d399',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  mesaCuerpoOcupada: {
    backgroundColor: '#dc2626',
    borderColor: '#f87171',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  mesaCuerpoReservada: {
    backgroundColor: '#d97706',
    borderColor: '#fbbf24',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  // Brillo superior laca/cristal
  mesaRealObjetoBrillo: {
    position: 'absolute',
    top: '6%',
    left: '12%',
    width: '76%',
    height: '32%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  mesaRealObjetoNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mesaRealObjetoBadge: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  badgeLibre: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  badgeOcupada: {
    backgroundColor: '#dc2626',
    borderColor: '#FFF',
    borderWidth: 0.5,
  },
  badgeReservada: {
    backgroundColor: '#fbbf24',
    color: '#000',
  },
  // VIRTUAL WHATSAPP CARD STYLE
  mesaVirtualCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    width: '48%',
    borderWidth: 1,
    borderColor: '#22c55e44', // Borde verde WhatsApp
    padding: 12,
    justifyContent: 'space-between',
    minHeight: 180,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  virtualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  virtualTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  virtualTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  virtualDesc: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#22c55e',
    marginVertical: 8,
  },
  virtualDescText: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Botones de acción comanda/gestión
  btnCta: {
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  btnCtaSuccess: {
    backgroundColor: '#10b981',
  },
  btnCtaWarning: {
    backgroundColor: '#f59e0b',
  },
  btnCtaText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  btnSecContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    width: '100%',
  },
  btnSec: {
    flex: 1,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSecText: {
    color: '#AAA',
    fontSize: 11,
    fontWeight: '600',
  },
  // Status Pill
  statusPill: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusPillText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  pillLibre: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  pillOcupada: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  pillReservada: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  // Utilidades
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
  emptyText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});
