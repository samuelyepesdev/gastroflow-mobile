import { StyleSheet } from 'react-native';

/**
 * Hojas de estilo premium de login para GastroFlow Mobile.
 * Refleja exactamente la identidad visual de la web: colores Indigo, Slate y contrastes limpios.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Fondo oscuro azul/slate idéntico a GastroFlow Web
  },
  keyboardView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  brandIconCircle: {
    width: 65,
    height: 65,
    borderRadius: 14, // Forma cuadrada redondeada corporativa (bi-shop)
    backgroundColor: '#6366f1', // Indigo principal
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  brandIconText: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  brandName: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 15,
    letterSpacing: -0.5,
  },
  brandTagline: {
    color: '#94a3b8', // Texto secundario Slate
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#ffffff', // Fondo blanco de la tarjeta de login web
    borderRadius: 20,
    padding: 26,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  formTitle: {
    color: '#0f172a', // Slate ultra oscuro
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  formSubtitle: {
    color: '#64748b', // Slate grisáceo
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
  },
  errorAlert: {
    backgroundColor: '#fef2f2', // Alerta roja web
    borderWidth: 1.5,
    borderColor: '#fecaca',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorAlertText: {
    color: '#b91c1c',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#374151',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: 52,
    paddingHorizontal: 16,
    color: '#0f172a',
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: '#e2e8f0', // Borde gris claro idéntico
  },
  loginButton: {
    backgroundColor: '#4f46e5', // Gradiente/Color índigo corporativo
    borderRadius: 10,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    color: '#475569',
    fontSize: 11,
    textAlign: 'center',
  },
});
