import { StyleSheet } from 'react-native';

/**
 * Estilos independientes para la pantalla principal (Salón de Mesas) de GastroFlow.
 * Adaptados al tema corporativo índigo y slate de la web oficial.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F', // Fondo oscuro unificado
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
    color: '#6366f1', // Índigo GastroFlow en lugar de naranja
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
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mesaCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    width: '47%',
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  mesaStatusIndicator: {
    height: 6,
    width: '100%',
  },
  mesaCardBody: {
    padding: 16,
  },
  mesaNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mesaCapacity: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  statusBadgeContainer: {
    alignItems: 'flex-start',
    marginTop: 10,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
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
    backgroundColor: '#6366f1', // Índigo GastroFlow
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
