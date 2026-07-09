const { ipcMain } = require('electron');
const { getDb } = require('../db.cjs');

const mesesMap = {
  'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4, 'Mayo': 5, 'Junio': 6,
  'Julio': 7, 'Agosto': 8, 'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12
};

const mesesInversoMap = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril', 5: 'Mayo', 6: 'Junio',
  7: 'Julio', 8: 'Agosto', 9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
};

function setupPayrollIPC() {
  
  // 1. OBTENER FILTROS Y ENLAZAR CON MONGO
  ipcMain.handle('nomina:filterAdvanced', async (event, filtros) => {
    try {
      const db = getDb();
      const nominasColeccion = db.collection('nomina');
      const { mes, ano } = filtros;

      let query = {};
      
      if (mes !== 'Todos') {
        const mesNumero = mesesMap[mes];
        query.$or = [{ mes: mesNumero }, { mes: mes }];
      }

      if (ano !== 'Todos') {
        const anoNumero = parseInt(ano);
        if (query.$or) {
          query = {
            $and: [
              { $or: query.$or },
              { $or: [{ ano: anoNumero }, { ano: String(ano) }] }
            ]
          };
        } else {
          query.$or = [{ ano: anoNumero }, { ano: String(ano) }];
        }
      }

      const resultadosMongo = await nominasColeccion.find(query).toArray();

      const datosFormateados = resultadosMongo.map(doc => {
        let mesTexto = doc.mes;
        if (typeof doc.mes === 'number') {
          mesTexto = mesesInversoMap[doc.mes] || 'Sin registro';
        }

        return {
          id: doc._id.toString(),
          empleado: doc.empleado || 'Juan Pérez',
          mes: mesTexto,
          ano: String(doc.anio || '2026'),
          salarioBase: Number(doc.monto || 0),
          bonos: Number(doc.bonos || 0),
          descuentos: Number(doc.descuentos || 0),
          monto: Number(doc.neto || doc.monto || 0),
          country: doc.country || 'ARG',
          estado: doc.estado || 'Pendiente'
        };
      });

      return { success: true, data: datosFormateados };
    } catch (error) {
      console.error("Error en nomina:filterAdvanced:", error);
      return { success: false, data: [], error: error.message };
    }
  });

  // 2. CREAR REGISTRO EN MONGO
  ipcMain.handle('nomina:create', async (event, nominaData) => {
    try {
      const db = getDb();
      const nominasColeccion = db.collection('nomina');

      const salarioBase = parseFloat(nominaData.salarioBase || 0);
      const bonos = parseFloat(nominaData.bonos || 0);
      const descuentos = parseFloat(nominaData.descuentos || 0);
      const neto = salarioBase + bonos - descuentos;

      const nuevoDocumento = {
        empleado: nominaData.empleado,
        mes: nominaData.mes, 
        ano: String(nominaData.ano), 
        salarioBase: salarioBase,
        bonos: bonos,
        descuentos: descuentos,
        neto: neto,
        monto: neto,
        country: nominaData.country || 'CHL',
        estado: nominaData.estado || 'Pendiente',
        fechaCreacion: new Date()
      };

      const resultado = await nominasColeccion.insertOne(nuevoDocumento);
      return { 
        success: true, 
        data: { id: resultado.insertedId.toString(), ...nuevoDocumento } 
      };
    } catch (error) {
      console.error("Error en nomina:create:", error);
      return { success: false, error: error.message };
    }
  });

  // 3. ELIMINAR DE MONGO
  ipcMain.handle('nomina:delete', async (event, id) => {
    try {
      const db = getDb();
      const nominasColeccion = db.collection('nomina');
      const { ObjectId } = require('mongodb');

      await nominasColeccion.deleteOne({ _id: new ObjectId(id) });
      return { success: true };
    } catch (error) {
      console.error("Error en nomina:delete:", error);
      return { success: false, error: error.message };
    }
  });

  // Lista completa de los 21 países requerida por el Front
  ipcMain.handle('nomina:getCountries', async () => {
    return [
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
    ];
  });
}

module.exports = { setupPayrollIPC };