console.log("--- El preload.cjs se ha cargado correctamente ---");

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // (Dominio 1)
  employee: {
    getAll: (args) => ipcRenderer.invoke('employee:getAll', args),
    getById: (id) => ipcRenderer.invoke('employee:getById', id),
    search: (criteria) => ipcRenderer.invoke('employee:search', criteria),
    getProfileData: (id) => ipcRenderer.invoke('employee:getProfileData', id) // ← Canal para el expediente completo conectado a Mongo
  },
  
  // (Dominio 2)
  candidate: {
    getAll: () => ipcRenderer.invoke('candidate:getAll'),
    updateStatus: (data) => ipcRenderer.invoke('candidate:updateStatus', data),
    create: (data) => ipcRenderer.invoke('candidate:create', data) // <-- Nueva ruta agregada
  },

  // (Dominio 3)
  payroll: {
    getAll: () => ipcRenderer.invoke('nomina:getAll'),
    filter: (criteria) => ipcRenderer.invoke('nomina:filter', criteria),
    getCountries: () => ipcRenderer.invoke('nomina:getCountries'),
    create: (nominaData) => ipcRenderer.invoke('nomina:create', nominaData) // <- Con esta línea solucionamos el error de guardado
  }
});