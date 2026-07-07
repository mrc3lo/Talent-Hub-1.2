const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // (Dominio 1)
  employee: {
    getAll: (args) => ipcRenderer.invoke('employee:getAll', args),
    getById: (id) => ipcRenderer.invoke('employee:getById', id),
    search: (criteria) => ipcRenderer.invoke('employee:search', criteria)
  },
  
  // (Dominio 2)
  candidate: {
    getAll: () => ipcRenderer.invoke('candidate:getAll'),
    updateStatus: (data) => ipcRenderer.invoke('candidate:updateStatus', data),
    create: (data) => ipcRenderer.invoke('candidate:create', data) // <-- Nueva ruta agregada
<<<<<<< Updated upstream
=======
  },
  payroll: {
    getAll: () => ipcRenderer.invoke('nomina:getAll'),
    filter: (criteria) => ipcRenderer.invoke('nomina:filter', criteria),
    getCountries: () => ipcRenderer.invoke('nomina:getCountries'),
    create: (nominaData) => ipcRenderer.invoke('nomina:create', nominaData) // <- Con esta línea solucionamos el error de guardado
>>>>>>> Stashed changes
  }
});