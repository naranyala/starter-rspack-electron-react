/**
 * Common type definitions for main process utilities
 */

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  extension: string;
  isDirectory: boolean;
  modified: Date;
}

export interface SystemInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  electronVersion: string;
  appVersion: string;
  totalMemory: number;
  freeMemory: number;
  cpus: number;
  uptime: number;
}

export interface PathValidationResult {
  isValid: boolean;
  isSafe: boolean;
  normalizedPath: string;
  error?: string;
}

export interface StorageOptions {
  ttl?: number; // Time to live in milliseconds
}