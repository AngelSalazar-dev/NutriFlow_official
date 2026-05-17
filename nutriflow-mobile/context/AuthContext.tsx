import * as React from 'react';
import { router } from 'expo-router';
import api from '../lib/api';
import { saveToken, deleteToken, getToken } from '../lib/storage';

export interface User {
  _id: string;
  email: string;
  name: string;
  age?: number;
  sex?: 'male' | 'female';
  weight?: number;
  height?: number;
  activityLevel?: string;
  goal?: string;
  subscriptionPlan?: 'free' | 'premium' | 'pro';
  calorieGoal?: number;
  tdee?: number;
  bmr?: number;
  avatarUrl?: string;
  avatarType?: string;
  bannerUrl?: string;
  bannerType?: string;
  createdAt?: string;
  referralCode?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  isPro: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      const res = await api.get('/auth/me');
      if (res.data && res.data.user) {
        // En Next.js el id viene como id o _id. Nos aseguramos de mapearlo
        const u = res.data.user;
        setUser({
          ...u,
          _id: u._id || u.id,
        });
      } else {
        await deleteToken();
      }
    } catch (err) {
      console.log('[Mobile Auth] No hay sesión activa o falló la red:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.replace(/\s+/g, '').toLowerCase();
    try {
      const res = await api.post('/auth/login', { email: normalizedEmail, password });
      const data = res.data;
      
      if (data.token || data.session || data.user) {
        // Asumiendo que el login devuelve el token en la respuesta
        const token = data.token || data.user?.token; 
        if (token) {
          await saveToken(token);
        }
        
        const u = data.user;
        setUser({
          ...u,
          _id: u._id || u.id,
        });
        
        // Redirigir a Dashboard principal
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al iniciar sesión';
      throw new Error(errorMsg);
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await api.post('/auth/register', formData);
      const data = res.data;
      
      if (data.user) {
        const token = data.token || data.user?.token;
        if (token) {
          await saveToken(token);
        }
        
        const u = data.user;
        setUser({
          ...u,
          _id: u._id || u.id,
        });
        
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al registrarse';
      throw new Error(errorMsg);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.log('Error haciendo logout en el backend:', e);
    } finally {
      await deleteToken();
      setUser(null);
      router.replace('/login');
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const res = await api.put('/auth/profile', data);
      if (res.data && res.data.user) {
        const u = res.data.user;
        setUser({
          ...u,
          _id: u._id || u.id,
        });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al actualizar perfil';
      throw new Error(errorMsg);
    }
  };

  const isPremium = user?.subscriptionPlan === 'premium' || user?.subscriptionPlan === 'pro';
  const isPro = user?.subscriptionPlan === 'pro';

  const contextValue = React.useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    isPremium,
    isPro,
    login,
    register,
    logout,
    updateUser,
  }), [user, isLoading, isPremium, isPro]);

  return (
    <AuthContext.Provider value={contextValue}>
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
