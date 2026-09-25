/**
 * Constantes de la aplicación
 * Centraliza valores hardcoded
 */

// Límites de Chat IA
export const CHAT_LIMITS = {
  FREE: { messages: 15, windowHours: 5 },
  PREMIUM: { messages: 9999, windowHours: 0 }, // Ilimitado
  PRO: { messages: 9999, windowHours: 0 }, // Ilimitado
} as const;

// Planes de suscripción
export const SUBSCRIPTION_PLANS = {
  FREE: { id: 'free', name: 'Gratuito', price: 0 },
  PREMIUM: { id: 'premium', name: 'Premium', price: 9.99 },
  PRO: { id: 'pro', name: 'Pro', price: 19.99 },
} as const;

// Tipos de comida
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
} as const;

// Niveles de actividad
export const ACTIVITY_LEVELS = {
  SEDENTARY: 'sedentary',
  LIGHT: 'light',
  MODERATE: 'moderate',
  ACTIVE: 'active',
  VERY_ACTIVE: 'very_active',
} as const;

// Objetivos
export const GOALS = {
  LOSE: 'lose',
  MAINTAIN: 'maintain',
  GAIN: 'gain',
} as const;

// Límites de validación
export const VALIDATION_LIMITS = {
  EMAIL: { min: 5, max: 255 },
  PASSWORD: { min: 6, max: 100 },
  NAME: { min: 2, max: 100 },
  AGE: { min: 10, max: 100 },
  WEIGHT: { min: 30, max: 300 }, // kg
  HEIGHT: { min: 100, max: 250 }, // cm
} as const;

// Hidratación
export const HYDRATION = {
  DEFAULT_GOAL_ML: 2000, // 2L
  GLASS_SIZE_ML: 250,
  MAX_GLASSES: 20,
} as const;

// Rate limiting
export const RATE_LIMITS = {
  API: { requests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests / 15 min
  AUTH: { requests: 5, windowMs: 15 * 60 * 1000 }, // 5 intentos / 15 min
} as const;

// Paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
