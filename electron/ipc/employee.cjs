const { ipcMain } = require('electron');
const { connectDB } = require('../db.cjs'); // Verifica que tu archivo db.js esté en la carpeta electron/db.js
const { ObjectId } = require('mongodb');

function initEmployeeIPC() {
  // 1. Obtener todos los empleados de MongoDB
  ipcMain.handle('employee:getAll', async () => {
    try {
      const db = await connectDB();
      const empleados = await db.collection('empleados').find({}).toArray();
      
      return empleados.map(emp => ({
        id: emp._id.toString(), // Convertimos el ObjectId de Mongo a String para React
        nombre: emp.nombre,
        cedula: emp.cedula,
        estado: emp.estado
      }));
    } catch (error) {
      console.error("Error en IPC employee:getAll:", error);
      return [];
    }
  });

  // 2. Buscar empleados por expresión regular
  ipcMain.handle('employee:search', async (event, query) => {
    try {
      const db = await connectDB();
      const empleados = await db.collection('empleados').find({
        nombre: { $regex: query, $options: 'i' }
      }).toArray();

      return empleados.map(emp => ({
        id: emp._id.toString(),
        nombre: emp.nombre,
        cedula: emp.cedula,
        estado: emp.estado
      }));
    } catch (error) {
      console.error("Error en IPC employee:search:", error);
      return [];
    }
  });

  // 3. Obtener el expediente completo del perfil
ipcMain.handle('employee:getProfileData', async (event, id) => {
  try {
    const db = await connectDB();
    
    // Forzamos la limpieza del string del ID eliminando cualquier espacio en blanco
    const cleanId = String(id).trim();
    console.log("-> Servidor Electron intentando buscar el ID en MongoDB:", cleanId);
    const objId = new ObjectId(cleanId);

    // 1. Buscamos el empleado por su _id real
    const empleado = await db.collection('empleados').findOne({ _id: objId });

    if (!empleado) {
      console.log(`⚠️ No se encontró el empleado con ID: ${cleanId} en la colección 'empleados'`);
      return null;
    }

    // 2. Buscamos las relaciones usando el objId
    const [evaluaciones, capacitaciones] = await Promise.all([
      db.collection('evaluaciones').find({ 
        empleadoId: { $in: [objId, cleanId] } 
      }).toArray(),
      db.collection('capacitaciones').find({ 
        empleadoId: { $in: [objId, cleanId] } 
      }).toArray()
    ]);

    return {
      info: {
        id: empleado._id.toString(),
        nombre: empleado.nombre,
        email: empleado.email,
        cedula: empleado.cedula,
        telefono: empleado.telefono,
        pais: empleado.pais,
        remoto: empleado.remoto,
        estado: empleado.estado
      },
      evaluaciones: evaluaciones.map(ev => ({
        id: ev._id.toString(),
        fecha: ev.fecha,
        evaluador: ev.evaluador,
        puntaje: ev.puntaje,
        comentarios: ev.comentarios
      })),
      capacitaciones: capacitaciones.map(cap => ({
        id: cap._id.toString(),
        nombre: cap.nombre,
        tipo: cap.tipo,
        institucion: cap.institucion,
        fecha: cap.fecha
      }))
    };
  } catch (error) {
    console.error("Error crítico en IPC employee:getProfileData:", error);
    return null;
  }
});
}

module.exports = { initEmployeeIPC };