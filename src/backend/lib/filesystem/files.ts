import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import { FileInfo, PathValidationResult } from '../common/types';

/**
 * File system utilities for the main process
 */
export namespace FileUtils {
  /**
   * Validates file paths for security
   * @param filePath - Path to validate
   * @returns Validation result
   */
  export function validatePath(filePath: string): PathValidationResult {
    if (!filePath || typeof filePath !== 'string') {
      return {
        isValid: false,
        isSafe: false,
        normalizedPath: '',
        error: 'Invalid path: path is empty or not a string'
      };
    }

    // Prevent path traversal attacks
    if (filePath.includes('..') || filePath.includes('~')) {
      return {
        isValid: true,
        isSafe: false,
        normalizedPath: path.normalize(filePath),
        error: 'Path contains unsafe characters'
      };
    }

    return {
      isValid: true,
      isSafe: true,
      normalizedPath: path.normalize(filePath)
    };
  }

  /**
   * Creates a safe file path
   * @param basePath - Base directory
   * @param relativePath - Relative path
   * @returns Safe absolute path or null
   */
  export function createSafePath(basePath: string, relativePath: string): string | null {
    const validationResult = validatePath(relativePath);
    if (!validationResult.isSafe) {
      return null;
    }

    try {
      const fullPath = path.resolve(basePath, relativePath);
      if (!fullPath.startsWith(path.resolve(basePath))) {
        return null;
      }
      return fullPath;
    } catch (error) {
      return null;
    }
  }

  /**
   * Reads JSON file safely
   * @param filePath - Path to JSON file
   * @param defaultValue - Default value if file doesn't exist
   * @returns Parsed JSON or default value
   */
  export function readJsonFile<T>(filePath: string, defaultValue: T = {} as T): T {
    try {
      if (!fs.existsSync(filePath)) {
        return defaultValue;
      }
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Failed to read JSON file: ${filePath}`, error);
      return defaultValue;
    }
  }

  /**
   * Writes JSON file safely
   * @param filePath - Path to JSON file
   * @param data - Data to write
   * @returns True if successful
   */
  export function writeJsonFile<T>(filePath: string, data: T): boolean {
    try {
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Failed to write JSON file: ${filePath}`, error);
      return false;
    }
  }

  /**
   * Ensures a directory exists, creates if it doesn't
   * @param dirPath - Directory path to ensure
   * @returns True if directory exists or was created
   */
  export function ensureDirectory(dirPath: string): boolean {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
      }
      return true;
    } catch (error) {
      console.error(`Failed to create directory: ${dirPath}`, error);
      return false;
    }
  }

  /**
   * Gets detailed file information
   * @param filePath - Path to file
   * @returns File information object
   */
  export function getFileInfo(filePath: string): FileInfo | null {
    try {
      const stats = fs.statSync(filePath);
      const ext = path.extname(filePath).toLowerCase();

      return {
        name: path.basename(filePath),
        path: filePath,
        size: stats.size,
        extension: ext,
        isDirectory: stats.isDirectory(),
        modified: stats.mtime
      };
    } catch (error) {
      console.error(`Failed to get file info: ${filePath}`, error);
      return null;
    }
  }

  /**
   * Lists files in a directory with filtering options
   * @param dirPath - Directory path to scan
   * @param filter - Optional filter function
   * @returns Array of file information objects
   */
  export function listFiles(dirPath: string, filter?: (file: FileInfo) => boolean): FileInfo[] {
    try {
      const files = fs.readdirSync(dirPath);
      const fileInfoArray: FileInfo[] = [];

      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const info = getFileInfo(fullPath);
        if (info && (!filter || filter(info))) {
          fileInfoArray.push(info);
        }
      }

      return fileInfoArray;
    } catch (error) {
      console.error(`Failed to list files in directory: ${dirPath}`, error);
      return [];
    }
  }

  /**
   * Copies a file from source to destination
   * @param srcPath - Source file path
   * @param destPath - Destination file path
   * @returns True if successful
   */
  export function copyFile(srcPath: string, destPath: string): boolean {
    try {
      const srcDir = path.dirname(destPath);
      ensureDirectory(srcDir);
      fs.copyFileSync(srcPath, destPath);
      return true;
    } catch (error) {
      console.error(`Failed to copy file: ${srcPath} to ${destPath}`, error);
      return false;
    }
  }

  /**
   * Deletes a file
   * @param filePath - Path to file to delete
   * @returns True if successful
   */
  export function deleteFile(filePath: string): boolean {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to delete file: ${filePath}`, error);
      return false;
    }
  }

  /**
   * Creates a backup of a file
   * @param filePath - Path to file to backup
   * @param backupSuffix - Optional suffix for backup file
   * @returns Backup file path or null if failed
   */
  export function createBackup(filePath: string, backupSuffix: string = ''): string | null {
    try {
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `${filePath}.backup${backupSuffix ? '.' + backupSuffix : ''}.${timestamp}`;
      fs.copyFileSync(filePath, backupPath);
      return backupPath;
    } catch (error) {
      console.error(`Failed to create backup of: ${filePath}`, error);
      return null;
    }
  }
}

export default FileUtils;