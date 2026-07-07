const { app, BrowserWindow, ipcMain } = require('electron'); // 💡 Asegúrate de que ipcMain esté aquí si se usa arriba
const path = require('path');

// 👥 IMPORTACIÓN DOMINIO 1: Tu controlador modular de MongoDB
const { initEmployeeIPC } = require('./ipc/employee.cjs'); 

// 🔐💰 IMPORTACIÓN DOMINIO 3 Y NÓMINA: Controladores en CommonJS (.cjs)
const { setupAuthIPC } = require('./ipc/auth.cjs');
const { setupPayrollIPC } = require('./ipc/payroll.cjs');

// CONECTAMOS LOS MÓDULOS AL TABLERO PRINCIPAL (Antes de que la app esté lista)
setupAuthIPC(); 
setupPayrollIPC(); 

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'), // Mantiene tu puente seguro unificado
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL('http://localhost:5173'); 
}

app.whenReady().then(async () => {
  // 1. Conectamos la base de datos PRIMERO (Traído desde main)
  const { connectDB } = await import('./db.js');
  await connectDB();

  // 2. Inicializa tus canales de MongoDB (getAll, search, getProfileData)
  initEmployeeIPC();

  // 3. Importamos y ejecutamos Reclutamiento (Dominio 2) de forma dinámica
  const { setupCandidateIPC } = await import('./ipc/candidate.js');
  setupCandidateIPC();

  // 4. Creamos la ventana de la aplicación
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});