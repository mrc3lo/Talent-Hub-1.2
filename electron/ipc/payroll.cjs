const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// Ruta donde se guardará el archivo JSON en la carpeta del proyecto
const DATA_FILE = path.join(__dirname, 'payroll_db.json');

// Lista de países estática
const ALL_COUNTRIES = [
  { code: 'ARG', name: 'Argentina' },
  { code: 'BOL', name: 'Bolivia' },
  { code: 'BRA', name: 'Brasil' },
  { code: 'CAN', name: 'Canadá' },
  { code: 'CHL', name: 'Chile' },
  { code: 'COL', name: 'Colombia' },
  { code: 'CRI', name: 'Costa Rica' },
  { code: 'ECU', name: 'Ecuador' },
  { code: 'SLV', name: 'El Salvador' },
  { code: 'ESP', name: 'España' },
  { code: 'GTM', name: 'Guatemala' },
  { code: 'HND', name: 'Honduras' },
  { code: 'MEX', name: 'México' },
  { code: 'NIC', name: 'Nicaragua' },
  { code: 'PAN', name: 'Panamá' },
  { code: 'PRY', name: 'Paraguay' },
  { code: 'PER', name: 'Perú' },
  { code: 'PRI', name: 'Puerto Rico' },
  { code: 'URY', name: 'Uruguay' },
  { code: 'USA', name: 'Estados Unidos' },
  { code: 'VEN', name: 'Venezuela' }
].sort((a, b) => a.name.localeCompare(b.name));

function readDatabase() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initialData = [
        {
          id: "init-1",
          empleado: "Matías Carrasco",
          mes: "Julio",
          ano: "2026",
          salarioBase: 1000000,
          bonos: 150000,
          descuentos: 50000,
          monto: 1100000,
          fecha: "2026-07-06",
          estado: "Pendiente",
          country: "USA"
        }
      ];
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(fileContent);
    
    if (Array.isArray(parsedData)) {
      return parsedData.filter(item => item && item.empleado && item.empleado.trim() !== "");
    }
    return [];
  } catch (error) {
    console.error("Error leyendo la base de datos local:", error);
    return [];
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Error escribiendo la base de datos local:", error);
    return false;
  }
}

function setupPayrollIPC() {
  
  ipcMain.handle('nomina:getAll', async () => {
    const db = readDatabase();
    return { success: true, data: db };
  });

  ipcMain.handle('nomina:filterAdvanced', async (event, { mes, ano }) => {
    try {
      let db = readDatabase();
      if (mes && mes !== 'Todos') db = db.filter(item => item.mes === mes);
      if (ano && ano !== 'Todos') db = db.filter(item => item.ano === ano);
      return { success: true, data: db };
    } catch (error) {
      return { success: false, data: [] };
    }
  });

  ipcMain.handle('nomina:create', async (event, newNomina) => {
    try {
      const salarioBase = parseFloat(newNomina.salarioBase || 0);
      const bonos = parseFloat(newNomina.bonos || 0);
      const descuentos = parseFloat(newNomina.descuentos || 0);
      const neto = salarioBase + bonos - descuentos;

      const registro = {
        id: `dyn-${Date.now()}`,
        empleado: newNomina.empleado,
        mes: newNomina.mes,
        ano: newNomina.ano,
        salarioBase: salarioBase,
        bonos: bonos,
        descuentos: descuentos,
        monto: neto,
        fecha: newNomina.fecha,
        estado: newNomina.estado, 
        country: newNomina.country
      };

      const db = readDatabase();
      db.push(registro);
      writeDatabase(db);
      return { success: true, data: db };
    } catch (error) {
      return { success: false, message: "Error interno al crear." };
    }
  });

  // NUEVO INTERCEPTOR PARA ELIMINAR REGISTROS
  ipcMain.handle('nomina:delete', async (event, id) => {
    try {
      let db = readDatabase();
      db = db.filter(item => item.id !== id);
      writeDatabase(db);
      return { success: true, data: db };
    } catch (error) {
      return { success: false, message: "Error al eliminar el registro." };
    }
  });

  ipcMain.handle('nomina:getCountries', async () => {
    return ALL_COUNTRIES;
  });
}

module.exports = { setupPayrollIPC };