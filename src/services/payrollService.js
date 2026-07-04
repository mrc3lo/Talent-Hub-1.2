// src/services/payrollService.js
export const payrollService = {
  // Obtener todas las nóminas
  getAll: async () => {
    return await window.electronAPI.invoke('payroll:getAll');
  },
  // Filtrar nóminas (por ejemplo, por nombre o fecha)
  filter: async (criteria) => {
    return await window.electronAPI.invoke('payroll:filter', criteria);
  }
};