// Main process file system utilities
// This file contains file system specific utilities for the Electron main process

const fs = require('fs');
const path = require('path');
const { log } = require('./utils');

/**
 * Recursively lists files in a directory
 * @param {string} dirPath - Directory path
 * @param {string[]} extensions - Optional file extensions to filter
 * @returns {string[]} - Array of file paths
 */
function listFiles(dirPath, extensions = []) {
  try {
    const files = [];
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...listFiles(fullPath, extensions));
      } else if (stat.isFile()) {
        if (extensions.length === 0 || extensions.includes(path.extname(item))) {
          files.push(fullPath);
        }
      }
    }

    return files;
  } catch (error) {
    log('error', `Failed to list files in directory: ${dirPath}`, error);
    return [];
  }
}

/**
 * Gets file information
 * @param {string} filePath - File path
 * @returns {object|null} - File information or null
 */
function getFileInfo(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return {
      path: filePath,
      size: stat.size,
      created: stat.birthtime,
      modified: stat.mtime,
      accessed: stat.atime,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile(),
      extension: path.extname(filePath),
      name: path.basename(filePath),
      nameWithoutExt: path.basename(filePath, path.extname(filePath)),
    };
  } catch (error) {
    log('error', `Failed to get file info: ${filePath}`, error);
    return null;
  }
}

/**
 * Safely deletes a file or directory
 * @param {string} targetPath - Path to delete
 * @returns {boolean} - True if successful
 */
function safeDelete(targetPath) {
  try {
    if (!fs.existsSync(targetPath)) {
      return true;
    }

    const stat = fs.statSync(targetPath);

    if (stat.isDirectory()) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(targetPath);
    }

    log('info', `Successfully deleted: ${targetPath}`);
    return true;
  } catch (error) {
    log('error', `Failed to delete: ${targetPath}`, error);
    return false;
  }
}

/**
 * Copies a file or directory
 * @param {string} source - Source path
 * @param {string} destination - Destination path
 * @returns {boolean} - True if successful
 */
function safeCopy(source, destination) {
  try {
    if (!fs.existsSync(source)) {
      log('error', `Source does not exist: ${source}`);
      return false;
    }

    const stat = fs.statSync(source);

    if (stat.isDirectory()) {
      copyDirectory(source, destination);
    } else {
      fs.copyFileSync(source, destination);
    }

    log('info', `Successfully copied: ${source} -> ${destination}`);
    return true;
  } catch (error) {
    log('error', `Failed to copy: ${source} -> ${destination}`, error);
    return false;
  }
}

/**
 * Recursively copies a directory
 * @param {string} source - Source directory
 * @param {string} destination - Destination directory
 */
function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const items = fs.readdirSync(source);

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

/**
 * Monitors disk usage
 * @param {string} path - Path to monitor
 * @returns {object|null} - Disk usage information
 */
function getDiskUsage(path) {
  try {
    const stat = fs.statSync(path);
    return {
      path,
      size: stat.size,
      isDirectory: stat.isDirectory(),
    };
  } catch (error) {
    log('error', `Failed to get disk usage for: ${path}`, error);
    return null;
  }
}

module.exports = {
  listFiles,
  getFileInfo,
  safeDelete,
  safeCopy,
  copyDirectory,
  getDiskUsage,
};
