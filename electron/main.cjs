const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// 1. IMPORTAMOS TUS DOS MÓDULOS (Auth y Payroll)
const { setupAuthIPC } = require('./ipc/auth.js');
const { setupPayrollIPC } = require('./ipc/payroll.js');

// Simulación de controladores IPC para cada módulo (luego se separan en carpetas)
// Aquí registramos el primer canal de ejemplo para el Integrante A (employee)
ipcMain.handle('employee:getAll', async (event, args) => {
  console.log("Petición recibida en main.js: employee:getAll");
  return [
    { id: 1, nombre: "Juan Pérez", puesto: "Desarrollador" },
    { id: 2, nombre: "María López", puesto: "Diseñadora" }
  ]; 
});

// 2. CONECTAMOS TUS MÓDULOS AL PROCESO PRINCIPAL DE ELECTRON
setupAuthIPC(); 
setupPayrollIPC(); 

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // Apunta al archivo preload.cjs para activar el puente
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