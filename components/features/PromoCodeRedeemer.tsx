'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Check, X, Loader2, Sparkles } from 'lucide-react';
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
    } catch (err) {
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
    } catch (err) {
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
      <Card className="border-emerald-200 bg-emerald-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-600">
              <Check className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-emerald-900">¡Código Canjeado!</CardTitle>
              <CardDescription className="text-emerald-700">
                Tu suscripción ha sido actualizada
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-800 mb-2">
            <strong>Plan:</strong> {result.plan === 'pro' ? tr('sub_plan_pro_name') : tr('sub_plan_premium_name')}
          </p>
          <p className="text-sm text-emerald-800">
            <strong>Válido hasta:</strong> {new Date(result.expiresAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-emerald-700 mt-4">
            {result.message}
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={reset} variant="outline" className="w-full">
            Canjear otro código
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-600">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Canjear Código Promocional</CardTitle>
            <CardDescription>
              ¿Tienes un código? Obtén acceso Premium gratis
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="promo-code">Código promocional</Label>
          <div className="flex gap-2">
            <Input
              id="promo-code"
              placeholder="Ej: BETA100, EARLYBIRD"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && validateCode()}
              disabled={isLoading || isValidating}
              className="uppercase tracking-wider"
            />
            {!validationResult && (
              <Button
                onClick={validateCode}
                disabled={!code.trim() || isValidating}
                variant="outline"
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Validar'
                )}
              </Button>
            )}
          </div>
        </div>

        {validationResult && (
          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium">Código válido</span>
            </div>
            <div className="text-sm text-stone-600">
              <p><strong>Plan:</strong> {validationResult.plan === 'pro' ? tr('sub_plan_pro_name') : tr('sub_plan_premium_name')}</p>
              <p><strong>Duración:</strong> {validationResult.duration}</p>
              <p><strong>Usos restantes:</strong> {validationResult.usesRemaining}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={redeemCode} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Canjeando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Canjear Código
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setValidationResult(null);
                  setCode('');
                }}
                variant="outline"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Info box */}
        {!validationResult && !error && (
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Sigue nuestras redes sociales para obtener códigos promocionales gratuitos.
              También puedes ganar Premium invitando amigos con tu código de referido único.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PromoCodeRedeemer;
