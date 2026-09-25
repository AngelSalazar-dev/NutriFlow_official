'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);

  // Validate password in real-time
  React.useEffect(() => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener una minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener un número');
    }

    setValidationErrors(errors);
  }, [password]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!token) {
      setError('Token no proporcionado');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (validationErrors.length > 0) {
      setError('Contraseña débil: ' + validationErrors.join(', '));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al restablecer la contraseña');
      }

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Error al restablecer la contraseña');
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-stone-50 to-teal-50 px-4 py-8">
        <Card className="w-full max-w-md shadow-2xl border-emerald-200/50">
          <CardHeader className="space-y-3">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
              ¡Contraseña restablecida!
            </CardTitle>
            <CardDescription className="text-center text-stone-600">
              Tu contraseña ha sido actualizada exitosamente
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-emerald-800">
                ✅ Serás redirigido al login en unos segundos...
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              onClick={() => router.push('/login')}
              className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 transition-all"
            >
              Ir al login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-stone-50 to-teal-50 px-4 py-8">
        <Card className="w-full max-w-md shadow-2xl border-emerald-200/50">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl text-center text-red-600">
              Token inválido
            </CardTitle>
            <CardDescription className="text-center text-stone-600">
              El enlace de restablecimiento no es válido o ha expirado
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button 
              onClick={() => router.push('/forgot-password')}
              className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 transition-all"
            >
              Solicitar nuevo enlace
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-stone-50 to-teal-50 px-4 py-8">
      <Card className="w-full max-w-md shadow-2xl border-emerald-200/50">
        <CardHeader className="space-y-3">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600">
              <Lock className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
            Nueva contraseña
          </CardTitle>
          <CardDescription className="text-center text-stone-600">
            Ingresa tu nueva contraseña
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="transition-all focus:ring-2 focus:ring-emerald-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600 transition-colors"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && validationErrors.length > 0 && (
                <div className="text-xs text-amber-600 space-y-1">
                  {validationErrors.map((err, idx) => (
                    <p key={idx}>⚠️ {err}</p>
                  ))}
                </div>
              )}
              {password && validationErrors.length === 0 && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Contraseña segura
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="transition-all focus:ring-2 focus:ring-emerald-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600 transition-colors"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-600">⚠️ Las contraseñas no coinciden</p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Las contraseñas coinciden
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 transition-all" 
              disabled={isLoading || validationErrors.length > 0 || password !== confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restableciendo...
                </>
              ) : (
                'Restablecer contraseña'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-stone-50 to-teal-50 px-4">
        <div className="w-full max-w-md text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
