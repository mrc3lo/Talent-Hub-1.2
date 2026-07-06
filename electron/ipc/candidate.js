import { ipcMain } from 'electron';
import { ObjectId } from 'mongodb';
// Aquí asumo que tienen un archivo que exporta la conexión a la base de datos
// Ajusta la ruta de 'getDb' según cómo lo tengan configurado en tu equipo
import { getDb } from '../db.js'; 

export function setupCandidateIPC() {
  
  // Canal para obtener todos los candidatos, ahora desde Mongo
  ipcMain.handle('candidate:getAll', async (event) => {
    try {
      const db = getDb();
      // Buscamos en la colección que nos toca en el Dominio 2
      const candidatos = await db.collection('candidatos').find({}).toArray();

      // Mapeamos los datos porque el _id de Mongo es un objeto y React necesita un string
      return candidatos.map(candidato => ({
        ...candidato,
        _id: candidato._id.toString(),
        id: candidato._id.toString() // Dejamos ambos por si React usa uno u otro en el Kanban
      }));
    } catch (error) {
      console.error("Error obteniendo candidatos desde Mongo:", error);
      return [];
    }
  });

// Canal para guardar un nuevo candidato
  ipcMain.handle('candidate:create', async (event, candidateData) => {
    try {
      const db = getDb();
      console.log("Guardando nuevo candidato:", candidateData);
      
      // Insertamos el documento. Por defecto entrará a la columna de "Nuevas Postulaciones"
      const resultado = await db.collection('candidatos').insertOne({
        nombre: candidateData.nombre,
        puesto: candidateData.puesto,
        estado: 'postulado' // Todas las postulaciones nuevas entran en esta columna
      });
      
      return { 
        success: true, 
        id: resultado.insertedId.toString() 
      };
    } catch (error) {
      console.error("Error al crear candidato en Mongo:", error);
      return { success: false };
    }
  });
}