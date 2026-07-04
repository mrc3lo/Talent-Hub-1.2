// electron/ipc/auth.js
const { ipcMain } = require('electron');

function setupAuthIPC(db) {
  // Canal para validar el login contra la base de datos
  ipcMain.handle('auth:login', async (event, credentials) => {
    try {
      const { email, password } = credentials;
      
      // Consultar la colección 'usuarios' definida en la arquitectura
      const usuariosCollection = db.collection('usuarios');
      const user = await usuariosCollection.findOne({ email: email, password: password });

      if (user) {
        // Retornar éxito sin enviar la contraseña por seguridad
        const { password, ...usuarioSeguro } = user; 
        return { success: true, data: usuarioSeguro };
      } else {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
      }
    } catch (error) {
      console.error('Error en auth:login:', error);
      return { success: false, message: 'Error interno' };
    }
  });
}

module.exports = { setupAuthIPC };