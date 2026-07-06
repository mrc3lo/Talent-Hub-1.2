// src/services/authService.js

/**
 * Servicio para gestionar la autenticación del usuario.
 * Se comunica con el backend de Electron a través de IPC.
 */
export const authService = {
  login: async (email, password) => {
    try {
      // Usamos window.electronAPI para invocar el canal que creamos en el Paso 2
      const response = await window.electronAPI.invoke('auth:login', { 
        email, 
        password 
      });
      
      return response;
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      return { success: false, message: 'No se pudo conectar con el servicio de autenticación' };
    }
  }
};