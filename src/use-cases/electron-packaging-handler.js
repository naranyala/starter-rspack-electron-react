// Backend use case for Electron packaging functionality
const { ipcMain } = require('electron');

const registerElectronPackagingHandlers = () => {
  // Register IPC handlers for Electron packaging related functionality
  ipcMain.handle('get-electron-packaging-info', async () => {
    return {
      title: 'Packaging and Distribution',
      content: 'Electron applications can be packaged for distribution using tools like electron-builder, electron-forge, or electron-packager.',
      category: 'packaging',
      tags: ['packaging', 'distribution', 'electron-builder', 'installer']
    };
  });

  // Additional handlers can be added here
};

module.exports = { registerElectronPackagingHandlers };