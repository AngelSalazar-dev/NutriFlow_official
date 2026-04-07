import validator from 'validator';
import xss from 'xss';

// Type definition for xss module (no types available)
interface XssOptions {
  whiteList?: Record<string, string[]>;
  stripIgnoreTag?: boolean;
  stripIgnoreTagBody?: string[];
}

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Remove XSS threats
  const sanitized = (xss as any)(input, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
  });
  
  // Trim whitespace
  return sanitized.trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}

/**
 * Validate password strength
 * Default: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
 * Configurable for different security levels
 */
export function isStrongPassword(password: string, options: { minLength?: number; requireUppercase?: boolean; requireLowercase?: boolean; requireNumber?: boolean; requireSpecial?: boolean } = {}): { valid: boolean; errors: string[] } {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = false,
  } = options;

  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`La contraseña debe tener al menos ${minLength} caracteres`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  }

  if (requireNumber && !/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  if (requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate number range
 */
export function isValidNumber(
  value: number,
  options: { min?: number; max?: number; required?: boolean } = {}
): boolean {
  const { min, max, required = false } = options;

  if (required && (!value || value <= 0)) {
    return false;
  }

  if (isNaN(value)) {
    return false;
  }

  if (min !== undefined && value < min) {
    return false;
  }

  if (max !== undefined && value > max) {
    return false;
  }

  return true;
}

/**
 * Validate user profile data
 */
export function validateUserProfile(data: {
  age?: number;
  weight?: number;
  height?: number;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  if (data.age !== undefined) {
    if (!isValidNumber(data.age, { min: 10, max: 120 })) {
      errors.age = 'Edad debe estar entre 10 y 120 años';
    }
  }
  
  if (data.weight !== undefined) {
    if (!isValidNumber(data.weight, { min: 30, max: 500 })) {
      errors.weight = 'Peso debe estar entre 30 y 500 kg';
    }
  }
  
  if (data.height !== undefined) {
    if (!isValidNumber(data.height, { min: 100, max: 250 })) {
      errors.height = 'Altura debe estar entre 100 y 250 cm';
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitize object properties
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      (sanitized as any)[key] = sanitizeInput(sanitized[key]);
    }
  }

  return sanitized;
}

/**
 * Validate MongoDB ObjectId format
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Escape special regex characters
 */
export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
