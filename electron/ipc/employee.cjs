const { ipcMain } = require('electron');
const { connectDb } = require('../db.cjs'); 
const { ObjectId } = require('mongodb');

function initEmployeeIPC() {
  
  // 1. Obtener todos los empleados de MongoDB (Con Departamento y Puesto reales)
  ipcMain.handle('employee:getAll', async () => {
    try {
      const db = await connectDb();
      
      const empleadosConDept = await db.collection('empleados').aggregate([
        // Relación con Departamentos
        {
          $lookup: {
            from: 'departamentos',
            localField: 'departamento_id',
            foreignField: '_id',
            as: 'deptInfo'
          }
        },
        {
          $unwind: {
            path: '$deptInfo',
            preserveNullAndEmptyArrays: true 
          }
        },
        // Relación con Puestos
        {
          $lookup: {
            from: 'puestos', 
            localField: 'puesto_id', // Asegúrate de que en la BD se llame 'puesto_id' (o 'puesto')
            foreignField: '_id',
            as: 'puestoInfo'
          }
        },
        {
          $unwind: {
            path: '$puestoInfo',
            preserveNullAndEmptyArrays: true
          }
        }
      ]).toArray();
      
      return empleadosConDept.map(emp => {
        const idString = emp._id ? emp._id.toString() : '';
        return {
          id: idString,
          _id: idString, 
          nombre: emp.nombre || 'Sin Nombre',
          cedula: emp.cedula || 'Sin Cédula',
          puesto: emp.puestoInfo ? emp.puestoInfo.nombre : 'No asignado', 
          estado: emp.estado || 'No especificado',      
          departamento: emp.deptInfo ? emp.deptInfo.nombre : 'Sin Área'
        };
      });
    } catch (error) {
      console.error("Error en IPC employee:getAll:", error);
      return [];
    }
  });

  // 2. Buscar empleados por expresión regular (Nombre o Cédula) - CORREGIDO CORCHETE/LLAVE
  ipcMain.handle('employee:search', async (event, query) => {
    try {
      const db = await connectDb();
      
      const filtro = {
        $or: [
          { nombre: { $regex: query, $options: 'i' } },
          { cedula: { $regex: query, $options: 'i' } }
        ] // <-- Fijado aquí
      };

      const empleados = await db.collection('empleados').aggregate([
        { $match: filtro }, 
        // Relación con Departamentos
        {
          $lookup: {
            from: 'departamentos',
            localField: 'departamento_id',
            foreignField: '_id',
            as: 'deptInfo'
          }
        },
        {
          $unwind: {
            path: '$deptInfo',
            preserveNullAndEmptyArrays: true
          }
        },
        // Relación con Puestos también en la búsqueda
        {
          $lookup: {
            from: 'puestos',
            localField: 'puesto_id',
            foreignField: '_id',
            as: 'puestoInfo'
          }
        },
        {
          $unwind: {
            path: '$puestoInfo',
            preserveNullAndEmptyArrays: true
          }
        }
      ]).toArray();

      return empleados.map(emp => ({
        id: emp._id.toString(),
        _id: emp._id.toString(),
        nombre: emp.nombre || 'Sin Nombre',
        cedula: emp.cedula || 'Sin Cédula',
        puesto: emp.puestoInfo ? emp.puestoInfo.nombre : 'No asignado', 
        estado: emp.estado || 'No especificado',      
        departamento: emp.deptInfo ? emp.deptInfo.nombre : 'Sin Área' 
      }));
    } catch (error) {
      console.error("Error en IPC employee:search:", error);
      return [];
    }
  });

  // 3. Obtener el expediente completo del perfil (Con aggregate para rellenar Puesto y Departamento)
  ipcMain.handle('employee:getProfileData', async (event, id) => {
    try {
      const db = await connectDb();
      
      const cleanId = String(id).trim();
      console.log("-> Servidor Electron intentando buscar el ID en MongoDB:", cleanId);
      const objId = new ObjectId(cleanId);

      const empleadosAgregados = await db.collection('empleados').aggregate([
        { $match: { _id: objId } },
        {
          $lookup: {
            from: 'puestos',
            localField: 'puesto_id',
            foreignField: '_id',
            as: 'puestoInfo'
          }
        },
        {
          $unwind: {
            path: '$puestoInfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'departamentos',
            localField: 'departamento_id',
            foreignField: '_id',
            as: 'deptInfo'
          }
        },
        {
          $unwind: {
            path: '$deptInfo',
            preserveNullAndEmptyArrays: true
          }
        }
      ]).toArray();

      const empleado = empleadosAgregados[0];

      if (!empleado) {
        console.log(`⚠️ No se encontró el empleado con ID: ${cleanId}`);
        return null;
      }

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
          nombre: empleado.nombre || 'Sin Nombre',
          email: empleado.email || 'Sin Email',
          cedula: empleado.cedula || 'Sin Cédula',
          puesto: empleado.puestoInfo ? empleado.puestoInfo.nombre : 'No asignado',
          departamento: empleado.deptInfo ? empleado.deptInfo.nombre : 'Sin Área',
          telefono: empleado.telefono || 'Sin Teléfono',
          pais: empleado.pais || 'No especificado',
          remoto: empleado.remoto || false,
          estado: empleado.estado || 'Activo'
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