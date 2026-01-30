// Main process for Electron application
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const args = process.argv.slice(1);
const serve = args.some(val => val === '--start-dev');

// Import configuration from src
const { appConfig, mainMenuConfig } = require('./src/main/config.js');

// Import backend use-case handlers
const {
  registerElectronIntroHandlers,
  registerElectronArchitectureHandlers,
  registerElectronSecurityHandlers,
  registerElectronPackagingHandlers,
  registerElectronNativeApisHandlers,
  registerElectronPerformanceHandlers,
  registerElectronDevelopmentHandlers,
  registerElectronVersionsHandlers
} = require('./main/use-cases');

// Enable live reload for development
// Temporarily disabled to prevent multiple windows during development
// if (serve) {
//   require('electron-reload')(path.join(__dirname, 'src'), {
//     electron: require(`${__dirname}/node_modules/.bin/electron`),
//     hardResetMethod: 'exit',
//     watchRenderer: false // Don't watch renderer files as dev server handles HMR
//   });
// }

let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling
try {
  if (require('electron-squirrel-startup')) {
    app.quit();
  }
} catch (error) {
  console.warn('electron-squirrel-startup not available:', error.message);
  // Continue normal app startup if electron-squirrel-startup is not available
}

const createWindow = () => {
  // Determine icon path based on serve mode
  let iconPath;
  if (serve) {
    // In development, use the source icon
    iconPath = path.join(__dirname, 'src/assets/icon.png');
  } else {
    // In production, the icon will be placed in the same directory as main.cjs by electron-builder
    // The build process copies the icon to dist/, and electron-builder moves it to the right place
    iconPath = path.join(__dirname, 'icon.png');

    // Fallback to the dist location if the direct icon doesn't exist
    if (!fs.existsSync(iconPath)) {
      iconPath = path.join(__dirname, 'dist/icon.png');
    }

    // Final fallback to the source location if neither exists
    if (!fs.existsSync(iconPath)) {
      iconPath = path.join(__dirname, 'src/assets/icon.png');
    }
  }

  mainWindow = new BrowserWindow({
    width: appConfig.mainWindow.width,
    height: appConfig.mainWindow.height,
    minWidth: appConfig.mainWindow.minWidth,
    minHeight: appConfig.mainWindow.minHeight,
    webPreferences: appConfig.mainWindow.webPreferences,
    icon: iconPath // Set app icon
  });

  // Load the appropriate URL based on environment
  const devUrl = process.env.ELECTRON_START_URL || 'http://localhost:1234';
  const startUrl = serve
    ? devUrl
    : url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      });

  mainWindow.loadURL(startUrl);

  // Configure menu
  const menu = Menu.buildFromTemplate([
    mainMenuConfig.fileMenu,
    mainMenuConfig.viewMenu,
    // Add more menu items as needed
  ]);
  Menu.setApplicationMenu(menu);

  // Open DevTools conditionally (not by default)
  // DevTools will only open if explicitly requested via keyboard shortcut
  mainWindow.webContents.on('did-finish-load', () => {
    // Optionally enable devtools for debugging when needed
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  });

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Flag to track if the app is fully initialized
let isAppInitialized = false;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Register all use-case handlers
  registerElectronIntroHandlers();
  registerElectronArchitectureHandlers();
  registerElectronSecurityHandlers();
  registerElectronPackagingHandlers();
  registerElectronNativeApisHandlers();
  registerElectronPerformanceHandlers();
  registerElectronDevelopmentHandlers();
  registerElectronVersionsHandlers();

  createWindow();
  isAppInitialized = true;

  // On macOS it's common to re-create a window in the app when the dock icon is clicked
  // and there are no other windows open.
  app.on('activate', () => {
    // Only create new window if the app is initialized and no windows exist
    if (isAppInitialized && BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. On macOS it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
