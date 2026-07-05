export const employeeService = {
  // 1. Obtener todos
  getAll: async () => {
    try {
      return await window.api.employee.getAll();
    } catch (error) {
      console.error("Error en servicio getAll:", error);
      return [];
    }
  },

  // 2. Buscar por nombre
  search: async (query) => {
    try {
      return await window.api.employee.search(query);
    } catch (error) {
      console.error("Error en servicio search:", error);
      return [];
    }
  },

  // 3. Obtener expediente de perfil
  getProfileData: async (id) => {
    try {
      // ¡Aquí está la clave! Se le envía el ID a Electron
      return await window.api.employee.getProfileData(id);
    } catch (error) {
      console.error("Error en servicio getProfileData:", error);
      return null;
    }
  }
};