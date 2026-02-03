// Renderer process API utilities
// This file contains functions for communicating with the main process

/**
 * Type definition for ElectronAPI
 */
interface ElectronAPI {
  setTitle: (title: string) => Promise<void>;
  [key: string]: any;
}

/**
 * Safe API wrapper with error handling
 */
export class SafeAPI {
  private api: ElectronAPI;

  constructor() {
    this.api = (window as any).electronAPI || {};
  }

  /**
   * Calls an API method safely
   * @param {string} method - API method name
   * @param {any[]} args - Arguments to pass
   * @returns {Promise<any>} - Promise with result or error
   */
  async call<T>(
    method: string,
    ...args: any[]
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    if (!this.api[method]) {
      return { success: false, error: `Method '${method}' not found` };
    }

    try {
      const result = await this.api[method](...args);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Checks if a method exists
   * @param {string} method - Method name to check
   * @returns {boolean} - True if method exists
   */
  hasMethod(method: string): boolean {
    return typeof this.api[method] === 'function';
  }

  /**
   * Gets available API methods
   * @returns {string[]} - Array of method names
   */
  getAvailableMethods(): string[] {
    return Object.keys(this.api).filter((key) => typeof this.api[key] === 'function');
  }
}

/**
 * Global API instance
 */
export const api = new SafeAPI();

/**
 * Convenience function to call API methods
 * @param {string} method - Method name
 * @param {any[]} args - Arguments
 * @returns {Promise<any>} - Promise with result
 */
export async function invoke<T>(
  method: string,
  ...args: any[]
): Promise<{ success: boolean; data?: T; error?: string }> {
  return api.call<T>(method, ...args);
}

/**
 * Type-safe API wrapper for specific methods
 */
export class TypedAPI {
  private api: SafeAPI;

  constructor() {
    this.api = api;
  }

  /**
   * Sets window title
   * @param {string} title - Window title
   * @returns {Promise<boolean>} - True if successful
   */
  async setTitle(title: string): Promise<boolean> {
    const result = await this.api.call('setTitle', title);
    return result.success;
  }

  /**
   * Gets system information
   * @returns {Promise<object>} - System info object
   */
  async getSystemInfo(): Promise<object | null> {
    const result: any = await this.api.call('getSystemInfo');
    return result.success ? result.data : null;
  }

  /**
   * Shows a file dialog
   * @param {object} options - Dialog options
   * @returns {Promise<string[]>} - Selected file paths
   */
  async showOpenDialog(options: object): Promise<string[]> {
    const result: any = await this.api.call('showOpenDialog', options);
    return result.success ? result.data : [];
  }

  /**
   * Shows a save dialog
   * @param {object} options - Dialog options
   * @returns {Promise<string | null>} - Selected file path
   */
  async showSaveDialog(options: object): Promise<string | null> {
    const result: any = await this.api.call('showSaveDialog', options);
    return result.success ? result.data : null;
  }
}

/**
 * Global typed API instance
 */
export const typedApi = new TypedAPI();
