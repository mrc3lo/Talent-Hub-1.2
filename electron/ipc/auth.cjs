// electron/ipc/auth.js
// electron/ipc/auth.js
const { ipcMain } = require('electron');

function setupAuthIPC() {
  // Canal para manejar el inicio de sesión
  ipcMain.handle('auth:login', async (event, credentials) => {
    console.log("Petición recibida en auth.js: auth:login", credentials);
    
    const { username, password } = credentials || {};
    
    // Credenciales de prueba temporales
    if (username === 'admin' && password === 'admin123') {
      return { 
        success: true, 
        user: { name: 'Usuario Administrador', role: 'Admin' } 
      };
    } else {
      return { 
        success: false, 
        message: 'Usuario o contraseña incorrectos.' 
      };
    }
  });
}

module.exports = { setupAuthIPC };