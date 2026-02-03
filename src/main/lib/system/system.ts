import * as os from 'os';
import * as path from 'path';
import { app } from 'electron';
import { SystemInfo } from '../common/types';

/**
 * System and application utilities
 */
export namespace SystemUtils {
  /**
   * Gets system information
   * @returns System info object
   */
  export function getSystemInfo(): SystemInfo {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      electronVersion: process.versions.electron || 'N/A',
      appVersion: app.getVersion(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length,
      uptime: os.uptime(),
    };
  }

  /**
   * Gets application data directory
   * @param subPath - Optional subdirectory path
   * @returns App data directory path
   */
  export function getAppDataPath(subPath: string = ''): string {
    const userDataPath = app.getPath('userData');
    return subPath ? path.join(userDataPath, subPath) : userDataPath;
  }

  /**
   * Gets temporary directory
   * @param subPath - Optional subdirectory path
   * @returns Temporary directory path
   */
  export function getTempPath(subPath: string = ''): string {
    const tempPath = os.tmpdir();
    return subPath ? path.join(tempPath, subPath) : tempPath;
  }

  /**
   * Logs messages with timestamp and level
   * @param level - Log level (info, warn, error, debug)
   * @param message - Message to log
   * @param data - Optional additional data
   */
  export function log(level: 'info' | 'warn' | 'error' | 'debug' | 'verbose', message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case 'error':
        console.error(logMessage, data || '');
        break;
      case 'warn':
        console.warn(logMessage, data || '');
        break;
      case 'debug':
      case 'verbose':
        console.debug(logMessage, data || '');
        break;
      default:
        console.log(logMessage, data || '');
        break;
    }
  }

  /**
   * Creates a logger instance with prefixed messages
   * @param prefix - Prefix for all log messages
   * @returns Logger object
   */
  export function createLogger(prefix: string) {
    return {
      info: (message: string, data?: any) => log('info', `[${prefix}] ${message}`, data),
      warn: (message: string, data?: any) => log('warn', `[${prefix}] ${message}`, data),
      error: (message: string, data?: any) => log('error', `[${prefix}] ${message}`, data),
      debug: (message: string, data?: any) => log('debug', `[${prefix}] ${message}`, data),
      verbose: (message: string, data?: any) => log('verbose', `[${prefix}] ${message}`, data),
    };
  }
}

export default SystemUtils;