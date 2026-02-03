#!/usr/bin/env node

import { spawn, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Checks if electron is properly installed
 */
function isElectronInstalled(): boolean {
  try {
    // Try to require electron
    const electronPath = path.join(__dirname, '../node_modules/electron');
    if (!fs.existsSync(electronPath)) {
      console.log('Electron not found in node_modules');
      return false;
    }

    // Check if electron binary exists
    const electronBinPath = path.join(electronPath, 'dist');
    if (!fs.existsSync(electronBinPath)) {
      console.log('Electron binary not found in node_modules/electron/dist');
      return false;
    }

    // Try to get electron executable
    const electronExecutable = path.join(__dirname, '../node_modules/.bin/electron');
    const electronExecutableWin = path.join(__dirname, '../node_modules/.bin/electron.cmd');

    if (process.platform === 'win32') {
      if (!fs.existsSync(electronExecutableWin)) {
        console.log('Electron executable not found (.cmd)');
        return false;
      }
    } else {
      if (!fs.existsSync(electronExecutable)) {
        console.log('Electron executable not found');
        return false;
      }
    }

    // Try to get electron version
    const electron = require('electron');
    console.log('Electron is installed and accessible');
    return true;
  } catch (error: any) {
    console.log(`Electron installation check failed: ${error.message}`);
    return false;
  }
}

/**
 * Attempts to install electron
 */
async function installElectron(): Promise<boolean> {
  console.log('Installing Electron...');

  try {
    // First, completely remove electron and reinstall
    console.log('Performing clean Electron installation...');
    execSync('rm -rf node_modules/electron && bun install', { stdio: 'inherit', cwd: process.cwd() });

    console.log('Electron reinstalled successfully via bun install');

    // Run the electron install script to download the binary
    console.log('Downloading Electron binary...');
    const installResult = spawn('node', ['./node_modules/electron/install.js'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    return new Promise((resolve, reject) => {
      installResult.on('close', (code: number) => {
        if (code === 0) {
          console.log('Electron binary downloaded successfully');
          resolve(true);
        } else {
          console.error(`Electron binary download failed with code ${code}`);
          reject(new Error(`Electron binary download failed with code ${code}`));
        }
      });

      installResult.on('error', (err: Error) => {
        console.error('Error downloading Electron binary:', err.message);
        reject(err);
      });
    });
  } catch (error: any) {
    console.error('Error performing clean Electron installation:', error.message);

    // If bun install fails, try manual installation
    try {
      console.log('Trying manual installation...');
      execSync('rm -rf node_modules/electron && bun add -D electron', { stdio: 'inherit', cwd: process.cwd() });

      console.log('Electron installed successfully via bun add');

      // Run the electron install script to download the binary
      console.log('Downloading Electron binary...');
      const installResult = spawn('node', ['./node_modules/electron/install.js'], {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      return new Promise((resolve, reject) => {
        installResult.on('close', (code: number) => {
          if (code === 0) {
            console.log('Electron binary downloaded successfully');
            resolve(true);
          } else {
            console.error(`Electron binary download failed with code ${code}`);
            reject(new Error(`Electron binary download failed with code ${code}`));
          }
        });

        installResult.on('error', (err: Error) => {
          console.error('Error downloading Electron binary:', err.message);
          reject(err);
        });
      });
    } catch (manualError: any) {
      console.error('Manual installation also failed:', manualError.message);
      throw new Error(`Both clean install and manual install failed. Clean install error: ${error.message}, Manual install error: ${manualError.message}`);
    }
  }
}

/**
 * Runs the electron application using the most reliable method available
 */
async function runElectron(args: string[] = []): Promise<number> {
  return new Promise((resolve, reject) => {
    console.log('Starting Electron application...');

    const mainJsPath = path.join(__dirname, '../main.cjs');

    // Method 1: Direct executable (most common)
    const electronPath = path.join(__dirname, '../node_modules/.bin/electron');
    const cmdPath = process.platform === 'win32' ? `${electronPath}.cmd` : electronPath;

    if (fs.existsSync(cmdPath)) {
      console.log('Using direct executable method');
      const electronProcess = spawn(cmdPath, [mainJsPath, ...args], {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { ...process.env }
      });

      electronProcess.on('close', (code: number) => {
        console.log(`Electron application exited with code ${code}`);
        resolve(code);
      });

      electronProcess.on('error', (err: Error) => {
        console.error('Error running Electron with direct executable:', err.message);
        reject(err);
      });
      return;
    }

    // Method 2: Using bunx as fallback
    console.log('Direct executable not found, trying bunx fallback');
    const electronProcess = spawn('bunx', ['electron', mainJsPath, ...args], {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env }
    });

    electronProcess.on('close', (code: number) => {
      console.log(`Electron application exited with code ${code}`);
      resolve(code);
    });

    electronProcess.on('error', (err: Error) => {
      console.error('Error running Electron with bunx:', err.message);
      // Try npx as final fallback
      console.log('Trying npx as final fallback...');
      const npxProcess = spawn('npx', ['electron', mainJsPath, ...args], {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { ...process.env }
      });

      npxProcess.on('close', (code: number) => {
        console.log(`Electron application (via npx) exited with code ${code}`);
        resolve(code);
      });

      npxProcess.on('error', (err2: Error) => {
        console.error('Error running Electron with npx:', err2.message);

        // If all methods fail, suggest manual installation
        console.log('\n--- INSTALLATION TROUBLESHOOTING ---');
        console.log('All automatic methods to run Electron have failed.');
        console.log('\nTry these manual steps:');
        console.log('1. Clean install: rm -rf node_modules/electron && bun install');
        console.log('2. Or: bun remove electron && bun add -D electron');
        console.log('3. Then: node ./node_modules/electron/install.js');
        console.log('4. Finally: bun run start');

        reject(new Error(`All methods to run Electron failed: direct (${err.message}), bunx (${err.message}), npx (${err2.message})`));
      });
    });
  });
}

/**
 * Main function to handle electron startup with installation fallback
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2); // Get command line arguments after script name

  console.log('Electron Launcher starting...');
  console.log('Checking Electron installation...');

  // Check if electron is properly installed
  if (!isElectronInstalled()) {
    console.log('Electron is not properly installed. Attempting to install...');

    try {
      await installElectron();
      console.log('Electron installation completed successfully');
    } catch (error: any) {
      console.error('Failed to install Electron:', error.message);
      console.log('\nPlease try installing Electron manually:');
      console.log('  bun add -D electron');
      console.log('  # OR');
      console.log('  npm install --save-dev electron');
      console.log('\nThen run:');
      console.log('  node ./node_modules/electron/install.js');
      process.exit(1);
    }
  } else {
    console.log('Electron is already properly installed');
  }

  // Now run the electron application
  try {
    const exitCode = await runElectron(args);
    process.exit(exitCode);
  } catch (error: any) {
    console.error('Failed to run Electron:', error.message);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error('Launcher error:', error.message);
    process.exit(1);
  });
}

export {
  isElectronInstalled,
  installElectron,
  runElectron,
  main
};