'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Loader2, AlertCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Suspense } from 'react';
import { ParticlesBackground } from '@/components/ui/ParticlesBackground';

function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [dbError, setDbError] = React.useState(false);
  const [redirectTo, setRedirectTo] = React.useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [lockoutInfo, setLockoutInfo] = React.useState<{ lockedUntil?: number; remainingAttempts?: number } | null>(null);

  // Get redirect URL from query params on client side
  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get('redirect') || undefined;
    setRedirectTo(redirect);
  }, []);

  // Verificar conexión a la base de datos al cargar
  React.useEffect(() => {
    const checkDbConnection = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.status === 500) {
          setDbError(true);
        }
      } catch (err) {
        console.log('Error checking DB connection');
      }
    };
    checkDbConnection();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLockoutInfo(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      // Pass redirect URL to login function
      await login(email, password, redirectTo);
      // Navigation is handled by login() function
    } catch (err: any) {
      console.error('Login error:', err);
      setIsLoading(false);
      
      // Check if it's a lockout error
      if (err.message?.includes('Demasiados intentos')) {
        try {
          const errorData = JSON.parse(err.message.split('{')[1]?.split('}')[0]);
          setLockoutInfo({
            lockedUntil: errorData.lockedUntil,
            remainingAttempts: errorData.remainingAttempts,
          });
        } catch {
          setError(err.message || 'Demasiados intentos. Inténtalo más tarde.');
        }
      } else if (err.message?.includes('fetch') || err.message?.includes('network')) {
        setError('Error de conexión. Verifica que el servidor esté funcionando.');
      } else if (err.message?.includes('500')) {
        setError('Error del servidor. Verifica la configuración de la base de datos.');
        setDbError(true);
      } else {
        setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      }
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
      <ParticlesBackground />
      {/* Form Side */}
      <div className="flex-1 lg:max-w-lg lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 py-8 lg:p-12 z-10 bg-background/80 backdrop-blur-2xl border-r border-stone-200/50 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.1)]">
        <Card className="w-full shadow-none border-0 bg-transparent">
          <CardHeader className="space-y-3 px-0">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group w-fit">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 transition-transform group-hover:scale-105 shadow-md">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading text-xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                NutriFlow
              </span>
            </Link>
            <CardTitle className="text-3xl font-bold text-foreground">
              Bienvenido de nuevo
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Inicia sesión para continuar tu progreso.
            </CardDescription>
          </CardHeader>

          {/* Database Error Warning */}
          {dbError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    ⚠️ Problema de conexión
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    No se completó el chequeo a la BD. Revisa variables de entorno.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-0">
              {error && (
                <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{error}</p>
                    {lockoutInfo?.lockedUntil && (
                      <p className="text-xs mt-1 opacity-80">
                        Desbloqueado en: {new Date(lockoutInfo.lockedUntil).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    className="pl-10 h-12 rounded-xl transition-all focus:ring-2 focus:ring-emerald-500 bg-stone-50 border-stone-200"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-medium">Contraseña</Label>
                  <Link href="/forgot-password" university-mode="true" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="pl-10 pr-10 h-12 rounded-xl transition-all focus:ring-2 focus:ring-emerald-500 bg-stone-50 border-stone-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer py-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 bg-transparent"
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground select-none">Mantenme conectado</span>
              </label>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-6 px-0 pt-2">
              <Button 
                type="submit" 
                className="w-full btn-glow h-12 text-base rounded-xl" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold">
                  Crea una cuenta gratis
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      {/* Visual / Image Side */}
      <div className="hidden lg:flex flex-1 relative bg-stone-950 overflow-hidden items-center justify-center pointer-events-none">
        <div className="absolute inset-0 z-0 opacity-[0.80]">
          <Image src="/wellness-food.png" alt="NutriFlow Premium Background" fill className="object-cover" priority sizes="50vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent z-10" />
        
        <div className="relative z-20 p-12 max-w-lg text-center animate-fade-in-up mt-auto mb-20">
           <div className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 mb-6 shadow-2xl">
             <Leaf className="h-10 w-10 text-emerald-400" />
           </div>
           <h2 className="text-4xl font-heading font-bold text-white mb-4 tracking-tight">Tu Salud, Tu Reglas</h2>
           <p className="text-stone-300 text-lg leading-relaxed">
             Desbloquea el acceso a la plataforma más avanzada impulsada por IA. Hábitos, métricas y nutrición en perfecta armonía.
           </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 px-4">
        <div className="w-full max-w-md text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
