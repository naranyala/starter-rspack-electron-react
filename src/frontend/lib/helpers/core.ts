/**
 * Core helper utilities for 10x development productivity
 */
export namespace CoreUtils {
  export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  export function generateId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as T;
    if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
    if (typeof obj === 'object') {
      const clonedObj = {} as { [key: string]: any };
      for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj as T;
    }
    return obj;
  }

  export function getObjectDiff(obj1: any, obj2: any): any {
    const diff: any = {};
    for (const key in obj1) {
      if (Object.hasOwn(obj1, key)) {
        if (!Object.hasOwn(obj2, key)) {
          diff[key] = { old: obj1[key], new: undefined };
        } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
          diff[key] = { old: obj1[key], new: obj2[key] };
        }
      }
    }
    for (const key in obj2) {
      if (Object.hasOwn(obj2, key) && !Object.hasOwn(obj1, key)) {
        diff[key] = { old: undefined, new: obj2[key] };
      }
    }
    return diff;
  }

  export function flattenObject(obj: any, prefix: string = ''): any {
    const flattened: any = {};
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
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

  export function unflattenObject(flat: any): any {
    const result: any = {};
    for (const key in flat) {
      if (Object.hasOwn(flat, key)) {
        const keys = key.split('.');
        let current = result;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = flat[key];
      }
    }
    return result;
  }

  export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach((key) => delete result[key]);
    return result;
  }

  export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  }

  export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  export function uniqueBy<T>(array: T[], key: keyof T): T[] {
    const seen = new Set();
    return array.filter((item) => {
      const val = item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  }

  export function chunk<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  }

  export function sortBy<T>(array: T[], key: keyof T | ((item: T) => any), order: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const aVal = typeof key === 'function' ? key(a) : a[key];
      const bVal = typeof key === 'function' ? key(b) : b[key];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return order === 'asc' ? comparison : -comparison;
    });
  }
}

export default CoreUtils;
