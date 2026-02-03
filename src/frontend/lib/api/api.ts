/**
 * API utilities for the renderer process
 */
export namespace ApiUtils {
  /**
   * Makes an HTTP GET request
   * @param url - URL to request
   * @param options - Request options
   * @returns Promise that resolves to the response
   */
  export async function httpGet<T = any>(url: string, options: { headers?: Record<string, string>; timeout?: number } = {}): Promise<{ data: T; status: number; headers: Record<string, string> }> {
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
  export async function httpPost<T = any>(url: string, body: any, options: { headers?: Record<string, string>; timeout?: number } = {}): Promise<{ data: T; status: number; headers: Record<string, string> }> {
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

  /**
   * Makes an HTTP PUT request
   * @param url - URL to request
   * @param body - Request body
   * @param options - Request options
   * @returns Promise that resolves to the response
   */
  export async function httpPut<T = any>(url: string, body: any, options: { headers?: Record<string, string>; timeout?: number } = {}): Promise<{ data: T; status: number; headers: Record<string, string> }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

    try {
      const response = await fetch(url, {
        method: 'PUT',
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

  /**
   * Makes an HTTP DELETE request
   * @param url - URL to request
   * @param options - Request options
   * @returns Promise that resolves to the response
   */
  export async function httpDelete(url: string, options: { headers?: Record<string, string>; timeout?: number } = {}): Promise<{ status: number; headers: Record<string, string> }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: options.headers || {},
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
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
   * Uploads a file to a server
   * @param url - Upload URL
   * @param file - File to upload
   * @param options - Upload options
   * @returns Promise that resolves to the response
   */
  export async function uploadFile(url: string, file: File, options: { headers?: Record<string, string>; onProgress?: (progress: number) => void } = {}): Promise<{ data: any; status: number }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && options.onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          options.onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({ data, status: xhr.status });
          } catch (e) {
            resolve({ data: xhr.responseText, status: xhr.status });
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });
      
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was aborted'));
      });
      
      xhr.open('POST', url);
      
      // Set headers
      Object.entries(options.headers || {}).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
      
      const formData = new FormData();
      formData.append('file', file);
      
      xhr.send(formData);
    });
  }

  /**
   * Downloads a file from a URL
   * @param url - Download URL
   * @param filename - Filename to save as
   */
  export function downloadFileFromUrl(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Creates an API client with common configuration
   * @param baseUrl - Base URL for the API
   * @param defaultHeaders - Default headers to include
   * @returns API client object
   */
  export function createApiClient(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    return {
      get: <T = any>(endpoint: string, options: { headers?: Record<string, string>; timeout?: number } = {}) => 
        httpGet<T>(`${baseUrl}${endpoint}`, { headers: { ...defaultHeaders, ...options.headers }, ...options }),
      
      post: <T = any>(endpoint: string, body: any, options: { headers?: Record<string, string>; timeout?: number } = {}) => 
        httpPost<T>(`${baseUrl}${endpoint}`, body, { headers: { ...defaultHeaders, ...options.headers }, ...options }),
      
      put: <T = any>(endpoint: string, body: any, options: { headers?: Record<string, string>; timeout?: number } = {}) => 
        httpPut<T>(`${baseUrl}${endpoint}`, body, { headers: { ...defaultHeaders, ...options.headers }, ...options }),
      
      delete: (endpoint: string, options: { headers?: Record<string, string>; timeout?: number } = {}) => 
        httpDelete(`${baseUrl}${endpoint}`, { headers: { ...defaultHeaders, ...options.headers }, ...options })
    };
  }
}

export default ApiUtils;