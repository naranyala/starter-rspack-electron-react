const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Try to get a port utility, with fallback
let getPort;
try {
  const getPortModule = require('get-port');
  getPort = typeof getPortModule === 'function' ? getPortModule : getPortModule.default;
} catch (error) {
  console.warn('get-port not available, using default port 3000');
  getPort = async () => 3000; // fallback to default port
}

async function checkElectronAvailability() {
  const { spawnSync } = require('child_process');

  // Check if electron is in node_modules first
  try {
    const fs = require('fs');
    const electronPath = path.join(process.cwd(), 'node_modules', 'electron');
    if (fs.existsSync(electronPath)) {
      // Try a simple test to see if electron can be loaded
      const result = spawnSync('node', ['-e', 'try { const electron = require("electron"); console.log("loaded"); } catch(e) { console.error(e.message); }'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'], // capture all output
        env: { ...process.env }
      });

      const output = result.stdout.toString() + result.stderr.toString();
      if (output.includes('loaded')) {
        return { available: true, method: 'local' };
      }
    }
  } catch (e) {
    // Local electron not available
  }

  // If local didn't work, try bunx as fallback
  try {
    // Test if bunx is available first
    const bunxTest = spawnSync('bunx', ['--version'], {
      stdio: 'pipe',
      timeout: 5000
    });

    if (bunxTest.status === 0) {
      // Bunx is available, try electron via bunx
      const electronCheck = spawnSync('bunx', ['electron', '--help'], {
        stdio: 'pipe',
        timeout: 10000
      });

      if (electronCheck.status === 0) {
        return { available: true, method: 'bunx' };
      }
    }
  } catch (e) {
    // Bunx not available or electron not accessible
  }

  return { available: false, method: null };
}

async function installElectronIfNeeded() {
  console.log('Attempting to install Electron...');

  try {
    const { spawnSync } = require('child_process');

    // Try to install electron
    const installResult = spawnSync('bun', ['add', '-D', 'electron'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    if (installResult.status !== 0) {
      console.error('Failed to install Electron via bun.');
      return false;
    }

    // Run postinstall
    const postInstallResult = spawnSync('bun', ['run', 'electron-postinstall'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    if (postInstallResult.status !== 0) {
      console.error('Electron postinstall failed. This might be due to network restrictions.');
      console.log('Please run: bun run electron-postinstall manually when online.');
      return false;
    }

    console.log('Electron installed successfully!');
    return true;
  } catch (error) {
    console.error('Error installing Electron:', error.message);
    return false;
  }
}

async function startDevServer() {
  try {
    // Get a port (fallback to 3000 if get-port fails)
    let port;
    try {
      port = await getPort();
    } catch (error) {
      console.warn('Could not get available port, using default 3000');
      port = 3000;
    }

    console.log(`Using port: ${port}`);
    process.env.ELECTRON_START_URL = `http://localhost:${port}`;

    // Start Rspack server first
    console.log(`Starting Rspack development server on port ${port}...`);
    const rspackProcess = spawn('bunx', ['@rspack/cli@latest', 'serve', '--port', port], {
      stdio: 'pipe', // Change to pipe so we can monitor output
      env: { ...process.env },
    });

    // Listen to rspack output to detect when compilation is done
    rspackProcess.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(output); // Forward the output

      // Check if compilation is successful
      if (output.includes('compiled successfully')) {
        console.log('Rspack compilation successful, waiting for server to be ready...');

        // Wait a bit more for the server to be fully ready
        setTimeout(async () => {
          try {
            // Use wait-on to ensure the server is responding
            const waitOn = require('wait-on');
            const opts = {
              resources: [`http://localhost:${port}`],
              timeout: 30000, // 30 seconds timeout
              interval: 1000, // check every second
              window: 2000,   // require resources to stay up for 2 seconds
            };

            console.log(`Waiting for server at http://localhost:${port} to be ready...`);
            await waitOn(opts);
            console.log('Server is ready, starting Electron app...');

            // Launch electron using our launcher
            const electronProcess = spawn('node', ['scripts/electron-launcher.js', '--start-dev'], {
              stdio: 'inherit',
              env: { ...process.env, ELECTRON_START_URL: `http://localhost:${port}` },
            });

            electronProcess.on('close', (code) => {
              console.log(`Electron process exited with code ${code}`);
              if (!rspackProcess.killed) {
                rspackProcess.kill();
              }
            });

            electronProcess.on('error', (err) => {
              console.error('Electron process error:', err.message);
            });
          } catch (error) {
            console.error('Error waiting for server to be ready:', error.message);
            // Still try to start electron even if wait-on fails
            console.log('Starting Electron anyway...');
            const electronProcess = spawn('node', ['scripts/electron-launcher.js', '--start-dev'], {
              stdio: 'inherit',
              env: { ...process.env, ELECTRON_START_URL: `http://localhost:${port}` },
            });

            electronProcess.on('close', (code) => {
              console.log(`Electron process exited with code ${code}`);
              if (!rspackProcess.killed) {
                rspackProcess.kill();
              }
            });

            electronProcess.on('error', (err) => {
              console.error('Electron process error:', err.message);
            });
          }
        }, 2000); // Wait 2 more seconds after compilation
      }
    });

    rspackProcess.stderr.on('data', (data) => {
      process.stderr.write(data.toString()); // Forward error output
    });

    rspackProcess.on('close', (code) => {
      console.log(`Rspack process exited with code ${code}`);
    });

    rspackProcess.on('error', (err) => {
      console.error('Rspack process error:', err.message);
    });

  } catch (error) {
    console.error('Critical error starting dev server:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure you have bun installed: https://bun.sh/docs/installation');
    console.log('2. Check if port is available');
    console.log('3. Try running: bun install');
    console.log('4. For offline usage, ensure electron is pre-installed: bun add -D electron');
  }
}

startDevServer();