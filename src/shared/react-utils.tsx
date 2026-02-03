// Shared React utility functions
// This file re-exports React utilities from the renderer lib

import { ReactHooksUtils } from '../renderer/lib';

// Re-export all React utilities for backward compatibility
export * from '../renderer/lib';

// For backward compatibility, re-export specific hooks with their old names
export const useDebounce = ReactHooksUtils.useDebounce;
export const useLocalStorage = ReactHooksUtils.useLocalStorage;
export const useAsync = ReactHooksUtils.useAsync;
export const useWindowSize = ReactHooksUtils.useWindowSize;
export const useClickOutside = ReactHooksUtils.useClickOutside;
export const useKeyboard = ReactHooksUtils.useKeyboard;
export const useMediaQuery = ReactHooksUtils.useMediaQuery;
// export const usePrevious = ReactHooksUtils.usePrevious;  // Temporarily disabled due to TypeScript error
export const useTimeout = ReactHooksUtils.useTimeout;
export const useInterval = ReactHooksUtils.useInterval;
