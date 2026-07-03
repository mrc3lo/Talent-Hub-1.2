import { ipcMain } from 'electron';

export function setupCandidateIPC() {
  // Canal para obtener todos los candidatos
  ipcMain.handle('candidate:getAll', async (event) => {
    try {
      return [
        { id: 1, nombre: "Ana Pérez", puesto: "Desarrollador", estado: "entrevista" },
        { id: 2, nombre: "Luis Gómez", puesto: "Diseñador", estado: "postulado" }
      ];
    } catch (error) {
      console.error("Error obteniendo candidatos:", error);
      return [];
    }
  });

  // Canal para actualizar la columna (estado)
  ipcMain.handle('candidate:updateStatus', async (event, { id, newStatus }) => {
    try {
      console.log(`Actualizando candidato ${id} a estado: ${newStatus}`);
      return { success: true };
    } catch (error) {
      console.error("Error actualizando estado:", error);
      return { success: false };
    }
  });
}