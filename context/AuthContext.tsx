'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  isPro: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  updateAvatar: (avatarType: 'initials' | 'preset' | 'custom', avatarUrl?: string, targetType?: 'avatar' | 'banner') => Promise<void>;
  checkChatLimit: () => Promise<{ allowed: boolean; remaining: number; limit: number; used: number }>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (err) {
      console.log('No hay sesión activa');
    } finally {
      setIsLoading(false);
    }
  };

  const login = React.useCallback(async (email: string, password: string, redirectTo?: string) => {
    const normalizedEmail = email.replace(/\s+/g, '').toLowerCase();
    console.log('[AuthContext] Login attempt:', { email: normalizedEmail, passwordLength: password.length });
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('[AuthContext] Login failed:', data, 'Status:', res.status);
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      const data = await res.json();
      console.log('[AuthContext] Login success:', data.user?.email);
      setUser(data.user);

      const redirectUrl = redirectTo || '/dashboard';
      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        console.error('[AuthContext] Fetch failed - Is the server running?');
        throw new Error('No se pudo conectar con el servidor. Verifica que el servidor de desarrollo esté funcionando.');
      }
      console.error('[AuthContext] Login error:', err);
      throw err;
    }
  }, [router]);

  const register = React.useCallback(async (data: any) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al registrar');
    }

    const result = await res.json();
    setUser(result.user);

    router.push('/dashboard');
    router.refresh();
  }, [router]);

  const logout = React.useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    router.push('/');
    router.refresh();
  }, [router]);

  const updateUser = React.useCallback(async (data: Partial<User>) => {
    if (!user) return;

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('[AuthContext] Update profile failed:', errorData);
        throw new Error(errorData.error || 'Error al actualizar');
      }

      const result = await res.json();
      setUser(result.user);
    } catch (err: any) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar con el servidor. Verifica que el servidor esté funcionando.');
      }
      console.error('[AuthContext] Update profile error:', err);
      throw err;
    }
  }, [user]);

  const updateAvatar = React.useCallback(async (avatarType: 'initials' | 'preset' | 'custom', avatarUrl?: string, targetType: 'avatar' | 'banner' = 'avatar') => {
    const res = await fetch(targetType === 'banner' ? '/api/user/banner' : '/api/user/avatar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarType, avatarUrl }),
      credentials: 'include',
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Error al actualizar ${targetType === 'banner' ? 'banner' : 'avatar'}`);
    }

    // Update user state directly
    if (targetType === 'banner') {
      setUser((prev) => prev ? { ...prev, bannerType: avatarType as 'preset' | 'custom' | null, bannerUrl: avatarUrl ?? null } : null);
    } else {
      setUser((prev) => prev ? { ...prev, avatarType, avatarUrl } : null);
    }
  }, []);

  const isPremium = user?.subscriptionPlan === 'premium' || user?.subscriptionPlan === 'pro';
  const isPro = user?.subscriptionPlan === 'pro';

  const checkChatLimit = React.useCallback(async () => {
    try {
      const res = await fetch('/api/chat/limit', {
        credentials: 'include',
      });
      if (!res.ok) {
        return { allowed: false, remaining: 0, limit: 15, used: 15 };
      }
      const data = await res.json();
      return {
        allowed: data.allowed,
        remaining: data.remaining,
        limit: data.limit,
        used: data.used,
      };
    } catch (error) {
      console.error('Error checking chat limit:', error);
      return { allowed: false, remaining: 0, limit: 15, used: 15 };
    }
  }, []);

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
    updateAvatar,
    checkChatLimit,
  }), [user, isLoading, isPremium, isPro, login, register, logout, updateUser, updateAvatar, checkChatLimit]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
