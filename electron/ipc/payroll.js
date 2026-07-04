// electron/ipc/payroll.js
const { ipcMain } = require('electron');

// Quitamos el 'db' de los parámetros por ahora
function setupPayrollIPC() {
  ipcMain.handle('nomina:getAll', async () => {
    console.log("Petición recibida en payroll.js: nomina:getAll");
    
    // Devolvemos datos de prueba temporales hasta que conecten MongoDB
    return { 
      success: true, 
      data: [
        { _id: 1, nombreEmpleado: "Matías Carrasco", monto: 1500000 },
        { _id: 2, nombreEmpleado: "Ana Silva", monto: 1200000 }
      ] 
    };
  });
}

module.exports = { setupPayrollIPC };