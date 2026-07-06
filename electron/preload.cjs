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
  }
});