// Shared utility functions
// This file re-exports utilities from both main and renderer libs

// Import renderer utilities from new lib structure
import { HelperUtils, StorageUtils } from '../renderer/lib';

// Re-export all utilities for backward compatibility
export * from '../renderer/lib';

// For backward compatibility, re-export specific functions with their old names
export const formatDate = HelperUtils.formatDate;
export const formatRelativeTime = HelperUtils.formatRelativeTime;
export const debounce = HelperUtils.debounce;
export const throttle = HelperUtils.throttle;
export const formatFileSize = HelperUtils.formatFileSize;
export const generateId = HelperUtils.generateId;
export const deepClone = HelperUtils.deepClone;
export const capitalize = HelperUtils.capitalize;
export const toTitleCase = HelperUtils.toTitleCase;
export const truncate = HelperUtils.truncate;

// Re-export storage utilities
export const storage = StorageUtils.storage;
