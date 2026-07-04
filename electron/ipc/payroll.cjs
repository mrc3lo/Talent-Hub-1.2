// electron/ipc/payroll.cjs
const { ipcMain } = require('electron');

function setupPayrollIPC() {
  // Manejador para obtener todas las nóminas
  ipcMain.handle('nomina:getAll', async () => {
    console.log("Petición recibida en payroll.cjs: nomina:getAll");
    
    // Datos consistentes con los empleados del sistema
    return { 
      success: true, 
      data: [
        { _id: 1, nombreEmpleado: "Juan Pérez", monto: 1500000 },
        { _id: 2, nombreEmpleado: "María López", monto: 1200000 }
      ] 
    };
  });

  // Manejador para filtrar nóminas
  ipcMain.handle('nomina:filter', async (event, criteria) => {
    console.log("Filtrando nóminas con:", criteria);
    // Lógica futura para filtrar en MongoDB
    return { success: true, data: [] };
  });
}

module.exports = { setupPayrollIPC };