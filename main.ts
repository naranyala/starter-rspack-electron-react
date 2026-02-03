import { app, BrowserWindow, IpcMainInvokeEvent, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import {
  registerElectronArchitectureHandlers,
  registerElectronDevelopmentHandlers,
  registerElectronIntroHandlers,
  registerElectronNativeApisHandlers,
  registerElectronPackagingHandlers,
  registerElectronPerformanceHandlers,
  registerElectronSecurityHandlers,
  registerElectronVersionsHandlers,
} from './src/backend/use-cases';

// Define types for our application
type WindowState = {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  webPreferences: {
    nodeIntegration: boolean;
    contextIsolation: boolean;
    preload: string;
  };
};

// Detect development mode: true if running with a dev server, false otherwise
// We'll check if we're explicitly told to run in dev mode via command line args
const args = process.argv.slice(1);
const isDevModeArg = args.some((arg) => arg === '--dev' || arg === '--start-dev');
const isDev = isDevModeArg || (!app.isPackaged && process.env.NODE_ENV !== 'production');

let mainWindow: BrowserWindow | null;

// Get the development server port
function getDevPort(): number {
  // First try environment variable (set by dev-runner.js)
  if (process.env.DEV_SERVER_PORT) {
    return parseInt(process.env.DEV_SERVER_PORT, 10);
  }

  // Then try config file
  try {
    const configPath = path.join(__dirname, '.dev-port.json');
    if (fs.existsSync(configPath)) {
      const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (data.port) return data.port;
    }
  } catch (e) {
    // Ignore errors
  }

  // Default fallback
  return 3000;
}

function createWindow(): void {
  const options: WindowState = {
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
    options.webPreferences.preload = path.join(__dirname, 'preload.js');
    // In development, icon should be in the project root assets folder
    (options as any).icon = path.join(__dirname, '../src/assets/icon.png');
  } else {
    // In production, icon should be in the resources folder
    (options as any).icon = path.join(process.resourcesPath, 'icon.png');
  }

  mainWindow = new BrowserWindow(options);

  // Load the appropriate URL based on environment
  if (isDev) {
    const devPort = getDevPort();
    mainWindow.loadURL(`http://localhost:${devPort}`);
    console.log(`[Main] Loading dev server from port: ${devPort}`);
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
  // Register all IPC handlers
  registerElectronIntroHandlers();
  registerElectronArchitectureHandlers();
  registerElectronSecurityHandlers();
  registerElectronPackagingHandlers();
  registerElectronNativeApisHandlers();
  registerElectronPerformanceHandlers();
  registerElectronDevelopmentHandlers();
  registerElectronVersionsHandlers();

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
