import { z } from 'zod';

/**
 * Schema para registro de usuario
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(5, 'Email muy corto')
    .max(255, 'Email muy largo')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Contraseña muy corta (mínimo 6 caracteres)')
    .max(100, 'Contraseña muy larga'),
  name: z
    .string()
    .min(2, 'Nombre muy corto')
    .max(100, 'Nombre muy largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Nombre inválido'),
  age: z
    .number()
    .min(10, 'Edad mínima 10 años')
    .max(100, 'Edad máxima 100 años'),
  sex: z.enum(['male', 'female']),
  weight: z
    .number()
    .min(30, 'Peso mínimo 30 kg')
    .max(300, 'Peso máximo 300 kg'),
  height: z
    .number()
    .min(100, 'Altura mínima 100 cm')
    .max(250, 'Altura máxima 250 cm'),
  activityLevel: z.enum([
    'sedentary',
    'light',
    'moderate',
    'active',
    'very_active',
  ]),
  goal: z.enum(['lose', 'maintain', 'gain']),
});

/**
 * Schema para login
 */
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

/**
 * Schema para perfil de usuario
 */
export const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  age: z.number().min(10).max(100).optional(),
  weight: z.number().min(30).max(300).optional(),
  height: z.number().min(100).max(250).optional(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']).optional(),
  goal: z.enum(['lose', 'maintain', 'gain']).optional(),
});

/**
 * Schema para registro de alimentos
 */
export const foodLogSchema = z.object({
  foodName: z.string().min(1, 'Nombre requerido'),
  calories: z.number().min(0, 'Calorías inválidas'),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  servingSize: z.number().min(1).max(10000).optional(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
  date: z.string().optional(),
  foodId: z.string().optional(),
  isCustom: z.boolean().optional(),
});

/**
 * Schema para registro de hidratación
 */
export const hydrationSchema = z.object({
  amountMl: z.number().min(50).max(2000),
});

/**
 * Schema para mensaje de chat
 */
export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
});

/**
 * Schema para código promocional
 */
export const promoCodeSchema = z.object({
  code: z.string().min(1).max(50),
});

// Tipos inferidos
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type FoodLogInput = z.infer<typeof foodLogSchema>;
export type HydrationInput = z.infer<typeof hydrationSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type PromoCodeInput = z.infer<typeof promoCodeSchema>;
