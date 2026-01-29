const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// Detect development mode: true if running with a dev server, false otherwise
// We'll check if we're explicitly told to run in dev mode via command line args
const args = process.argv.slice(1);
const isDevModeArg = args.some(arg => arg === '--dev' || arg === '--start-dev');
const isDev = isDevModeArg || !app.isPackaged && process.env.NODE_ENV !== 'production';

let mainWindow;

function createWindow() {
  const options = {
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  };

  // Set icon path based on environment
  if (isDev) {
    options.icon = path.join(__dirname, 'src/assets/icon.png');
  } else {
    // In production, icon should be in the resources folder
    options.icon = path.join(process.resourcesPath, 'icon.png');
  }

  mainWindow = new BrowserWindow(options);

  // Load the appropriate URL based on environment
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000'); // Updated to new dev port
  } else {
    // In production build, the HTML file is in the dist directory relative to main.js
    mainWindow.loadURL(`file://${path.join(__dirname, 'dist/index.html')}`);
  }

  // Comment out automatic DevTools opening in development mode
  // if (isDev) {
  //   mainWindow.webContents.openDevTools();
  // }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle app startup
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});