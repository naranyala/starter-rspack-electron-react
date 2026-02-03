import { contextBridge, ipcRenderer } from 'electron';

// Define types for our API
export type ElectronAPI = {
  setTitle: (title: string) => Promise<void>;
  // Add more API methods as needed
};

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example API methods - add your own as needed
  setTitle: (title: string) => ipcRenderer.invoke('set-title', title),

  // You can add more API methods here as needed
  // For example:
  // on: (channel, listener) => ipcRenderer.on(channel, (event, ...args) => listener(...args)),
  // once: (channel, listener) => ipcRenderer.once(channel, (event, ...args) => listener(...args)),
} satisfies ElectronAPI);