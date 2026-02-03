import { exec, spawn } from 'child_process';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';

interface ProcessInfo {
  code: number | null;
  signal: string | null;
  stdout: string;
  stderr: string;
}

/**
 * Development runner with proper process management and error handling
 */
class DevRunner {
  private config: {
    devServerPort: number;
    mainFile: string;
    retries: number;
    retryDelay: number;
    startupDelay: number;
  };

  private processes: Map<string, any>;
  private isShuttingDown: boolean;
  private portConfigPath: string;

  constructor() {
    this.portConfigPath = path.join(process.cwd(), '.dev-port.json');

    // Get or generate random port
    const devServerPort = this.getOrCreatePort();

    this.config = {
      devServerPort,
      mainFile: './main.cjs',
      retries: 3,
      retryDelay: 2000,
      startupDelay: 5000,
    };

    this.processes = new Map();
    this.isShuttingDown = false;
  }

  /**
   * Gets an existing port from config or generates a new random one
   */
  private getOrCreatePort(): number {
    const minPort = 3000;
    const maxPort = 8999;

    try {
      // Try to read existing port config
      if (fs.existsSync(this.portConfigPath)) {
        const config = JSON.parse(fs.readFileSync(this.portConfigPath, 'utf8'));
        if (config.port && typeof config.port === 'number') {
          this.log('info', `Using existing dev server port: ${config.port}`);
          return config.port;
        }
      }
    } catch (error) {
      this.log('warn', 'Could not read port config file, generating new port');
    }

    // Generate random port
    const randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;

    // Save port config
    try {
      fs.writeFileSync(this.portConfigPath, JSON.stringify({ port: randomPort }, null, 2));
      this.log('success', `Generated and saved new dev server port: ${randomPort}`);
    } catch (error) {
      this.log('warn', 'Could not save port config file', error);
    }

    return randomPort;
  }

  /**
   * Logs messages with timestamp and level
   */
  log(level: 'info' | 'warn' | 'error' | 'success', message: string, data?: any): void {
    const timestamp = new Date().toISOString().substring(11, 19);
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (level === 'error') {
      console.error(`${prefix} ${message}`, data || '');
    } else if (level === 'warn') {
      console.warn(`${prefix} ${message}`, data || '');
    } else if (level === 'success') {
      console.log(`${prefix} ${message}`, data || '');
    } else {
      console.log(`${prefix} ${message}`, data || '');
    }
  }

  /**
   * Checks if a port is available
   */
  async checkPortAvailable(port: number): Promise<boolean> {
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
  spawnProcess(
    name: string,
    command: string,
    args: string[],
    options: any = {}
  ): Promise<ProcessInfo> {
    return new Promise((resolve, reject) => {
      this.log('info', `Starting ${name}: ${command} ${args.join(' ')}`);

      const childProcess = spawn(command, args, {
        stdio: ['inherit', 'pipe', 'pipe'] as any,
        cwd: process.cwd(),
        ...options,
      });

      let stdout = '';
      let stderr = '';

      childProcess.stdout.on('data', (data: Buffer) => {
        const output = data.toString();
        stdout += output;
        if (options.verbose) {
          process.stdout.write(output);
        }
      });

      childProcess.stderr.on('data', (data: Buffer) => {
        const output = data.toString();
        stderr += output;
        process.stderr.write(`[${name}] ${output}`);
      });

      childProcess.on('error', (error: Error) => {
        this.log('error', `${name} process error`, error);
        reject(error);
      });

      childProcess.on('close', (code: number, signal: string) => {
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
  async startDevServer(): Promise<boolean> {
    const port = this.config.devServerPort;

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        // Start dev server process (don't wait for it in promise)
        this.spawnProcess('dev-server', 'npx', ['@rspack/cli', 'serve', `--port=${port}`]);

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
          throw new Error(
            'Server port still available after startup delay - server may not have started properly'
          );
        }
      } catch (error: any) {
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

    return false;
  }

  /**
   * Starts Electron application
   */
  async startElectron(): Promise<boolean> {
    try {
      // Check if main file exists
      if (!fs.existsSync(this.config.mainFile)) {
        throw new Error(`Main file not found: ${this.config.mainFile}`);
      }

      await this.spawnProcess(
        'electron',
        'npx',
        ['electron', this.config.mainFile, '--start-dev'],
        {
          verbose: false, // Electron output is noisy in dev mode
        }
      );

      this.log('success', '✅ Electron application started');
      return true;
    } catch (error: any) {
      this.log('error', 'Failed to start Electron', error);
      throw error;
    }
  }

  /**
   * Gracefully shuts down all processes
   */
  async shutdown(): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    this.log('info', '🛑 Shutting down development environment...');

    const shutdownPromises: Promise<void>[] = [];

    this.processes.forEach((childProcess, name) => {
      if ('killed' in childProcess && !childProcess.killed) {
        this.log('info', `Stopping ${name}...`);

        // Try graceful shutdown first
        childProcess.kill('SIGTERM');

        // Force kill after timeout
        const forceKill = setTimeout(() => {
          if ('killed' in childProcess && !childProcess.killed) {
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
  async run(): Promise<void> {
    this.log('info', '🚀 Starting Electron development environment...');

    // Setup cleanup handlers
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
    process.on('uncaughtException', (error: Error) => {
      this.log('error', 'Uncaught exception', error);
      this.shutdown();
    });
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      this.log('error', `Unhandled rejection at: ${promise}, reason: ${reason}`);
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
    } catch (error: any) {
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

export default DevRunner;
