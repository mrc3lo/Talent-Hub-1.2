// Este servicio consume el puente que expuso el preload.js
export const employeeService = {
  getAll: async () => {
    try {
      // Llamamos directamente al puente seguro expuesto en window.api
      return await window.api.employee.getAll();
    } catch (error) {
      console.error("Error en employeeService.getAll:", error);
      throw error;
    }
  }
};