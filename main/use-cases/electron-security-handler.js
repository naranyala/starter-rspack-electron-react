// Backend use case for Electron security functionality
const { ipcMain } = require('electron');

const registerElectronSecurityHandlers = () => {
  // Register IPC handlers for Electron security related functionality
  ipcMain.handle('get-electron-security-info', async () => {
    return {
      title: 'Electron Security Best Practices',
      content: 'Security is crucial in Electron applications. Important practices include: enabling context isolation, disabling nodeIntegration when possible.',
      category: 'security',
      tags: ['security', 'context-isolation', 'csp', 'best-practices']
    };
  });

  // Additional handlers can be added here
};

module.exports = { registerElectronSecurityHandlers };