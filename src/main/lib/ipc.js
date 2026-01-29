// Main process IPC (Inter-Process Communication) utilities
// This file contains IPC helper functions for secure communication

const { ipcMain } = require('electron');
const { log } = require('./utils');

/**
 * Sets up IPC handlers with error handling
 * @param {object} handlers - Object mapping channel names to handler functions
 */
function setupIpcHandlers(handlers) {
  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, async (event, ...args) => {
      try {
        log('info', `IPC request: ${channel}`);
        const result = await handler(event, ...args);
        log('info', `IPC response: ${channel} - Success`);
        return { success: true, data: result };
      } catch (error) {
        log('error', `IPC error: ${channel}`, error);
        return { success: false, error: error.message };
      }
    });
  }
}

/**
 * Validates IPC event sender
 * @param {Electron.IpcMainInvokeEvent} event - IPC event
 * @param {string[]} allowedOrigins - Allowed origins
 * @returns {boolean} - True if sender is valid
 */
function validateSender(event, allowedOrigins = []) {
  if (!event || !event.senderFrame) {
    log('warn', 'Invalid IPC event sender');
    return false;
  }

  const origin = event.senderFrame.url;
  if (allowedOrigins.length > 0 && !allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
    log('warn', `Unauthorized IPC origin: ${origin}`);
    return false;
  }

  return true;
}

/**
 * Creates a safe IPC handler wrapper
 * @param {Function} handler - Original handler function
 * @param {string[]} allowedOrigins - Allowed origins
 * @returns {Function} - Wrapped handler
 */
function createSafeHandler(handler, allowedOrigins = []) {
  return async (event, ...args) => {
    if (!validateSender(event, allowedOrigins)) {
      throw new Error('Unauthorized IPC request');
    }
    return handler(event, ...args);
  };
}

/**
 * IPC rate limiter to prevent abuse
 */
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(id) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(id)) {
      this.requests.set(id, []);
    }

    const userRequests = this.requests.get(id);

    // Remove old requests
    const validRequests = userRequests.filter((time) => time > windowStart);
    this.requests.set(id, validRequests);

    if (validRequests.length >= this.maxRequests) {
      log('warn', `Rate limit exceeded for ID: ${id}`);
      return false;
    }

    validRequests.push(now);
    return true;
  }
}

/**
 * Creates a rate-limited IPC handler
 * @param {Function} handler - Original handler function
 * @param {RateLimiter} rateLimiter - Rate limiter instance
 * @returns {Function} - Rate-limited handler
 */
function createRateLimitedHandler(handler, rateLimiter) {
  return async (event, ...args) => {
    const id = event.sender.id;

    if (!rateLimiter.isAllowed(id)) {
      throw new Error('Rate limit exceeded');
    }

    return handler(event, ...args);
  };
}

module.exports = {
  setupIpcHandlers,
  validateSender,
  createSafeHandler,
  RateLimiter,
  createRateLimitedHandler,
};
