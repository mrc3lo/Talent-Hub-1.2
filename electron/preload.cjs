console.log("--- El preload.cjs se ha cargado correctamente ---");

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  employee: {
    getAll: (args) => ipcRenderer.invoke('employee:getAll', args),
    getById: (id) => ipcRenderer.invoke('employee:getById', id),
    search: (criteria) => ipcRenderer.invoke('employee:search', criteria)
  },
  payroll: {
    getAll: () => ipcRenderer.invoke('nomina:getAll'),
    filter: (criteria) => ipcRenderer.invoke('nomina:filter', criteria),
    getCountries: () => ipcRenderer.invoke('nomina:getCountries'),
    create: (nominaData) => ipcRenderer.invoke('nomina:create', nominaData) // <- Con esta línea solucionamos el error de guardado
  }
});