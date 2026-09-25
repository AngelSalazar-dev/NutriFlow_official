'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Check, X, Loader2, Sparkles, Ticket, AlertCircle } from 'lucide-react';
import { useLang } from '@/context/LangContext';

interface PromoCodeRedeemerProps {
  onSuccess?: (data: any) => void;
}

export function PromoCodeRedeemer({ onSuccess }: PromoCodeRedeemerProps) {
  const { tr } = useLang();
  const [code, setCode] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);
  const [validationResult, setValidationResult] = React.useState<any>(null);
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState('');

  const validateCode = async () => {
    if (!code.trim()) return;
    setIsValidating(true);
    setError('');
    setValidationResult(null);

    try {
      const response = await fetch(`/api/promo/redeem?code=${encodeURIComponent(code.trim())}`);
      const data = await response.json();
      if (response.ok) {
        setValidationResult(data);
      } else {
        setError(data.error || 'Código inválido');
      }
    } catch {
      setError('Error al validar código');
    } finally {
      setIsValidating(false);
    }
  };

  const redeemCode = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/promo/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        onSuccess?.(data);
      } else {
        setError(data.error || 'Error al canjear código');
      }
    } catch {
      setError('Error al canjear código');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setCode('');
    setResult(null);
    setValidationResult(null);
    setError('');
  };

  if (result) {
    return (
      <Card className="border-0 shadow-2xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center mx-auto border border-white/30">
            <Check className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-heading font-black tracking-tight">¡Código Canjeado!</h3>
            <p className="text-emerald-100 text-sm mt-1">Tu suscripción ha sido actualizada</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 space-y-2">
            <p className="text-sm"><strong>Plan:</strong> {result.plan === 'pro' ? tr('sub_plan_pro_name') : tr('sub_plan_premium_name')}</p>
            <p className="text-sm"><strong>Válido hasta:</strong> {new Date(result.expiresAt).toLocaleDateString()}</p>
          </div>
          <p className="text-sm text-emerald-100">{result.message}</p>
          <Button onClick={reset} className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-2xl h-12">
            Canjear otro código
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-2xl overflow-hidden rounded-[2rem]">
      {/* Header gradient */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-xl">
            <Ticket className="h-8 w-8" />
          </div>
          <div>
            <CardTitle className="text-2xl font-heading font-black tracking-tight">Código Promocional</CardTitle>
            <CardDescription className="text-purple-100 text-sm mt-0.5">¿Tienes un código? Obtén acceso gratis</CardDescription>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-5">
        {/* Code Input */}
        <div className="space-y-2">
          <div className="relative">
            <Gift className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Ingresa tu código aquí..."
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && validateCode()}
              disabled={isLoading || isValidating}
              className="pl-12 pr-4 h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-lg uppercase tracking-[0.2em] text-center font-mono focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 dark:text-slate-100 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Validate Button */}
        {!validationResult && !result && (
          <Button
            onClick={validateCode}
            disabled={!code.trim() || isValidating}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {isValidating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
            {isValidating ? 'Validando...' : 'Validar Código'}
          </Button>
        )}

        {/* Validation Result */}
        {validationResult && (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-emerald-800 dark:text-emerald-300">¡Código Válido!</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Listo para canjear</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-800">
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Plan</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {validationResult.plan === 'pro' ? tr('sub_plan_pro_name') : tr('sub_plan_premium_name')}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-800">
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Duración</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{validationResult.duration}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={redeemCode} disabled={isLoading} className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
                {isLoading ? 'Canjeando...' : 'Canjear Ahora'}
              </Button>
              <Button
                onClick={() => { setValidationResult(null); setCode(''); }}
                variant="outline"
                className="h-12 w-12 rounded-2xl border-slate-200 dark:border-slate-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
            <Button variant="ghost" size="sm" onClick={() => setError('')} className="ml-auto shrink-0 h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Tip */}
        {!validationResult && !result && !error && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-200 dark:border-violet-800">
            <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">
              <strong className="text-violet-900 dark:text-violet-200">💡 Tip:</strong> Sigue nuestras redes sociales para obtener códigos gratuitos.
              También puedes invitar amigos con tu código de referido.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PromoCodeRedeemer;
