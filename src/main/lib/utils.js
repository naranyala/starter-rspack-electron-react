// Main process utility functions
// This file contains helper functions for the Electron main process

const fs = require('fs');
const path = require('path');
const { app } = require('electron');

/**
 * Validates file paths for security
 * @param {string} filePath - Path to validate
 * @returns {boolean} - True if path is safe
 */
function validatePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return false;
  }

  // Prevent path traversal attacks
  if (filePath.includes('..') || filePath.includes('~')) {
    return false;
  }

  return true;
}

/**
 * Creates a safe file path
 * @param {string} basePath - Base directory
 * @param {string} relativePath - Relative path
 * @returns {string|null} - Safe absolute path or null
 */
function createSafePath(basePath, relativePath) {
  if (!validatePath(relativePath)) {
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
 * Logs messages with timestamp and level
 * @param {string} level - Log level (info, warn, error, debug)
 * @param {string} message - Message to log
 * @param {any} data - Optional additional data
 */
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  if (level === 'error') {
    console.error(logMessage, data || '');
  } else if (level === 'warn') {
    console.warn(logMessage, data || '');
  } else {
    console.log(logMessage, data || '');
  }
}

/**
 * Gets application data directory
 * @param {string} subPath - Optional subdirectory path
 * @returns {string} - App data directory path
 */
function getAppDataPath(subPath = '') {
  const userDataPath = app.getPath('userData');
  return subPath ? path.join(userDataPath, subPath) : userDataPath;
}

/**
 * Ensures a directory exists, creates if it doesn't
 * @param {string} dirPath - Directory path to ensure
 * @returns {boolean} - True if directory exists or was created
 */
function ensureDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      log('info', `Created directory: ${dirPath}`);
    }
    return true;
  } catch (error) {
    log('error', `Failed to create directory: ${dirPath}`, error);
    return false;
  }
}

/**
 * Reads JSON file safely
 * @param {string} filePath - Path to JSON file
 * @param {any} defaultValue - Default value if file doesn't exist
 * @returns {any} - Parsed JSON or default value
 */
function readJsonFile(filePath, defaultValue = {}) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    log('error', `Failed to read JSON file: ${filePath}`, error);
    return defaultValue;
  }
}

/**
 * Writes JSON file safely
 * @param {string} filePath - Path to JSON file
 * @param {any} data - Data to write
 * @returns {boolean} - True if successful
 */
function writeJsonFile(filePath, data) {
  try {
    ensureDirectory(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    log('error', `Failed to write JSON file: ${filePath}`, error);
    return false;
  }
}

/**
 * Gets system information
 * @returns {object} - System info object
 */
function getSystemInfo() {
  const os = require('os');
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    electronVersion: process.versions.electron,
    appVersion: app.getVersion(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    cpus: os.cpus().length,
    uptime: os.uptime(),
  };
}

/**
 * Validates that a file is within allowed directories
 * @param {string} filePath - File path to check
 * @param {string[]} allowedDirs - List of allowed base directories
 * @returns {boolean} - True if file is in allowed directory
 */
function isFileInAllowedDir(filePath, allowedDirs) {
  const resolvedPath = path.resolve(filePath);
  return allowedDirs.some((dir) => resolvedPath.startsWith(path.resolve(dir)));
}

/**
 * Creates a backup of a file
 * @param {string} filePath - Path to file to backup
 * @param {string} backupSuffix - Optional suffix for backup file
 * @returns {string|null} - Backup file path or null if failed
 */
function createBackup(filePath, backupSuffix = '') {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup${backupSuffix ? '.' + backupSuffix : ''}.${timestamp}`;
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  } catch (error) {
    log('error', `Failed to create backup of: ${filePath}`, error);
    return null;
  }
}

/**
 * Monitors a file or directory for changes
 * @param {string} targetPath - Path to watch
 * @param {function} callback - Callback function for changes
 * @returns {FSWatcher} - File system watcher
 */
function watchFile(targetPath, callback) {
  if (!fs.existsSync(targetPath)) {
    log('warn', `Cannot watch non-existent path: ${targetPath}`);
    return null;
  }

  return fs.watch(targetPath, (eventType, filename) => {
    log('info', `File change detected: ${eventType} - ${filename}`);
    callback(eventType, filename);
  });
}

module.exports = {
  validatePath,
  createSafePath,
  log,
  getAppDataPath,
  ensureDirectory,
  readJsonFile,
  writeJsonFile,
  getSystemInfo,
  isFileInAllowedDir,
  createBackup,
  watchFile,
};
