/**
 * Common type definitions for renderer process utilities
 */

export interface ApiResult<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

export interface StorageOptions {
  ttl?: number; // Time to live in milliseconds
}