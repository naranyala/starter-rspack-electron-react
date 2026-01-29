// Preload script for Electron
// This script runs in a privileged context and can access Node.js APIs
// It exposes only the necessary APIs to the renderer process

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example API methods - add your own as needed
  setTitle: (title) => ipcRenderer.invoke('set-title', title),
  
  // You can add more API methods here as needed
  // For example:
  // on: (channel, listener) => ipcRenderer.on(channel, (event, ...args) => listener(...args)),
  // once: (channel, listener) => ipcRenderer.once(channel, (event, ...args) => listener(...args)),
});