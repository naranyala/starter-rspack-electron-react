// Backend use case for Electron intro functionality
import { ipcMain } from 'electron';

const registerElectronIntroHandlers = (): void => {
  // Register IPC handlers for Electron intro related functionality
  ipcMain.handle('get-electron-intro-info', async () => {
    return {
      title: 'What is Electron?',
      content: 'Electron is a framework for building cross-platform desktop applications using web technologies like HTML, CSS, and JavaScript.',
      category: 'framework',
      tags: ['electron', 'desktop', 'chromium', 'nodejs', 'cross-platform']
    };
  });

  // Additional handlers can be added here
};

export { registerElectronIntroHandlers };