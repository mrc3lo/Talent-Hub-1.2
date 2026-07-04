export const payrollService = {
  getAllPayrolls: async () => {
    try {
      const response = await window.api.payroll.getAll();
      return response.success ? response.data : [];
    } catch (error) {
      console.error("Error en servicio getAllPayrolls:", error);
      return [];
    }
  },

  getNominaByCountry: async (countryCode) => {
    try {
      const response = await window.api.payroll.filter(countryCode);
      return response.success ? response.data : [];
    } catch (error) {
      console.error("Error en servicio getNominaByCountry:", error);
      return [];
    }
  },

  createNomina: async (nominaData) => {
    try {
      const response = await window.api.payroll.create(nominaData);
      return response; 
    } catch (error) {
      console.error("Error en servicio createNomina:", error);
      return { success: false, message: "Error de conexión." };
    }
  }
};