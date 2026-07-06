const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// 1. IMPORTAMOS TUS DOS MÓDULOS (Con la extensión .cjs correcta)
const { setupAuthIPC } = require('./ipc/auth.cjs');
const { setupPayrollIPC } = require('./ipc/payroll.cjs');

// Simulación de controladores IPC para cada módulo
ipcMain.handle('employee:getAll', async (event, args) => {
  console.log("Petición recibida en main.js: employee:getAll");
  return [
    { id: 1, nombre: "Juan Pérez", puesto: "Desarrollador" },
    { id: 2, nombre: "María López", puesto: "Diseñadora" }
  ]; 
});

// 2. CONECTAMOS TUS MÓDULOS AL TABLERO PRINCIPAL
setupAuthIPC(); 
setupPayrollIPC(); 

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

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