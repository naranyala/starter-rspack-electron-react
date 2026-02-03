import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * React-specific utility functions and hooks
 */
export namespace ReactHooksUtils {
  /**
   * Custom hook for debounced value
   * @param value - Value to debounce
   * @param delay - Delay in milliseconds
   * @returns Debounced value
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
   * @param key - Storage key
   * @param initialValue - Initial value
   * @returns State and setter
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
   * @param asyncFunction - Async function to execute
   * @returns State and execute function
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
   * @returns Window dimensions
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
   * @param callback - Callback function
   * @returns Ref to attach to element
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
   * @param key - Key to listen for
   * @param callback - Callback function
   * @param ctrl - Ctrl key required
   * @param shift - Shift key required
   * @param alt - Alt key required
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
   * @param query - Media query string
   * @returns Matches media query
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

  // Temporarily commenting out usePrevious hook due to TypeScript error
  // /**
  //  * Custom hook for previous value
  //  * @param value - Current value
  //  * @returns Previous value
  //  */
  // export function usePrevious<T>(value: T): T | undefined {
  //   const ref = useRef<T>();
  //   useEffect(() => {
  //     ref.current = value;
  //   }, [value]);
  //   return ref.current;
  // }

  /**
   * Custom hook for timeout
   * @param callback - Callback function
   * @param delay - Delay in milliseconds
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
   * @param callback - Callback function
   * @param delay - Delay in milliseconds
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
   * Custom hook for focus management
   * @returns Focus management functions
   */
  export function useFocusManagement() {
    const ref = useRef<HTMLElement>(null);

    const setFocus = useCallback(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, []);

    return { ref, setFocus };
  }

  /**
   * Custom hook for form state management
   * @param initialState - Initial form state
   * @returns Form state management functions
   */
  export function useFormState<T extends Record<string, any>>(initialState: T) {
    const [state, setState] = useState(initialState);

    const handleChange = useCallback((name: keyof T, value: any) => {
      setState(prev => ({
        ...prev,
        [name]: value
      }));
    }, []);

    const reset = useCallback(() => {
      setState(initialState);
    }, [initialState]);

    return {
      state,
      handleChange,
      reset,
      setState
    };
  }

  /**
   * Custom hook for managing a list of items
   * @param initialItems - Initial list of items
   * @returns List management functions
   */
  export function useList<T>(initialItems: T[] = []) {
    const [items, setItems] = useState<T[]>(initialItems);

    const addItem = useCallback((item: T) => {
      setItems(prev => [...prev, item]);
    }, []);

    const removeItem = useCallback((index: number) => {
      setItems(prev => prev.filter((_, i) => i !== index));
    }, []);

    const updateItem = useCallback((index: number, newItem: T) => {
      setItems(prev => prev.map((item, i) => i === index ? newItem : item));
    }, []);

    const clear = useCallback(() => {
      setItems([]);
    }, []);

    return {
      items,
      addItem,
      removeItem,
      updateItem,
      clear,
      setItems
    };
  }

  /**
   * Custom hook for managing a counter
   * @param initialValue - Initial counter value
   * @returns Counter state and controls
   */
  export function useCounter(initialValue: number = 0) {
    const [count, setCount] = useState(initialValue);

    const increment = useCallback(() => setCount(c => c + 1), []);
    const decrement = useCallback(() => setCount(c => c - 1), []);
    const reset = useCallback(() => setCount(initialValue), [initialValue]);
    const setValue = useCallback((value: number) => setCount(value), []);

    return {
      count,
      increment,
      decrement,
      reset,
      setValue
    };
  }

  /**
   * Custom hook for managing boolean state
   * @param initialValue - Initial boolean value
   * @returns Boolean state and controls
   */
  export function useBoolean(initialValue: boolean = false) {
    const [value, setValue] = useState(initialValue);

    const setTrue = useCallback(() => setValue(true), []);
    const setFalse = useCallback(() => setValue(false), []);
    const toggle = useCallback(() => setValue(v => !v), []);

    return {
      value,
      setTrue,
      setFalse,
      toggle,
      setValue
    };
  }

  /**
   * Custom hook for managing an array of selected items
   * @param initialSelected - Initial selected items
   * @returns Selection state and controls
   */
  export function useSelection<T>(initialSelected: T[] = []) {
    const [selected, setSelected] = useState<T[]>(initialSelected);

    const select = useCallback((item: T) => {
      setSelected(prev => [...prev, item]);
    }, []);

    const deselect = useCallback((item: T) => {
      setSelected(prev => prev.filter(i => i !== item));
    }, []);

    const toggle = useCallback((item: T) => {
      setSelected(prev => 
        prev.includes(item) 
          ? prev.filter(i => i !== item) 
          : [...prev, item]
      );
    }, []);

    const reset = useCallback(() => setSelected([]), []);

    return {
      selected,
      select,
      deselect,
      toggle,
      reset,
      isSelected: (item: T) => selected.includes(item)
    };
  }
}

export default ReactHooksUtils;