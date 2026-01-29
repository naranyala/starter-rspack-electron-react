// Renderer process React utilities
// This file contains React-specific utility functions and hooks

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook for debounced value
 * @param {T} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {T} - Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for local storage
 * @param {string} key - Storage key
 * @param {T} initialValue - Initial value
 * @returns {[T, (value: T) => void]} - State and setter
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}

/**
 * Custom hook for async operations with loading states
 * @param {T} asyncFunction - Async function to execute
 * @returns {object} - State and execute function
 */
export function useAsync<T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T
): {
  loading: boolean;
  error: Error | null;
  data: any;
  execute: (...args: Parameters<T>) => Promise<void>;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const execute = useCallback(
    async (...args: Parameters<T>) => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFunction(...args);
        setData(result);
      } catch (err) {
        setError(err as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  return { loading, error, data, execute };
}

/**
 * Custom hook for window resize events
 * @returns {object} - Window dimensions
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Custom hook for click outside detection
 * @param {Function} callback - Callback function
 * @returns {RefObject} - Ref to attach to element
 */
export function useClickOutside(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
}

/**
 * Custom hook for keyboard shortcuts
 * @param {string} key - Key to listen for
 * @param {Function} callback - Callback function
 * @param {boolean} ctrl - Ctrl key required
 * @param {boolean} shift - Shift key required
 * @param {boolean} alt - Alt key required
 */
export function useKeyboard(
  key: string,
  callback: () => void,
  ctrl: boolean = false,
  shift: boolean = false,
  alt: boolean = false
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.key === key &&
        event.ctrlKey === ctrl &&
        event.shiftKey === shift &&
        event.altKey === alt
      ) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [key, callback, ctrl, shift, alt]);
}

/**
 * Custom hook for media queries
 * @param {string} query - Media query string
 * @returns {boolean} - Matches media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Custom hook for previous value
 * @param {T} value - Current value
 * @returns {T | undefined} - Previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * Custom hook for timeout
 * @param {Function} callback - Callback function
 * @param {number} delay - Delay in milliseconds
 */
export function useTimeout(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}

/**
 * Custom hook for interval
 * @param {Function} callback - Callback function
 * @param {number} delay - Delay in milliseconds
 */
export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

/**
 * Higher-order component for error boundaries
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      return FallbackComponent ? (
        <FallbackComponent error={this.state.error!} />
      ) : (
        <div>Something went wrong.</div>
      );
    }

    return this.props.children;
  }
}
