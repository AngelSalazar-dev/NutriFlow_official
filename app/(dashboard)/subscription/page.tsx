'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles, Zap, Gift, Users } from 'lucide-react';
import { PromoCodeRedeemer } from '@/components/features/PromoCodeRedeemer';
import { ReferralProgram } from '@/components/features/ReferralProgram';

const PLANS = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    description: 'Ideal para comenzar',
    features: [
      'Todos los artículos (con anuncios)',
      'Registro manual de alimentos',
      'Seguimiento de calorías y macros',
      'Seguimiento de hidratación',
      'Historial de 14 días',
      'Chat IA: 10 mensajes/día',
      'Calculadora de calorías diarias',
      'Exportar datos CSV básico',
      'Recordatorios de agua',
    ],
    cta: 'Plan actual',
    highlighted: false,
    icon: null,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    description: 'Para usuarios comprometidos',
    features: [
      'Todo lo del plan gratuito (sin anuncios)',
      'Reconocimiento de alimentos por IA',
      'Chat IA ilimitado',
      'Estadísticas avanzadas (30 días)',
      'Recomendaciones personalizadas',
      'Artículos verificados por expertos',
      'Módulo de ejercicio completo',
      'Badges y logros',
      'Soporte por email',
    ],
    cta: 'Actualizar a Premium',
    highlighted: true,
    icon: Crown,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    description: 'Para atletas y deportistas',
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
      'Sesiones de coaching mensual',
    ],
    cta: 'Obtener Pro',
    highlighted: false,
    icon: Sparkles,
  },
];

export default function SubscriptionPage() {
  const { user, isPremium, isPro } = useAuth();
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setIsLoading(planId);

    try {
      const response = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ planId }),
      });

      if (response.ok) {
        const data = await response.json();
        // Simulation mode: no redirect, just reload
        if (data.simulated) {
          alert(`✅ ${data.message}\n\nPlan ${planId} activado exitosamente.`);
          window.location.reload();
        } else if (data.url) {
          // Real Stripe checkout
          window.location.href = data.url;
        }
      } else {
        const err = await response.json().catch(() => ({}));
        alert(`Error: ${err.error || 'No se pudo procesar la suscripción'}`);
      }
    } catch (error) {
      console.error('[SUBSCRIPTION] Error creating checkout:', error);
      alert('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(null);
    }
  };

  const currentPlan = user?.subscriptionPlan || 'free';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Planes de Suscripción</h1>
          <p className="text-stone-500 mt-2">
            Elige el plan perfecto para tus objetivos de salud
          </p>
        </div>

        {/* Current Plan Info */}
        {currentPlan !== 'free' && (
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-emerald-700" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">
                    Tu plan actual: <span className="capitalize">{currentPlan}</span>
                  </p>
                  <p className="text-xs text-emerald-700">
                    {currentPlan === 'premium' ? 'Acceso completo al módulo de ejercicio y más' : 'Todas las funciones avanzadas desbloqueadas'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.id;

            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.highlighted
                    ? 'border-emerald-600 shadow-lg scale-105'
                    : 'border-stone-200'
                } ${isCurrentPlan ? 'ring-2 ring-emerald-600' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-600 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Más popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  {Icon && (
                    <Icon className="h-10 w-10 text-emerald-700 mx-auto mb-2" />
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-bold">Gratis</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-stone-500">/mes</span>
                      </>
                    )}
                  </div>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                        <span className="text-stone-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.highlighted ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCurrentPlan || isLoading === plan.id}
                  >
                    {isLoading === plan.id ? 'Procesando...' : isCurrentPlan ? 'Plan actual' : plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">¿Puedo cancelar en cualquier momento?</h3>
              <p className="text-sm text-stone-600">
                Sí, puedes cancelar tu suscripción cuando quieras. Mantendrás acceso hasta el final de tu período de facturación.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">¿Hay un período de prueba?</h3>
              <p className="text-sm text-stone-600">
                Ofrecemos 7 días de prueba gratuita para el plan Premium. El plan Pro no tiene período de prueba pero incluye garantía de devolución de 14 días.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">¿Qué métodos de pago aceptan?</h3>
              <p className="text-sm text-stone-600">
                Aceptamos todas las tarjetas de crédito y débito principales a través de Stripe, así como PayPal en algunos países.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Free Access Options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <PromoCodeRedeemer />
          <ReferralProgram />
        </div>

        {/* Free Access Info */}
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Gift className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-purple-900">¿Quieres Premium Gratis?</CardTitle>
            </div>
            <CardDescription className="text-purple-700">
              Tenemos varias formas de obtener acceso Premium sin costo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎁</span>
                  <strong className="text-purple-900">Códigos Promocionales</strong>
                </div>
                <p className="text-sm text-purple-700">
                  Sigue nuestras redes sociales (@NutriFlow) donde publicamos códigos regularmente.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  <strong className="text-purple-900">Programa de Referidos</strong>
                </div>
                <p className="text-sm text-purple-700">
                  Invita amigos y gana hasta Premium Lifetime. ¡Ellos también obtienen 7 días gratis!
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  <strong className="text-purple-900">Plan Estudiantes</strong>
                </div>
                <p className="text-sm text-purple-700">
                  Si eres estudiante, contáctanos para obtener descuentos especiales o acceso gratuito.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
