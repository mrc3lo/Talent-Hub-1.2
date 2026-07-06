export const countryService = {
  getAllCountries: async () => {
    try {
      return await window.api.payroll.getCountries();
    } catch (error) {
      console.error("Error al obtener países:", error);
      return [] ;
    }
  }
};