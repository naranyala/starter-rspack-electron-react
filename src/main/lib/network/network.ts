import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';
import { SystemUtils } from '../system/system';

/**
 * Network utilities for the main process
 */
export namespace NetworkUtils {
  /**
   * Downloads a file from a URL
   * @param url - URL to download from
   * @param destPath - Destination path
   * @returns Promise that resolves when download is complete
   */
  export function downloadFile(url: string, destPath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      const file = fs.createWriteStream(destPath);
      const req = client.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Download failed with status code: ${response.statusCode}`));
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
        
        file.on('error', (err) => {
          fs.unlink(destPath, () => {}); // Delete the file async
          reject(err);
        });
      });
      
      req.on('error', (err) => {
        reject(err);
      });
      
      req.end();
    });
  }

  /**
   * Checks if a URL is accessible
   * @param url - URL to check
   * @param timeout - Timeout in milliseconds
   * @returns Promise that resolves to true if accessible
   */
  export async function isUrlAccessible(url: string, timeout: number = 5000): Promise<boolean> {
    return new Promise((resolve) => {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      const request = client.request(url, { method: 'HEAD' }, (response) => {
        resolve(response.statusCode !== undefined && response.statusCode < 400);
      });
      
      request.setTimeout(timeout, () => {
        request.destroy();
        resolve(false);
      });
      
      request.on('error', () => {
        resolve(false);
      });
      
      request.end();
    });
  }

  /**
   * Gets the IP address of the machine
   * @returns Promise that resolves to the IP address
   */
  export function getLocalIP(): Promise<string> {
    return new Promise((resolve) => {
      const net = require('net'); // Dynamically import to avoid issues in some environments
      
      const interfaces = require('os').networkInterfaces();
      let ipAddress = '127.0.0.1'; // Default fallback
      
      for (const name of Object.keys(interfaces)) {
        const iface = interfaces[name];
        for (const alias of iface) {
          if (alias.family === 'IPv4' && !alias.internal && !alias.address.startsWith('169.254.')) {
            ipAddress = alias.address;
            break;
          }
        }
      }
      
      resolve(ipAddress);
    });
  }

  /**
   * Checks internet connectivity
   * @returns Promise that resolves to true if connected to internet
   */
  export async function checkInternetConnection(): Promise<boolean> {
    try {
      // Try to reach a reliable external service
      const result = await isUrlAccessible('https://www.google.com', 3000);
      return result;
    } catch (error) {
      SystemUtils.log('error', 'Error checking internet connection:', error);
      return false;
    }
  }

  /**
   * Gets the public IP address
   * @returns Promise that resolves to the public IP address
   */
  export async function getPublicIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org');
      if (response.ok) {
        return await response.text();
      }
      throw new Error('Failed to get public IP');
    } catch (error) {
      SystemUtils.log('error', 'Error getting public IP:', error);
      return 'unknown';
    }
  }

  /**
   * Makes an HTTP GET request
   * @param url - URL to request
   * @param options - Request options
   * @returns Promise that resolves to the response
   */
  export async function httpGet(url: string, options: { headers?: Record<string, string>; timeout?: number } = {}): Promise<{ data: any; status: number; headers: Record<string, string> }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: options.headers || {},
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        data,
        status: response.status,
        headers
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }

  /**
   * Makes an HTTP POST request
   * @param url - URL to request
   * @param body - Request body
   * @param options - Request options
   * @returns Promise that resolves to the response
   */
  export async function httpPost(url: string, body: any, options: { headers?: Record<string, string>; timeout?: number } = {}): Promise<{ data: any; status: number; headers: Record<string, string> }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: typeof body === 'string' ? body : JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        data,
        status: response.status,
        headers
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }
}

export default NetworkUtils;