'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Loader2, AlertCircle, Eye, EyeOff, Mail, Lock, Heart, Dumbbell, Activity, Zap, Target } from 'lucide-react';
import { Suspense } from 'react';
import { ParticlesBackground } from '@/components/ui/ParticlesBackground';
import { useLang } from '@/context/LangContext';
import { ThemeLangToggle } from '@/components/ui/ThemeLangToggle';

function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { tr, lang } = useLang();
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
        setError(lang === 'es' ? 'Error de conexión. Verifica que el servidor esté funcionando.' : 'Connection error. Check that the server is running.');
      } else if (err.message?.includes('500')) {
        setError(tr('auth_db_error'));
        setDbError(true);
      } else {
        setError(err.message || tr('auth_db_error'));
      }
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
      <ParticlesBackground />
      {/* Form Side */}
      <div className="flex-1 lg:max-w-lg lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 py-8 lg:p-12 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)]">
        <Card className="w-full shadow-none border-0 bg-transparent">
          <CardHeader className="space-y-4 px-0">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 transition-all group-hover:scale-110 shadow-lg shadow-emerald-500/20">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="font-heading text-2xl font-black bg-gradient-to-r from-emerald-700 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
                  NutriFlow
                </span>
              </Link>
              <ThemeLangToggle />
            </div>
            
            <CardTitle className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none">
              {tr('auth_welcome_back')}
            </CardTitle>
            <CardDescription className="text-base text-slate-500 dark:text-slate-400 font-medium">
              {tr('auth_login_subtitle')}
            </CardDescription>
          </CardHeader>

          {/* Database Error Warning */}
          {dbError && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl animate-fade-in">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-1" />
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-amber-900 dark:text-amber-400">
                    {tr('auth_db_error')}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-500 mt-1 font-medium leading-relaxed">
                    {tr('auth_db_error_desc')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-0">
              {error && (
                <div className="p-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/40 flex items-start gap-3 animate-fade-in-up">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold">{error}</p>
                    {lockoutInfo?.lockedUntil && (
                      <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">
                        {tr('auth_unlocked_at')} {new Date(lockoutInfo.lockedUntil).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">{tr('auth_email')}</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors">
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
                    className="pl-12 h-14 rounded-2xl transition-all focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
              
              <div className="space-y-2.5">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{tr('auth_password')}</Label>
                  <Link href="/forgot-password" university-mode="true" className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-black uppercase tracking-widest transition-all">
                    {tr('auth_forgot')}
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="pl-12 pr-12 h-14 rounded-2xl transition-all focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-emerald-500 transition-colors"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-4 cursor-pointer py-3 group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-lg border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 h-5 w-5 bg-transparent transition-all"
                  disabled={isLoading}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest select-none group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{tr('auth_remember')}</span>
              </label>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-8 px-0 pt-4">
              <Button 
                type="submit" 
                className="w-full h-16 text-sm font-black uppercase tracking-[0.2em] rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/20 border-0 hover:scale-[1.02] active:scale-[0.98] transition-all" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    {tr('auth_loading')}
                  </>
                ) : (
                  tr('auth_login')
                )}
              </Button>
              
              <div className="text-center text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {tr('auth_no_account')}{' '}
                <Link href="/register" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline decoration-emerald-500/30 underline-offset-4 transition-all">
                  {tr('auth_create_account')}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      {/* Visual / Image Side */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center pointer-events-none">
        {/* Realistic background image with Next.js optimization */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/auth-real-bg.png" 
            alt="Healthy Lifestyle" 
            className="w-full h-full object-cover"
          />
          {/* Grainy texture overlay for premium feel */}
          <div className="absolute inset-0 bg-emerald-950/40 mix-blend-multiply opacity-50" />
        </div>

        {/* Animated health/fitness themed background elements (Subtle) */}
        <div className="absolute inset-0 z-10">
          {/* Large decorative circles for depth */}
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/20 blur-[150px] animate-pulse [animation-delay:2s]" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        
        {/* Gradient overlay for text protection */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-teal-950/40 to-transparent z-20" />

        <div className="relative z-20 p-16 max-w-xl text-center animate-fade-in-up mt-auto mb-20 space-y-8">
           <div className="inline-flex p-6 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 mb-2 shadow-2xl animate-float">
             <Leaf className="h-12 w-12 text-emerald-400" />
           </div>
           <h2 className="text-5xl font-heading font-black text-white mb-6 tracking-tighter leading-none">{tr('auth_health_rules')}</h2>
           <p className="text-slate-300 text-xl leading-relaxed font-light">
             {tr('auth_health_rules_desc')}
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
