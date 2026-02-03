/**
 * UI utilities for the renderer process
 */
export namespace UiUtils {
  /**
   * Checks if element is in viewport
   * @param element - Element to check
   * @returns True if element is visible
   */
  export function isInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Smooth scrolls to element
   * @param element - Element to scroll to
   * @param offset - Offset from top
   */
  export function scrollToElement(element: Element, offset: number = 0): void {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }

  /**
   * Gets contrast color (black/white) for background color
   * @param hexColor - Hex color code
   * @returns 'black' or 'white'
   */
  export function getContrastColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? 'black' : 'white';
  }

  /**
   * Converts hex color to RGB
   * @param hex - Hex color code
   * @returns RGB values
   */
  export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Converts RGB to hex color
   * @param r - Red value
   * @param g - Green value
   * @param b - Blue value
   * @returns Hex color code
   */
  export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * Downloads a file from URL
   * @param url - URL to download
   * @param filename - Optional filename
   */
  export function downloadFile(url: string, filename?: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Copies text to clipboard
   * @param text - Text to copy
   * @returns Promise that resolves to true if successful
   */
  export async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Gets the current theme preference
   * @returns 'light' or 'dark'
   */
  export function getThemePreference(): 'light' | 'dark' {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Adds a CSS class to an element
   * @param element - Element to add class to
   * @param className - Class name to add
   */
  export function addClass(element: HTMLElement, className: string): void {
    if (element.classList) {
      element.classList.add(className);
    } else {
      element.className += ' ' + className;
    }
  }

  /**
   * Removes a CSS class from an element
   * @param element - Element to remove class from
   * @param className - Class name to remove
   */
  export function removeClass(element: HTMLElement, className: string): void {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  /**
   * Toggles a CSS class on an element
   * @param element - Element to toggle class on
   * @param className - Class name to toggle
   */
  export function toggleClass(element: HTMLElement, className: string): void {
    if (element.classList) {
      element.classList.toggle(className);
    } else {
      const classes = element.className.split(' ');
      const existingIndex = classes.indexOf(className);
      
      if (existingIndex >= 0) {
        classes.splice(existingIndex, 1);
      } else {
        classes.push(className);
      }
      
      element.className = classes.join(' ');
    }
  }

  /**
   * Gets computed style of an element
   * @param element - Element to get style from
   * @param property - CSS property name
   * @returns Computed style value
   */
  export function getComputedStyle(element: HTMLElement, property: string): string {
    return window.getComputedStyle(element)[property as any];
  }

  /**
   * Measures text dimensions
   * @param text - Text to measure
   * @param fontFamily - Font family
   * @param fontSize - Font size
   * @param fontWeight - Font weight
   * @returns Text dimensions
   */
  export function measureText(text: string, fontFamily: string = 'Arial', fontSize: string = '16px', fontWeight: string = 'normal'): { width: number; height: number } {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return { width: 0, height: 0 };
    }
    
    ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
    const metrics = ctx.measureText(text);
    
    return {
      width: metrics.width,
      height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    };
  }

  /**
   * Creates a debounced version of a function that updates the UI
   * @param func - Function to debounce
   * @param delay - Delay in milliseconds
   * @returns Debounced function
   */
  export function debounceUI<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;
    
    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        func(...args);
        timeoutId = null;
      }, delay);
    };
  }
}

export default UiUtils;