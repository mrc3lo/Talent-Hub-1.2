export const candidateService = {
  
  // Obtener todos los candidatos
  getAll: async () => {
    try {
      const candidatos = await window.api.candidate.getAll();
      return candidatos;
    } catch (error) {
      console.error("Error al obtener candidatos en el service:", error);
      throw error;
    }
  },

  // Avisar que movimos la tarjeta de columna
  updateStatus: async (candidateId, newStatus) => {
    try {
      const result = await window.api.candidate.updateStatus({ id: candidateId, newStatus });
      return result;
    } catch (error) {
      console.error("Error al actualizar el estado del candidato:", error);
      throw error;
    }
  },

  // Guardar un nuevo postulante
  create: async (candidateData) => {
    try {
      const result = await window.api.candidate.create(candidateData);
      return result;
    } catch (error) {
      console.error("Error al crear el candidato:", error);
      throw error;
    }
  }
};