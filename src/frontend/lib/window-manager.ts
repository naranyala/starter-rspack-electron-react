interface WindowRecord {
  id: string;
  title: string;
  winbox: any;
  isMinimized: boolean;
  isActive: boolean;
}

type WindowCallback = (windows: WindowRecord[]) => void;

class WindowManager {
  private windows: Map<string, WindowRecord> = new Map();
  private listeners: Set<WindowCallback> = new Set();
  private focusCheckInterval: number | null = null;
  private initialized = false;
  private stateUpdateTimeouts: Map<string, number> = new Map(); // Track timeouts per window

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.focusCheckInterval = window.setInterval(() => {
      this.checkWindowStates();
    }, 100);
  }

  register(id: string, title: string, winbox: any): void {
    this.init();

    this.windows.set(id, {
      id,
      title,
      winbox,
      isMinimized: false,
      isActive: true,
    });

    const checkClosed = () => {
      if (!document.body.contains(winbox.window as HTMLElement)) {
        this.unregister(id);
      }
    };

    winbox.onclose = (force?: boolean) => {
      setTimeout(() => {
        if (!force) checkClosed();
      }, 50);
    };

    winbox.onminimize = (state: boolean) => {
      const record = this.windows.get(id);
      if (record && record.isMinimized !== state) {
        // Debounce the state update to prevent recursion
        this.debouncedStateUpdate(id, { isMinimized: state, isActive: state ? false : record.isActive });
      }
    };

    winbox.onrestore = (state: boolean) => {
      const record = this.windows.get(id);
      if (record && record.isMinimized !== !state) {
        // Debounce the state update to prevent recursion
        this.debouncedStateUpdate(id, { isMinimized: !state, isActive: !state ? true : record.isActive });
      }
    };

    setTimeout(() => {
      this.updateActiveWindow(id);
    }, 50);

    this.notifyListeners();
  }

  unregister(id: string): void {
    this.windows.delete(id);
    this.notifyListeners();
  }

  focus(id: string): void {
    const record = this.windows.get(id);
    if (record) {
      record.winbox.focus();
      this.updateActiveWindow(id);
    }
  }

  toggle(id: string): void {
    const record = this.windows.get(id);
    if (!record) return;

    const isCurrentlyActive = record.isActive && !record.isMinimized;

    if (isCurrentlyActive) {
      // Currently active and visible - minimize it
      record.isMinimized = true;
      record.isActive = false;
      record.winbox.minimize();

      // Find another window to make active
      let otherActive = false;
      this.windows.forEach((r, otherId) => {
        if (otherId !== id && !r.isMinimized) {
          r.isActive = true;
          r.winbox.focus();
          otherActive = true;
        } else if (otherId !== id) {
          r.isActive = false;
        }
      });

      // If no other window is active, just update
      if (!otherActive) {
        this.notifyListeners();
      }
    } else {
      // Not active or minimized - restore and focus
      record.isMinimized = false;
      record.isActive = true;

      // Deactivate all other windows
      this.windows.forEach((r, otherId) => {
        if (otherId !== id) {
          r.isActive = false;
        }
      });

      // Restore if minimized, then focus
      if (record.winbox.min) {
        record.winbox.restore();
      }
      record.winbox.focus();
      this.notifyListeners();
    }
  }

  minimize(id: string): void {
    const record = this.windows.get(id);
    if (record) {
      record.winbox.minimize();
    }
  }

  minimizeAll(): void {
    this.windows.forEach((record) => {
      if (!record.isMinimized) {
        record.winbox.minimize();
      }
    });
  }

  close(id: string): void {
    const record = this.windows.get(id);
    if (record) {
      record.winbox.close(true);
    }
  }

  closeAll(): void {
    this.windows.forEach((record) => {
      record.winbox.close(true);
    });
    this.windows.clear();
    this.notifyListeners();
  }

  getWindows(): WindowRecord[] {
    return Array.from(this.windows.values());
  }

  subscribe(callback: WindowCallback): () => void {
    this.listeners.add(callback);
    callback(this.getWindows());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private updateActiveWindow(activeId: string) {
    this.windows.forEach((record, id) => {
      record.isActive = id === activeId;
    });
    this.notifyListeners();
  }

  private checkWindowStates() {
    let needsUpdate = false;

    this.windows.forEach((record, id) => {
      const winbox = record.winbox;

      const isClosed = !document.body.contains(winbox.window as HTMLElement);
      if (isClosed) {
        this.windows.delete(id);
        needsUpdate = true;
        return;
      }

      // Only update if the winbox state differs from our internal state
      const isMinimized = winbox.min;
      if (record.isMinimized !== isMinimized) {
        record.isMinimized = isMinimized;
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      this.notifyListeners();
    }
  }

  updateWindowState(id: string, state: Partial<{ isMinimized: boolean; isActive: boolean }>): void {
    // Use the same debounced approach
    this.debouncedStateUpdate(id, state);
  }

  private debouncedStateUpdate(id: string, newState: Partial<{ isMinimized: boolean; isActive: boolean }>): void {
    // Clear any existing timeout for this window
    if (this.stateUpdateTimeouts.has(id)) {
      window.clearTimeout(this.stateUpdateTimeouts.get(id));
    }

    // Set a new timeout to update the state
    const timeoutId = window.setTimeout(() => {
      const record = this.windows.get(id);
      if (record) {
        let changed = false;

        if (newState.isMinimized !== undefined && record.isMinimized !== newState.isMinimized) {
          record.isMinimized = newState.isMinimized;
          changed = true;
        }

        if (newState.isActive !== undefined && record.isActive !== newState.isActive) {
          record.isActive = newState.isActive;
          changed = true;
        }

        if (changed) {
          this.notifyListeners();
        }
      }

      // Clean up the timeout map
      this.stateUpdateTimeouts.delete(id);
    }, 0); // Use minimal delay to allow event loop to process

    // Store the timeout ID
    this.stateUpdateTimeouts.set(id, timeoutId);
  }

  private notifyListeners(): void {
    const windows = this.getWindows();
    this.listeners.forEach((listener) => listener(windows));
  }

  destroy() {
    if (this.focusCheckInterval) {
      window.clearInterval(this.focusCheckInterval);
      this.focusCheckInterval = null;
    }

    // Clear all pending timeouts
    this.stateUpdateTimeouts.forEach(timeoutId => {
      window.clearTimeout(timeoutId);
    });
    this.stateUpdateTimeouts.clear();
  }
}

export const windowManager = new WindowManager();
export type { WindowRecord };
