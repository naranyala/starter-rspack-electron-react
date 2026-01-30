const { spawn, exec } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

/**
 * Development runner with proper process management and error handling
 */
class DevRunner {
  constructor() {
    this.config = {
      devServerPort: 1234,
      mainFile: './main.cjs',
      retries: 3,
      retryDelay: 2000,
      startupDelay: 5000,
    };

    this.processes = new Map();
    this.isShuttingDown = false;
  }

  /**
   * Logs messages with timestamp and level
   */
  log(level, message, data = null) {
    const timestamp = new Date().toISOString().substring(11, 19);
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (level === 'error') {
      console.error(`${prefix} ${message}`, data || '');
    } else if (level === 'warn') {
      console.warn(`${prefix} ${message}`, data || '');
    } else {
      console.log(`${prefix} ${message}`, data || '');
    }
  }

  /**
   * Checks if a port is available
   */
  async checkPortAvailable(port) {
    return new Promise((resolve) => {
      const server = http.createServer();

      server.listen(port, () => {
        server.close(() => resolve(true));
      });

      server.on('error', () => resolve(false));
    });
  }

  /**
   * Spawns a child process with proper error handling
   */
  spawnProcess(name, command, args, options = {}) {
    return new Promise((resolve, reject) => {
      this.log('info', `Starting ${name}: ${command} ${args.join(' ')}`);

      const childProcess = spawn(command, args, {
        stdio: ['inherit', 'pipe', 'pipe'],
        cwd: process.cwd(),
        ...options,
      });

      let stdout = '';
      let stderr = '';

      childProcess.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        if (options.verbose) {
          process.stdout.write(output);
        }
      });

      childProcess.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        process.stderr.write(`[${name}] ${output}`);
      });

      childProcess.on('error', (error) => {
        this.log('error', `${name} process error`, error);
        reject(error);
      });

      childProcess.on('close', (code, signal) => {
        this.log('info', `${name} process exited with code ${code}, signal ${signal}`);

        if (code !== 0 && !this.isShuttingDown) {
          reject(new Error(`${name} failed with exit code ${code}`));
        } else {
          resolve({ code, signal, stdout, stderr });
        }
      });

      this.processes.set(name, childProcess);
    });
  }

  /**
   * Starts development server
   */
  async startDevServer() {
    const port = this.config.devServerPort;

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        // Start dev server process (don't wait for it in promise)
        this.spawnProcess('dev-server', 'bunx', ['@rspack/cli', 'serve', `--port=${port}`]);

        this.log(
          'info',
          `Waiting ${this.config.startupDelay / 1000}s for dev server to start (attempt ${attempt}/${this.config.retries})`
        );

        // Wait for startup with simple delay and port check
        await new Promise((resolve) => setTimeout(resolve, this.config.startupDelay));

        const portInUse = !(await this.checkPortAvailable(port)); // Port is in use if NOT available
        if (portInUse) {
          this.log('success', `✅ Development server started successfully on port ${port}`);
          return true;
        } else {
          throw new Error('Server port still available after startup delay - server may not have started properly');
        }
      } catch (error) {
        this.log(
          'error',
          `Dev server startup failed (attempt ${attempt}/${this.config.retries})`,
          error
        );

        if (attempt < this.config.retries) {
          this.log('info', `Retrying in ${this.config.retryDelay}ms...`);

          // Kill any existing process
          if (this.processes.has('dev-server')) {
            this.processes.get('dev-server').kill();
            this.processes.delete('dev-server');
          }

          await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay));
        } else {
          throw error;
        }
      }
    }
  }

  /**
   * Starts Electron application
   */
  async startElectron() {
    try {
      // Check if main file exists
      if (!fs.existsSync(this.config.mainFile)) {
        throw new Error(`Main file not found: ${this.config.mainFile}`);
      }

      await this.spawnProcess('electron', 'bunx', ['electron', this.config.mainFile, '--start-dev'], {
        verbose: false, // Electron output is noisy in dev mode
      });

      this.log('success', '✅ Electron application started');
      return true;
    } catch (error) {
      this.log('error', 'Failed to start Electron', error);
      throw error;
    }
  }

  /**
   * Gracefully shuts down all processes
   */
  async shutdown() {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    this.log('info', '🛑 Shutting down development environment...');

    const shutdownPromises = [];

    this.processes.forEach((childProcess, name) => {
      if (!childProcess.killed) {
        this.log('info', `Stopping ${name}...`);

        // Try graceful shutdown first
        childProcess.kill('SIGTERM');

        // Force kill after timeout
        const forceKill = setTimeout(() => {
          if (!childProcess.killed) {
            this.log('warn', `Force killing ${name}...`);
            childProcess.kill('SIGKILL');
          }
        }, 5000);

        shutdownPromises.push(
          new Promise((resolve) => {
            childProcess.on('close', () => {
              clearTimeout(forceKill);
              resolve();
            });
          })
        );
      }
    });

    await Promise.all(shutdownPromises);
    this.log('info', '✅ All processes stopped');

    process.exit(0);
  }

  /**
   * Main development workflow
   */
  async run() {
    this.log('info', '🚀 Starting Electron development environment...');

    // Setup cleanup handlers
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
    process.on('uncaughtException', (error) => {
      this.log('error', 'Uncaught exception', error);
      this.shutdown();
    });
    process.on('unhandledRejection', (reason, promise) => {
      this.log('error', 'Unhandled rejection at:', promise, 'reason:', reason);
      this.shutdown();
    });

    try {
      // Start dev server first
      await this.startDevServer();

      // Small delay to ensure server is fully ready
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Start Electron
      await this.startElectron();

      this.log('success', '✨ Development environment is ready!');
      this.log('info', '📱 Dev server: http://localhost:' + this.config.devServerPort);
      this.log('info', '⌨️  Press Ctrl+C to stop');
    } catch (error) {
      this.log('error', '❌ Failed to start development environment', error);
      await this.shutdown();
    }
  }
}

// Run development server
if (require.main === module) {
  const runner = new DevRunner();
  runner.run().catch(console.error);
}

module.exports = DevRunner;
