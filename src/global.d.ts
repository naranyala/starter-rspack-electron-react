// Type declarations for global WinBox
// WinBox is loaded via script tag, not as a module

declare global {
  interface Window {
    WinBox: WinBoxConstructor;
  }

  interface WinBoxConstructor {
    new (options: WinBoxOptions): WinBoxInstance;
  }

  interface WinBoxOptions {
    title?: string;
    html?: string;
    width?: string | number;
    height?: string | number;
    x?: string | number;
    y?: string | number;
    class?: string[];
    background?: string;
    border?: number;
    [key: string]: any;
  }

  interface WinBoxInstance {
    body: HTMLElement;
    close: () => void;
    focus: () => void;
    [key: string]: any;
  }

  var WinBox: WinBoxConstructor;
}

export {};
