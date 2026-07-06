console.log("--- El preload.cjs se ha cargado correctamente ---");

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // (Dominio 1)
  employee: {
    getAll: (args) => ipcRenderer.invoke('employee:getAll', args),
    getById: (id) => ipcRenderer.invoke('employee:getById', id),
    search: (criteria) => ipcRenderer.invoke('employee:search', criteria),
    getProfileData: (id) => ipcRenderer.invoke('employee:getProfileData', id)
  },

  // (Dominio 2)
  candidate: {
    getAll: () => ipcRenderer.invoke('candidate:getAll'),
    updateStatus: (data) => ipcRenderer.invoke('candidate:updateStatus', data),
    create: (data) => ipcRenderer.invoke('candidate:create', data)
  },

  payroll: {
    getAll: () => ipcRenderer.invoke('nomina:getAll'),
    filter: (criteria) => ipcRenderer.invoke('nomina:filter', criteria),
    getCountries: () => ipcRenderer.invoke('nomina:getCountries'),
    create: (nominaData) => ipcRenderer.invoke('nomina:create', nominaData)
  },

  // SECCIÓN AGREGADA: Métodos genéricos que requiere el formulario de Login/Registro
  invoke: (channel, data) => {
    return ipcRenderer.invoke(channel, data);
  }
});