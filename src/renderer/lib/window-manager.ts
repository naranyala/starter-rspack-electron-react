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
      if (record) {
        record.isMinimized = state;
        if (state) {
          record.isActive = false;
        }
        this.notifyListeners();
      }
    };

    winbox.onrestore = (state: boolean) => {
      const record = this.windows.get(id);
      if (record) {
        record.isMinimized = !state;
        if (!state) {
          record.isActive = true;
        }
        this.notifyListeners();
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
      record.winbox.minimize();
      record.isMinimized = true;
      record.isActive = false;

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

  private notifyListeners(): void {
    const windows = this.getWindows();
    this.listeners.forEach((listener) => listener(windows));
  }

  destroy() {
    if (this.focusCheckInterval) {
      window.clearInterval(this.focusCheckInterval);
      this.focusCheckInterval = null;
    }
  }
}

export const windowManager = new WindowManager();
export type { WindowRecord };
