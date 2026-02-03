import * as crypto from 'crypto';
import * as fs from 'fs';
import { SystemUtils } from '../system/system';

/**
 * Security utilities for the main process
 */
export namespace SecurityUtils {
  /**
   * Hashes a string using SHA-256
   * @param data - Data to hash
   * @returns Hashed string
   */
  export function hashSha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generates a random salt
   * @param length - Length of the salt
   * @returns Random salt string
   */
  export function generateSalt(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hashes a password with salt using PBKDF2
   * @param password - Password to hash
   * @param salt - Salt to use
   * @param iterations - Number of iterations
   * @param keylen - Key length
   * @returns Promise that resolves to the hashed password
   */
  export function hashPassword(password: string, salt: string, iterations: number = 10000, keylen: number = 64): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, iterations, keylen, 'sha512', (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(derivedKey.toString('hex'));
        }
      });
    });
  }

  /**
   * Encrypts data using AES-256-GCM
   * @param data - Data to encrypt
   * @param secret - Secret key
   * @returns Encrypted data with IV and auth tag
   */
  export function encryptAES(data: string, secret: string): { encrypted: string; iv: string; authTag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', secret.padEnd(32, '0').substring(0, 32), iv);
    cipher.setAutoPadding(true);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag
    };
  }

  /**
   * Decrypts data using AES-256-GCM
   * @param encryptedData - Encrypted data object
   * @param secret - Secret key
   * @returns Decrypted data
   */
  export function decryptAES(encryptedData: { encrypted: string; iv: string; authTag: string }, secret: string): string {
    const decipher = crypto.createDecipheriv('aes-256-gcm', secret.padEnd(32, '0').substring(0, 32), Buffer.from(encryptedData.iv, 'hex'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Sanitizes a file path to prevent directory traversal
   * @param filePath - File path to sanitize
   * @returns Sanitized file path
   */
  export function sanitizeFilePath(filePath: string): string {
    // Remove null bytes and normalize the path
    const sanitized = filePath.replace(/\0/g, '').replace(/\\/g, '/');
    const normalized = require('path').normalize(sanitized);
    
    // Ensure the path doesn't start with parent directory references
    if (normalized.startsWith('../') || normalized.startsWith('..\\') || normalized === '..') {
      throw new Error('Invalid path: Path traversal detected');
    }
    
    return normalized;
  }

  /**
   * Validates a file path for security
   * @param filePath - File path to validate
   * @returns True if the path is valid and safe
   */
  export function validateFilePath(filePath: string): boolean {
    try {
      // Check for null bytes
      if (filePath.includes('\0')) {
        return false;
      }
      
      // Check for path traversal attempts
      if (filePath.includes('../') || filePath.includes('..\\')) {
        return false;
      }
      
      // Check for absolute paths (optional, depending on your use case)
      if (filePath.startsWith('/') || /^[A-Za-z]:/.test(filePath)) {
        return false;
      }
      
      return true;
    } catch (error) {
      SystemUtils.log('error', 'Error validating file path:', error);
      return false;
    }
  }

  /**
   * Generates a cryptographically secure random string
   * @param length - Length of the string
   * @returns Random string
   */
  export function generateSecureRandomString(length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').substring(0, length);
  }

  /**
   * Signs data with HMAC-SHA256
   * @param data - Data to sign
   * @param secret - Secret key
   * @returns HMAC signature
   */
  export function signHmac(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Verifies HMAC signature
   * @param data - Data that was signed
   * @param signature - Signature to verify
   * @param secret - Secret key
   * @returns True if signature is valid
   */
  export function verifyHmac(data: string, signature: string, secret: string): boolean {
    const expectedSignature = signHmac(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Checks if a file has dangerous content (basic implementation)
   * @param filePath - Path to file to check
   * @returns Promise that resolves to true if file is safe
   */
  export async function checkFileSafety(filePath: string): Promise<boolean> {
    try {
      // Basic check: ensure file exists and is not too large
      const stats = fs.statSync(filePath);
      if (stats.size > 10 * 1024 * 1024) { // 10MB limit
        SystemUtils.log('warn', `File too large for safety check: ${filePath}`);
        return false;
      }
      
      // Read first few bytes to check for obvious executable content
      const buffer = Buffer.alloc(1024);
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, buffer, 0, 1024, 0);
      fs.closeSync(fd);
      
      const content = buffer.toString('utf8', 0, Math.min(buffer.length, 1024));
      
      // Check for obvious executable markers
      if (content.toLowerCase().includes('#!/bin/sh') || 
          content.toLowerCase().includes('#!/bin/bash') ||
          content.toLowerCase().includes('eval(') ||
          content.toLowerCase().includes('exec(')) {
        SystemUtils.log('warn', `Potentially dangerous content detected in: ${filePath}`);
        return false;
      }
      
      return true;
    } catch (error) {
      SystemUtils.log('error', 'Error checking file safety:', error);
      return false;
    }
  }
}

export default SecurityUtils;