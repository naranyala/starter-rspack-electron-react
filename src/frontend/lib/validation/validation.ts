/**
 * Validation utilities for the renderer process
 */
export namespace ValidationUtils {
  /**
   * Validates if a string is a valid URL
   * @param url - URL to validate
   * @returns True if valid URL
   */
  export function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validates email format
   * @param email - Email to validate
   * @returns True if valid email
   */
  export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates phone number format
   * @param phone - Phone number to validate
   * @returns True if valid phone number
   */
  export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validates password strength
   * @param password - Password to validate
   * @param minLength - Minimum length requirement
   * @returns Validation result
   */
  export function validatePassword(password: string, minLength: number = 8): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters`);
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates an object against a schema
   * @param obj - Object to validate
   * @param schema - Validation schema
   * @returns Validation result
   */
  export function validateSchema<T>(obj: T, schema: { [K in keyof T]: (value: T[K]) => boolean }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const key in schema) {
      if (schema.hasOwnProperty(key)) {
        const validator = schema[key];
        if (!validator(obj[key])) {
          errors.push(`Invalid value for property: ${String(key)}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default ValidationUtils;