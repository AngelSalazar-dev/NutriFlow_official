import { ActivityLevel, Goal, UserProfile } from '@/types';

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
 */
export function calculateBMR(weight: number, height: number, age: number, sex: 'male' | 'female'): number {
  // BMR = 10×weight + 6.25×height − 5×age + 5 (men)
  // BMR = 10×weight + 6.25×height − 5×age − 161 (women)
  const baseBmr = 10 * weight + 6.25 * height - 5 * age;
  return sex === 'male' ? baseBmr + 5 : baseBmr - 161;
}

/**
 * Get activity level multiplier
 */
export function getActivityMultiplier(activityLevel: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Hard exercise 6-7 days/week
    very_active: 1.9,    // Very hard exercise & physical job
  };
  return multipliers[activityLevel];
}

/**
 * Calculate Total Daily Energy Expenditure
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * getActivityMultiplier(activityLevel));
}

/**
 * Calculate calorie goal based on user's goal
 */
export function calculateCalorieGoal(tdee: number, goal: Goal): number {
  switch (goal) {
    case 'lose':
      return tdee - 500;  // 500 kcal deficit for ~0.5kg/week loss
    case 'gain':
      return tdee + 300;  // 300 kcal surplus for lean mass gain
    case 'maintain':
    default:
      return tdee;
  }
}

/**
 * Calculate macronutrient goals based on calorie goal
 * Using balanced macro split: 30% protein, 40% carbs, 30% fat
 */
export function calculateMacros(calorieGoal: number, weight: number): {
  protein: number;
  carbs: number;
  fat: number;
} {
  // Protein: 1.6-2.2g per kg body weight (using 2g for active individuals)
  const proteinGrams = Math.round(weight * 2);
  const proteinCalories = proteinGrams * 4;
  
  // Fat: 25-35% of total calories (using 30%)
  const fatCalories = Math.round(calorieGoal * 0.3);
  const fatGrams = Math.round(fatCalories / 9);
  
  // Carbs: remaining calories
  const carbCalories = calorieGoal - proteinCalories - fatCalories;
  const carbGrams = Math.round(carbCalories / 4);
  
  return {
    protein: proteinGrams,
    carbs: carbGrams,
    fat: fatGrams,
  };
}

/**
 * Calculate complete user profile with all nutritional data
 */
export function calculateUserProfile(
  weight: number,
  height: number,
  age: number,
  sex: 'male' | 'female',
  activityLevel: ActivityLevel,
  goal: Goal
): UserProfile {
  const bmr = calculateBMR(weight, height, age, sex);
  const tdee = calculateTDEE(bmr, activityLevel);
  const calorieGoal = calculateCalorieGoal(tdee, goal);
  const macros = calculateMacros(calorieGoal, weight);
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieGoal,
    proteinGoal: macros.protein,
    carbGoal: macros.carbs,
    fatGoal: macros.fat,
  };
}

/**
 * Calculate calories burned using MET value
 * Calories = MET × weight(kg) × duration(hours)
 */
export function calculateCaloriesBurned(met: number, weightKg: number, durationMinutes: number): number {
  const durationHours = durationMinutes / 60;
  return Math.round(met * weightKg * durationHours * 10) / 10;
}

/**
 * Calculate total volume (sets × reps × weight)
 */
export function calculateVolume(sets: number, reps: number, weight: number): number {
  return sets * reps * weight;
}

/**
 * Estimate 1 Rep Max using Epley formula
 * 1RM = weight × (1 + reps/30)
 */
export function estimateOneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Format date to YYYY-MM-DD for database queries
 */
export function formatDateKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get start and end of week for a given date
 */
export function getWeekRange(date: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

/**
 * Check if subscription is active and not expired
 */
export function isSubscriptionActive(
  plan: 'free' | 'premium' | 'pro',
  endDate?: Date
): boolean {
  if (plan === 'free') return true;
  if (!endDate) return false;
  return new Date(endDate) > new Date();
}

/**
 * Get daily chat message limit based on subscription plan
 */
export function getChatLimit(plan: 'free' | 'premium' | 'pro'): number {
  switch (plan) {
    case 'free':
      return 5;
    case 'premium':
    case 'pro':
      return -1; // Unlimited
  }
}

/**
 * Format number with commas for display
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Calculate BMI (Body Mass Index)
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}
