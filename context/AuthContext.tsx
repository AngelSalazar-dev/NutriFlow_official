'use client';

import * as React from 'react';
import { User, SubscriptionPlan } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  isPro: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  checkChatLimit: () => Promise<{ allowed: boolean; remaining: number; limit: number; used: number }>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  age: number;
  sex: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      'Todos los artículos (con anuncios)',
      'Registro manual de alimentos',
      'Seguimiento de calorías y macros',
      'Seguimiento de hidratación',
      'Historial de 7 días',
      'Chat IA: 5 mensajes/día',
      'Calculadora de calorías diarias',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Todo lo del plan gratuito (sin anuncios)',
      'Reconocimiento de alimentos por IA',
      'Chat IA ilimitado',
      'Estadísticas avanzadas (30 días)',
      'Recomendaciones personalizadas',
      'Artículos verificados por expertos',
      'Módulo de ejercicio completo',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Todo lo del plan Premium',
      'Planes de entrenamiento con IA',
      'Análisis nutricional detallado',
      'Integración con wearables',
      'Historial ilimitado',
      'Planes de alimentación con IA',
      'Seguimiento de progreso corporal',
      'Exportación de datos PDF/CSV',
      'Soporte prioritario',
    ],
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Login failed');
    }

    const data = await response.json();
    setUser(data.user);
    router.push('/dashboard');
  };

  const register = async (data: RegisterData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const resData = await response.json();
      throw new Error(resData.error || 'Registration failed');
    }

    const resData = await response.json();
    setUser(resData.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;

    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const resData = await response.json();
      throw new Error(resData.error || 'Update failed');
    }

    const resData = await response.json();
    setUser(resData.user);
  };

  const checkChatLimit = async () => {
    const response = await fetch('/api/chat/limit');
    if (!response.ok) {
      return { allowed: false, remaining: 0, limit: 5 };
    }
    return await response.json();
  };

  const isPremium = user?.subscriptionPlan === 'premium' || user?.subscriptionPlan === 'pro';
  const isPro = user?.subscriptionPlan === 'pro';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isPremium,
        isPro,
        login,
        register,
        logout,
        updateUser,
        checkChatLimit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { PLANS };
