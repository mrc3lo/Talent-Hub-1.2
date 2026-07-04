// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { authService } from '../services/authService';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // --- ATRAVESAMOS EL LOGIN TEMPORALMENTE PARA PROBAR LA NAVEGACIÓN ---
    // En lugar de llamar a authService.login, forzamos un resultado exitoso
    const result = { success: true }; 
    // --------------------------------------------------------------------

    if (result.success) {
      // Invocamos la función para cambiar de pantalla al directorio de empleados
      onLoginSuccess(); 
    } else {
      setError('No se pudo conectar con el servicio de autenticación');
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Login - TalentHub</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="email" placeholder="Correo" 
          value={email} onChange={(e) => setEmail(e.target.value)} required 
        />
        <br />
        <input 
          type="password" placeholder="Contraseña" 
          value={password} onChange={(e) => setPassword(e.target.value)} required 
        />
        <br />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Importamos Axios para la API externa

// Ruta donde se guardará el archivo JSON en la carpeta del proyecto
const DATA_FILE = path.join(__dirname, 'payroll_db.json');

// Lista de países estática (Mecanismo de respaldo ante fallas de red)
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

// Función auxiliar para leer los datos de las nóminas del archivo JSON de forma segura
function readDatabase() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initialData = [
        { id: 'init-1', monto: 1750, fecha: '2026-06-15', estado: 'Pagado', country: 'CHL' },
        { id: 'init-2', monto: 2100, fecha: '2026-07-20', estado: 'Pendiente', country: 'CHL' },
        { id: 'init-3', monto: 1900, fecha: '2026-06-01', estado: 'Pagado', country: 'ARG' }
      ];
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

// Función auxiliar para escribir los datos de las nóminas en el archivo JSON
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

  // Registrar nueva nómina con validaciones y persistencia JSON
  ipcMain.handle('nomina:create', async (event, newNomina) => {
    try {
      if (!newNomina.country || !newNomina.monto || !newNomina.fecha) {
        return { success: false, message: "Faltan datos requeridos." };
      }

      if (parseFloat(newNomina.monto) <= 0) {
        return { success: false, message: "El monto debe ser mayor a cero." };
      }

      // Determinar estado automáticamente (Comparado con la fecha de corte simulada)
      const hoy = new Date('2026-07-04');
      const fechaSeleccionada = new Date(newNomina.fecha);
      const estadoCalculado = fechaSeleccionada > hoy ? 'Pendiente' : 'Pagado';

      const registro = {
        id: `dyn-${Date.now()}`,
        monto: parseFloat(newNomina.monto),
        fecha: newNomina.fecha,
        estado: estadoCalculado,
        country: newNomina.country
      };

      const db = readDatabase();
      db.push(registro);
      writeDatabase(db);
      
      const updatedList = db.filter(item => item.country === newNomina.country);
      return { success: true, data: updatedList };

    } catch (error) {
      console.error("Error al crear nómina:", error);
      return { success: false, message: "Error interno del servidor." };
    }
  });

  // Obtener países consumiendo la API externa (RestCountries) con tolerancia a fallos
  ipcMain.handle('nomina:getCountries', async () => {
    try {
      console.log("Intentando conectar con API externa RestCountries a través de Axios...");
      const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca3', { timeout: 4000 });
      
      if (response.data && Array.isArray(response.data)) {
        // Filtramos y estructuramos las traducciones a español para que la UI se mantenga limpia
        const apiCountries = response.data
          .map(c => ({
            code: c.cca3,
            name: c.name.translations?.spa?.common || c.name.common
          }))
          // Filtramos solo los países que manejamos en nuestro backend regional por seguridad de consistencia
          .filter(c => ALL_COUNTRIES.some(local => local.code === c.code))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        if (apiCountries.length > 0) {
          console.log("API externa mapeada con éxito.");
          return apiCountries;
        }
      }
    } catch (error) {
      console.warn("La API externa no respondió o no hay internet. Activando respaldo local de contingencia.");
    }
    
    // Si la API falla, cae inmediatamente en el respaldo estático local sin romper la aplicación
    return ALL_COUNTRIES;
  });
}

module.exports = { setupPayrollIPC };