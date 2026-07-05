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

// Función auxiliar para leer los datos del archivo JSON de forma segura
function readDatabase() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      // Inicia vacío sin registros de prueba pre-cargados
      const initialData = [];
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error leyendo la base de datos local:", error);
    return [];
  }
}

// Función auxiliar para escribir los datos en el archivo JSON
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
  
  // Obtener todas las nóminas
  ipcMain.handle('nomina:getAll', async () => {
    const db = readDatabase();
    return { success: true, data: db };
  });

  // Filtrar nóminas por país
  ipcMain.handle('nomina:filter', async (event, countryCode) => {
    try {
      if (!countryCode) {
        return { success: true, data: [] };
      }
      const db = readDatabase();
      const filteredData = db.filter(item => item.country === countryCode);
      return { success: true, data: filteredData };
    } catch (error) {
      console.error("Error al filtrar:", error);
      return { success: false, data: [] };
    }
  });

  // REGISTRAR NUEVA NÓMINA (Recibe estado explícito desde el frontend)
  ipcMain.handle('nomina:create', async (event, newNomina) => {
    try {
      console.log("Recibiendo nueva nómina en backend:", newNomina);
      
      // Validar datos básicos incluyendo el nuevo campo de estado
      if (!newNomina.country || !newNomina.monto || !newNomina.fecha || !newNomina.estado) {
        return { success: false, message: "Faltan datos requeridos." };
      }

      // Validar que el monto no sea negativo
      if (parseFloat(newNomina.monto) <= 0) {
        return { success: false, message: "El monto debe ser mayor a cero." };
      }

      const registro = {
        id: `dyn-${Date.now()}`,
        monto: parseFloat(newNomina.monto),
        fecha: newNomina.fecha,
        estado: newNomina.estado, // Toma 'Pendiente' o 'Pagado' directamente del cliente
        country: newNomina.country
      };

      // Leemos el JSON actual, agregamos el registro y volvemos a guardar
      const db = readDatabase();
      db.push(registro);
      writeDatabase(db);
      
      // Devolvemos la lista actualizada de ese país para refrescar la tabla de inmediato
      const updatedList = db.filter(item => item.country === newNomina.country);
      return { success: true, data: updatedList };

    } catch (error) {
      console.error("Error al crear nómina:", error);
      return { success: false, message: "Error interno del servidor." };
    }
  });

  // Retorna países
  ipcMain.handle('nomina:getCountries', async () => {
    return ALL_COUNTRIES;
  });
}

module.exports = { setupPayrollIPC };