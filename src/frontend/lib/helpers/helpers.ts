/**
 * Helper utilities for the renderer process
 */
export namespace HelperUtils {
  /**
   * Formats a date string to a readable format
   * @param date - Date to format
   * @returns Formatted date string
   */
  export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Formats date with relative time (e.g., "2 hours ago")
   * @param date - Date to format
   * @returns Relative time string
   */
  export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDate(date);
  }

  /**
   * Debounces function calls
   * @param func - Function to debounce
   * @param delay - Delay in milliseconds
   * @param options - Debounce options
   * @returns Debounced function
   */
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
    options: { leading?: boolean; trailing?: boolean } = {}
  ): (...args: Parameters<T>) => void {
    const { leading = false, trailing = true } = options;
    let timeoutId: NodeJS.Timeout | null = null;
    let lastCallTime: number | null = null;

    const later = (args: Parameters<T>) => {
      timeoutId = null;
      if (!leading) func(...args);
    };

    return (...args: Parameters<T>) => {
      const callNow = leading && !timeoutId;
      const currentTime = Date.now();

      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => later(args), delay);

      if (callNow) {
        func(...args);
        lastCallTime = currentTime;
      }
    };
  }

  /**
   * Throttles function calls
   * @param func - Function to throttle
   * @param delay - Delay in milliseconds
   * @returns Throttled function
   */
  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }

  /**
   * Formats file size to human readable format
   * @param bytes - Size in bytes
   * @returns Formatted size string
   */
  export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Generates a random ID
   * @param length - Length of the ID
   * @returns Random ID string
   */
  export function generateId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Deep clones an object
   * @param obj - Object to clone
   * @returns Cloned object
   */
  export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as T;
    if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
    if (typeof obj === 'object') {
      const clonedObj = {} as { [key: string]: any };
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj as T;
    }
    return obj;
  }

  /**
   * Capitalizes first letter of string
   * @param str - String to capitalize
   * @returns Capitalized string
   */
  export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Converts string to title case
   * @param str - String to convert
   * @returns Title case string
   */
  export function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  /**
   * Truncates string to specified length
   * @param str - String to truncate
   * @param length - Maximum length
   * @param suffix - Suffix to add if truncated
   * @returns Truncated string
   */
  export function truncate(str: string, length: number, suffix: string = '...'): string {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  }

  /**
   * Generates a UUID (v4)
   * @returns UUID string
   */
  export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Calculates the difference between two objects
   * @param obj1 - First object
   * @param obj2 - Second object
   * @returns Object with differences
   */
  export function getObjectDiff(obj1: any, obj2: any): any {
    const diff: any = {};

    for (const key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        if (!obj2.hasOwnProperty(key)) {
          diff[key] = { old: obj1[key], new: undefined };
        } else if (obj1[key] !== obj2[key]) {
          diff[key] = { old: obj1[key], new: obj2[key] };
        }
      }
    }

    for (const key in obj2) {
      if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
        diff[key] = { old: undefined, new: obj2[key] };
      }
    }

    return diff;
  }

  /**
   * Flattens a nested object
   * @param obj - Object to flatten
   * @param prefix - Prefix for keys
   * @returns Flattened object
   */
  export function flattenObject(obj: any, prefix: string = ''): any {
    const flattened: any = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }

    return flattened;
  }

  /**
   * Debounce function that returns a promise
   * @param func - Function to debounce
   * @param delay - Delay in milliseconds
   * @returns Promise that resolves with the result of the function
   */
  export function debouncePromise<T extends (...args: any[]) => Promise<any>>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
    let timeoutId: NodeJS.Timeout | null = null;
    let resolver: ((value: Awaited<ReturnType<T>>) => void) | null = null;
    let rejecter: ((reason: any) => void) | null = null;

    return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      return new Promise((resolve, reject) => {
        if (resolver) {
          // Clear the previous resolver/rejecter
          reject(new Error('Previous call cancelled'));
        }

        resolver = resolve as (value: Awaited<ReturnType<T>>) => void;
        rejecter = reject;

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(async () => {
          try {
            const result = await func(...args);
            if (resolver) {
              resolver(result);
            }
          } catch (error) {
            if (rejecter) {
              rejecter(error);
            }
          } finally {
            resolver = null;
            rejecter = null;
          }
        }, delay);
      });
    };
  }

  /**
   * Checks if the device is mobile
   * @returns True if device is mobile
   */
  export function isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Checks if the device is touch capable
   * @returns True if device is touch capable
   */
  export function isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Checks if the browser is online
   * @returns True if browser is online
   */
  export function isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Gets the current browser name
   * @returns Browser name
   */
  export function getBrowserName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera') || userAgent.includes('OPR/')) return 'Opera';
    return 'Unknown';
  }

  /**
   * Gets the current OS name
   * @returns OS name
   */
  export function getOSName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Win')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown';
  }
}

export default HelperUtils;