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

        let codigoPais = doc.country || 'ar';
        if (codigoPais.length === 3) {
          const iso3ToIso2 = { 'ARG': 'ar', 'CHL': 'cl', 'COL': 'co', 'MEX': 'mx', 'PER': 'pe', 'JPN': 'jp' };
          codigoPais = iso3ToIso2[codigoPais.toUpperCase()] || codigoPais.toLowerCase();
        } else {
          codigoPais = codigoPais.toLowerCase();
        }

        return {
          id: doc._id.toString(),
          empleado: doc.empleado || 'Juan Pérez',
          mes: mesTexto,
          ano: String(doc.anio || doc.ano || '2026'),
          salarioBase: Number(doc.salarioBase || doc.monto || 0),
          bonos: Number(doc.bonos || 0),
          descuentos: Number(doc.descuentos || 0),
          monto: Number(doc.neto || doc.monto || 0),
          country: codigoPais,
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
        country: String(nominaData.country).toLowerCase() || 'cl',
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

  // 4. RETORNO EXCLUSIVO DE LOS 22 PAÍSES PERMITIDOS
  ipcMain.handle('nomina:getCountries', async () => {
    const lista22Paises = [
      { code: 'ar', name: 'Argentina' },
      { code: 'bo', name: 'Bolivia' },
      { code: 'br', name: 'Brasil' },
      { code: 'ca', name: 'Canadá' },
      { code: 'cl', name: 'Chile' },
      { code: 'co', name: 'Colombia' },
      { code: 'cr', name: 'Costa Rica' },
      { code: 'ec', name: 'Ecuador' },
      { code: 'sv', name: 'El Salvador' },
      { code: 'es', name: 'España' },
      { code: 'gt', name: 'Guatemala' },
      { code: 'hn', name: 'Honduras' },
      { code: 'mx', name: 'México' },
      { code: 'ni', name: 'Nicaragua' },
      { code: 'pa', name: 'Panamá' },
      { code: 'py', name: 'Paraguay' },
      { code: 'pe', name: 'Perú' },
      { code: 'pr', name: 'Puerto Rico' },
      { code: 'uy', name: 'Uruguay' },
      { code: 'us', name: 'Estados Unidos' },
      { code: 've', name: 'Venezuela' },
      { code: 'jp', name: 'Japón' }
    ];

    // Se retorna directamente la lista acotada ordenada alfabéticamente
    return lista22Paises.sort((a, b) => a.name.localeCompare(b.name));
  });
}

module.exports = { setupPayrollIPC };