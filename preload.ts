import { contextBridge, ipcRenderer } from 'electron';

// Define types for our API
export type ElectronAPI = {
  // Example API methods can be added here
};

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example API methods can be added here
} as ElectronAPI);

