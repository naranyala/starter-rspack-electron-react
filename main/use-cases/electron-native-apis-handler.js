// Backend use case for Electron native APIs functionality
const { ipcMain } = require('electron');

const registerElectronNativeApisHandlers = () => {
  // Register IPC handlers for Electron native APIs related functionality
  ipcMain.handle('get-electron-native-apis-info', async () => {
    return {
      title: 'Native Operating System APIs',
      content: 'Electron provides access to native OS features through its APIs: file system operations, dialog boxes, notifications, tray icons, clipboard, and more.',
      category: 'api',
      tags: ['native-api', 'file-system', 'notifications', 'dialogs']
    };
  });

  // Additional handlers can be added here
};

module.exports = { registerElectronNativeApisHandlers };