import { ipcMain, BrowserWindow, IpcMainInvokeEvent, IpcMainEvent } from 'electron';
import { SystemUtils } from '../system/system';

/**
 * IPC (Inter-Process Communication) utilities
 */
export namespace IpcUtils {
  /**
   * Registers an IPC handler with error handling
   * @param channel - IPC channel name
   * @param handler - Handler function
   */
  export function registerHandler<T, R>(
    channel: string,
    handler: (event: IpcMainInvokeEvent, ...args: T[]) => Promise<R> | R
  ): void {
    ipcMain.handle(channel, async (event, ...args) => {
      try {
        return await handler(event, ...args);
      } catch (error) {
        SystemUtils.log('error', `IPC handler error on channel '${channel}':`, error);
        throw error;
      }
    });
  }

  /**
   * Sends a message to a specific window
   * @param window - BrowserWindow instance
   * @param channel - IPC channel name
   * @param data - Data to send
   */
  export function sendMessage(window: BrowserWindow, channel: string, ...data: any[]): void {
    if (window && !window.isDestroyed()) {
      window.webContents.send(channel, ...data);
    }
  }

  /**
   * Broadcasts a message to all windows
   * @param channel - IPC channel name
   * @param data - Data to send
   */
  export function broadcastMessage(channel: string, ...data: any[]): void {
    BrowserWindow.getAllWindows().forEach(window => {
      if (!window.isDestroyed()) {
        window.webContents.send(channel, ...data);
      }
    });
  }

  /**
   * Waits for a specific IPC message from the renderer
   * @param window - BrowserWindow instance
   * @param channel - IPC channel name
   * @param timeout - Timeout in milliseconds
   * @returns Promise that resolves with the received data
   */
  export function waitForMessage(window: BrowserWindow, channel: string, timeout: number = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        ipcMain.removeListener(channel, listener);
        reject(new Error(`Timeout waiting for message on channel '${channel}'`));
      }, timeout);

      const listener = (event: IpcMainEvent, ...args: any[]) => {
        if (event.sender.id === window.webContents.id) {
          clearTimeout(timeoutId);
          ipcMain.removeListener(channel, listener);
          resolve(args.length === 1 ? args[0] : args);
        }
      };

      ipcMain.on(channel, listener);
    });
  }
}

export default IpcUtils;