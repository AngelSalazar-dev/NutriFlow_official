'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Loader2, Mail, ArrowLeft, CheckCircle, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { ParticlesBackground } from '@/components/ui/ParticlesBackground';

export default function ForgotPasswordPage() {
  const { tr, lang } = useLang();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [email, setEmail] = React.useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar la solicitud');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
        <ParticlesBackground />
        {/* Gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/15 to-teal-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-fuchsia-400/10 to-purple-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Left side — Visual */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center pointer-events-none">
          <div className="absolute inset-0 z-0">
            <img src="/auth-real-bg.png" alt="Healthy Lifestyle" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-emerald-950/40 mix-blend-multiply opacity-50" />
          </div>
          <div className="absolute inset-0 z-10">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/20 blur-[150px] animate-pulse [animation-delay:2s]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-teal-950/40 to-transparent z-20" />
          <div className="relative z-20 p-16 max-w-xl text-center animate-fade-in-up mt-auto mb-20 space-y-8">
            <div className="inline-flex p-6 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 mb-2 shadow-2xl animate-float">
              <Shield className="h-12 w-12 text-emerald-400" />
            </div>
            <h2 className="text-4xl font-heading font-black text-white mb-4 tracking-tighter leading-none">
              {lang === 'es' ? 'Seguridad ante todo' : 'Security first'}
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed font-light">
              {lang === 'es' ? 'Tu enlace de recuperación es único y expira en 1 hora por tu seguridad.' : 'Your recovery link is unique and expires in 1 hour for your security.'}
            </p>
          </div>
        </div>

        {/* Right side — Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl">
            <CardHeader className="space-y-4 px-0">
              <div className="flex justify-center mb-2">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl text-center text-slate-900 dark:text-slate-100 tracking-tighter">
                {lang === 'es' ? '¡Email enviado!' : 'Email sent!'}
              </CardTitle>
              <CardDescription className="text-center text-slate-500 dark:text-slate-400 font-medium">
                {lang === 'es'
                  ? 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña'
                  : 'If the email is registered, you will receive a link to reset your password'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 px-0">
              <div className="mx-6 p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                      {lang === 'es' ? 'Revisa tu bandeja de entrada' : 'Check your inbox'}
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-medium">
                      {lang === 'es'
                        ? 'El enlace expirará en 1 hora por seguridad. Revisa también la carpeta de spam.'
                        : 'The link will expire in 1 hour for security. Also check your spam folder.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="px-0 pt-4">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full h-14 rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-all duration-300">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {tr('auth_login')}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
      <ParticlesBackground />
      {/* Gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/15 to-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-fuchsia-400/10 to-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Left side — Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center pointer-events-none">
        <div className="absolute inset-0 z-0">
          <img src="/auth-real-bg.png" alt="Healthy Lifestyle" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-emerald-950/40 mix-blend-multiply opacity-50" />
        </div>
        <div className="absolute inset-0 z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/20 blur-[150px] animate-pulse [animation-delay:2s]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-teal-950/40 to-transparent z-20" />
        <div className="relative z-20 p-16 max-w-xl text-center animate-fade-in-up mt-auto mb-20 space-y-8">
          <div className="inline-flex p-6 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 mb-2 shadow-2xl animate-float">
            <Sparkles className="h-12 w-12 text-emerald-400" />
          </div>
          <h2 className="text-4xl font-heading font-black text-white mb-4 tracking-tighter leading-none">
            {lang === 'es' ? 'Recupera tu acceso' : 'Regain your access'}
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed font-light">
            {lang === 'es'
              ? 'Te enviaremos un enlace seguro para restablecer tu contraseña en segundos.'
              : 'We will send you a secure link to reset your password in seconds.'}
          </p>
        </div>
      </div>

      {/* Right side — Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl">
          <CardHeader className="space-y-4 px-0">
            <div className="flex items-center justify-between mb-2">
              <Link href="/login" className="inline-flex items-center gap-2 group">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 transition-all group-hover:scale-110 shadow-lg shadow-emerald-500/20">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="font-heading text-xl font-black bg-gradient-to-r from-emerald-700 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
                  NutriFlow
                </span>
              </Link>
            </div>
            <div className="flex justify-center mb-2">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <Mail className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center text-slate-900 dark:text-slate-100 tracking-tighter">
              {lang === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot your password?'}
            </CardTitle>
            <CardDescription className="text-center text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'es'
                ? 'Ingresa tu email y te enviaremos un enlace para restablecerla'
                : 'Enter your email and we will send you a link to reset it'}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-0">
              {error && (
                <div className="p-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/40 flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 dark:text-red-400 text-xs font-bold">!</span>
                  </div>
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">
                  {tr('auth_email')}
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    className="pl-12 h-14 rounded-2xl transition-all focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 px-0 pt-4">
              <Button
                type="submit"
                className="w-full h-16 text-sm font-bold rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/20 border-0 hover:scale-[1.02] active:scale-[0.98] transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    {lang === 'es' ? 'Enviando...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    {lang === 'es' ? 'Enviar enlace de recuperación' : 'Send recovery link'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full h-14 rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-all duration-300">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {tr('auth_login')}
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
