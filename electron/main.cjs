const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Simulación de controladores IPC para cada módulo (luego se separan en carpetas)
// Aquí registramos el primer canal de ejemplo para el Integrante A (employee)
ipcMain.handle('employee:getAll', async (event, args) => {
  // Aquí irá la lógica de MongoDB: return await db.collection('empleados').find().toArray();
  console.log("Petición recibida en main.js: employee:getAll");
  return [
    { id: 1, nombre: "Juan Pérez", puesto: "Desarrollador" },
    { id: 2, nombre: "María López", puesto: "Diseñadora" }
  ]; // Datos de prueba idénticos al flujo de tu arquitectura
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // Apunta al archivo preload.js para activar el puente
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // En desarrollo, Electron carga el servidor local de Vite
  mainWindow.loadURL('http://localhost:5173'); 
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});