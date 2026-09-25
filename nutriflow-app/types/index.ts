// User and Authentication Types
export interface User {
  _id?: string;
  email: string;
  name: string;
  age: number;
  sex: 'male' | 'female';
  weight: number; // kg
  height: number; // cm
  activityLevel: ActivityLevel;
  goal: Goal;
  subscriptionPlan: 'free' | 'premium' | 'pro';
  subscriptionEnd?: Date;
  // Avatar
  avatarUrl?: string | null;
  avatarType?: 'initials' | 'preset' | 'custom' | null;
  // Banner
  bannerUrl?: string | null;
  bannerType?: 'preset' | 'custom' | null;
  // Nutritional data
  tdee?: number;
  bmr?: number;
  calorieGoal?: number;
  proteinGoal?: number;
  carbGoal?: number;
  fatGoal?: number;
  createdAt: Date;
  updatedAt: Date;
  referralCode?: string;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type Goal = 'lose' | 'maintain' | 'gain';

export interface UserProfile {
  tdee: number;
  bmr: number;
  calorieGoal: number;
  proteinGoal: number;
  carbGoal: number;
  fatGoal: number;
}

// Food Log Types
export interface FoodLog {
  _id?: string;
  userId: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  mealType: MealType;
  date: Date;
  isFromPhoto?: boolean;
  createdAt: Date;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: number;
}

// Exercise Types
export interface ExerciseSet {
  sets: number;
  reps: number;
  weightKg: number;
  durationMin?: number;
  rpe: number;
}

export interface ExerciseLog {
  _id?: string;
  userId: string;
  exerciseName: string;
  exerciseType: ExerciseType;
  muscleGroups: string[];
  setsData: ExerciseSet[];
  metValue: number;
  caloriesBurned: number;
  notes?: string;
  date: Date;
  createdAt: Date;
}

export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'hiit';

export interface Routine {
  _id?: string;
  userId: string;
  name: string;
  description?: string;
  dayOfWeek?: number;
  exercises: RoutineExercise[];
  isFavorite: boolean;
  createdAt: Date;
}

export interface RoutineExercise {
  exerciseName: string;
  muscleGroups: string[];
  defaultSets: number;
  defaultReps: number;
  defaultWeight?: number;
}

export interface ExerciseDefinition {
  _id?: string;
  name: string;
  description: string;
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  metValue: number;
  type: ExerciseType;
  instructions: string[];
  commonMistakes: string[];
}

// Article Types
export interface Article {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: ArticleCategory;
  isVerified: boolean;
  author?: ArticleAuthor;
  references?: string[];
  publishedAt: Date;
  updatedAt: Date;
  readTime: number;
}

export type ArticleCategory = 'nutrition' | 'exercise' | 'wellness' | 'supplements';

export interface ArticleAuthor {
  name: string;
  credentials: string;
  avatar?: string;
}

// Chat Types
export interface ChatMessage {
  _id?: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  date: Date;
  createdAt: Date;
}

export interface ChatUsage {
  userId: string;
  date: string;
  messageCount: number;
}

// Hydration Types
export interface HydrationLog {
  _id?: string;
  userId: string;
  amountMl: number;
  date: Date;
  createdAt: Date;
}

// Subscription Types
export interface SubscriptionPlan {
  id: 'free' | 'premium' | 'pro';
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId?: string;
}

export interface Subscription {
  _id?: string;
  userId: string;
  plan: 'free' | 'premium' | 'pro';
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
  referralCode?: string;
}

// Statistics Types
export interface DailyStats {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
  exercisesCompleted: number;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  dailyStats: DailyStats[];
  averages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
