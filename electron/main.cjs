const { app, BrowserWindow } = require('electron');
const path = require('path');
const { initEmployeeIPC } = require('./ipc/employee.cjs'); // ← Importamos tu controlador modular de MongoDB

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'), // Mantiene tu puente seguro
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL('http://localhost:5173'); 
}

app.whenReady().then(() => {
  // Inicializa todos los canales de MongoDB (getAll, search, getProfileData)
  initEmployeeIPC();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});