const { contextBridge, ipcRenderer } = require('electron');

// Exponemos un objeto global en el navegador llamado "api"
contextBridge.exposeInMainWorld('api', {
  // El Integrante A usará esto en su employeeService
  employee: {
    getAll: (args) => ipcRenderer.invoke('employee:getAll', args),
    getById: (id) => ipcRenderer.invoke('employee:getById', id),
    search: (criteria) => ipcRenderer.invoke('employee:search', criteria)
  },
  // Tus compañeros agregarán aquí sus respectivos canales (auth, candidate, payroll)
});