import { StorageOptions } from '../common/types';

/**
 * Local storage utilities
 */
export namespace StorageUtils {
  /**
   * Local storage helpers with TTL support
   */
  export const storage = {
    get: <T>(key: string, defaultValue?: T, options: StorageOptions = {}): T | null => {
      try {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return defaultValue || null;

        const item = JSON.parse(itemStr);
        const now = new Date().getTime();

        // Check if item has expired
        if (options.ttl && item.timestamp && now - item.timestamp > options.ttl) {
          localStorage.removeItem(key);
          return defaultValue || null;
        }

        return item.data;
      } catch {
        return defaultValue || null;
      }
    },

    set: <T>(key: string, value: T, options: StorageOptions = {}): boolean => {
      try {
        const item = {
          data: value,
          timestamp: options.ttl ? new Date().getTime() : null
        };
        localStorage.setItem(key, JSON.stringify(item));
        return true;
      } catch {
        return false;
      }
    },

    remove: (key: string): boolean => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },

    clear: (): boolean => {
      try {
        localStorage.clear();
        return true;
      } catch {
        return false;
      }
    },

    // Get all keys
    keys: (): string[] => {
      try {
        return Object.keys(localStorage);
      } catch {
        return [];
      }
    },

    // Get size of stored data in bytes
    size: (): number => {
      try {
        let total = 0;
        for (const key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            total += new Blob([localStorage.getItem(key)!]).size;
          }
        }
        return total;
      } catch {
        return 0;
      }
    }
  };

  /**
   * Session storage helpers
   */
  export const session = {
    get: <T>(key: string, defaultValue?: T): T | null => {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      } catch {
        return defaultValue || null;
      }
    },

    set: <T>(key: string, value: T): boolean => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },

    remove: (key: string): boolean => {
      try {
        sessionStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },

    clear: (): boolean => {
      try {
        sessionStorage.clear();
        return true;
      } catch {
        return false;
      }
    }
  };

  /**
   * Cookie helpers
   */
  export const cookie = {
    get: (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()!.split(';').shift()!;
      return null;
    },

    set: (name: string, value: string, days?: number): boolean => {
      try {
        let expires = '';
        if (days) {
          const date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value || ''}${expires}; path=/`;
        return true;
      } catch {
        return false;
      }
    },

    remove: (name: string): boolean => {
      try {
        document.cookie = `${name}=; Max-Age=-99999999;`;
        return true;
      } catch {
        return false;
      }
    }
  };
}

export default StorageUtils;