'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles, Zap, Gift, Users, Shield, CreditCard, Clock, Calendar, AlertCircle, ArrowRight, TrendingUp, Receipt, Download, XCircle, Loader2 } from 'lucide-react';
import { PromoCodeRedeemer } from '@/components/features/PromoCodeRedeemer';
import { ReferralProgram } from '@/components/features/ReferralProgram';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/cn';

const PayPalCheckout = dynamic(
  () => import('@/components/ui/paypal-checkout').then((mod) => mod.PayPalCheckout),
  { ssr: false, loading: () => (
    <div className="flex flex-col items-center justify-center py-6 space-y-3">
      <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
      <div className="text-center text-sm font-bold text-slate-500 dark:text-slate-400">
        {window.localStorage.getItem('nutriflow_lang') === 'es' ? 'Cargando pasarela segura...' : 'Loading secure gateway...'}
      </div>
    </div>
  ) }
);

export default function SubscriptionPage() {
  const router = useRouter();
  const { user, isPremium, isPro } = useAuth();
  const { tr, lang } = useLang();

  // Helper to map plan IDs to translated names
  const getPlanName = (planId: string) => {
    const planMap: Record<string, string> = {
      free: tr('sub_plan_free_name'),
      premium: tr('sub_plan_premium_name'),
      pro: tr('sub_plan_pro_name'),
    };
    return planMap[planId] || planId;
  };

  const PLANS = [
    {
      id: 'free',
      name: tr('sub_plan_free_name') || 'Gratis',
      price: 0,
      description: tr('sub_plan_free_desc') || 'Ideal para comenzar',
      features: [
        'food_log_title',
        'food_kcal',
        'sub_feature_chat_limit',
        'dash_no_weekly_data',
        'ex_add_success',
        'nav_history',
      ].map(k => tr(k as keyof typeof import('@/lib/translations').default.en) || k),
      cta: tr('sub_current_plan') || 'Plan actual',
      highlighted: false,
      icon: null,
    },
    {
      id: 'premium',
      name: tr('sub_plan_premium_name') || 'Premium',
      price: 9.99,
      description: tr('sub_plan_premium_desc') || 'Para usuarios comprometidos',
      features: [
        'sub_feature_no_ads',
        'food_add_photo',
        'sub_feature_chat_unlimited',
        'dash_stat_streak',
        'sub_feature_expert_articles',
        'nav_exercise',
      ].map(k => tr(k as keyof typeof import('@/lib/translations').default.en) || k),
      cta: tr('sub_upgrade_premium') || 'Actualizar a Premium',
      highlighted: true,
      icon: Crown,
    },
    {
      id: 'pro',
      name: tr('sub_plan_pro_name') || 'Pro',
      price: 19.99,
      description: tr('sub_plan_pro_desc') || 'Para atletas y deportistas',
      features: [
        'sub_feature_all_premium',
        'sub_feature_ai_training',
        'sub_feature_detailed_nutrition',
        'sub_feature_wearables',
        'sub_feature_unlimited_history',
        'sub_feature_priority_support',
      ].map(k => tr(k as keyof typeof import('@/lib/translations').default.en) || k),
      cta: tr('sub_get_pro') || 'Obtener Pro',
      highlighted: false,
      icon: Sparkles,
    },
  ];

  const [isLoading, setIsLoading] = React.useState<string | null>(null);
  const [subData, setSubData] = React.useState<any>(null);
  const [subLoading, setSubLoading] = React.useState(true);
  const [isCanceling, setIsCanceling] = React.useState(false);

  React.useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    setSubLoading(true);
    try {
      const res = await fetch('/api/subscriptions/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSubData(data);
      }
    } catch (error) {
      console.error('[SUB] Error loading:', error);
    } finally {
      setSubLoading(false);
    }
  };

  const currentPlan = user?.subscriptionPlan || 'free';
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = React.useState(false);
  const [planChangeConfirm, setPlanChangeConfirm] = React.useState<{ show: boolean; newPlan: string; isUpgrade: boolean } | null>(null);
  const [isProcessingChange, setIsProcessingChange] = React.useState(false);

  const handlePlanSelect = async (planId: string) => {
    // If user already has a paid plan, show confirmation dialog
    if (currentPlan !== 'free' && currentPlan !== planId) {
      const isUpgrade = (currentPlan === 'premium' && planId === 'pro') || 
                        (currentPlan === 'free' && (planId === 'premium' || planId === 'pro'));
      setPlanChangeConfirm({ show: true, newPlan: planId, isUpgrade });
      return;
    }
    // Otherwise, proceed directly to payment
    setSelectedPlan(planId);
  };

  const confirmPlanChange = async () => {
    if (!planChangeConfirm) return;
    setIsProcessingChange(true);
    
    try {
      // First, cancel existing subscription if active
      if (subData?.subscription?.status === 'active') {
        await fetch('/api/subscriptions/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
      }
      
      // Then select the new plan
      setSelectedPlan(planChangeConfirm.newPlan);
      setPlanChangeConfirm(null);
    } catch (error) {
      console.error('[SUB] Plan change error:', error);
    } finally {
      setIsProcessingChange(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm(tr('set_acc_delete_confirm') || '¿Confirmar cancelación?')) return;
    setIsCanceling(true);
    try {
      const res = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        setCancelSuccess(true);
        loadSubscriptionData();
        setTimeout(() => setCancelSuccess(false), 5000);
      }
    } catch (error) {
      console.error('[SUB] Cancel error:', error);
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
        {/* Header */}
        <div className="text-center space-y-4 pt-4">
          <h1 className="text-5xl md:text-6xl font-heading font-black text-slate-900 dark:text-slate-100 tracking-tighter">
            {tr('nav_subscription') || 'Suscripción'}
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            {tr('sub_plan_premium_desc') || 'Desbloquea el máximo potencial de tu salud'}
          </p>
        </div>

        {/* Info Feedback */}
        {(paymentSuccess || paymentError) && (
          <div className={cn(
            "p-5 rounded-3xl border-2 shadow-2xl animate-in zoom-in-95 fade-in duration-300",
            paymentSuccess ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50"
          )}>
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 rounded-2xl", paymentSuccess ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-red-100 dark:bg-red-900/30 text-red-600")}>
                {paymentSuccess ? <Check className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
              </div>
              <div className="flex-1">
                <p className={cn("text-base font-black uppercase tracking-tight", paymentSuccess ? "text-emerald-900 dark:text-emerald-100" : "text-red-900 dark:text-red-100")}>
                  {paymentSuccess ? (tr('sub_paypal_verify') || '¡Plan activado!') : (tr('sub_paypal_error') || 'Error en el pago')}
                </p>
                <p className={cn("text-sm font-medium opacity-80", paymentSuccess ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400")}>
                  {paymentSuccess ? (tr('landing_hero_subtitle') || 'Ya puedes disfrutar de todas las ventajas de tu plan.') : (paymentError || 'Inténtalo de nuevo más tarde.')}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setPaymentSuccess(false); setPaymentError(null); }}>
                <XCircle className="h-5 w-5 opacity-50 hover:opacity-100" />
              </Button>
            </div>
          </div>
        )}

        {/* Cancel Success Message */}
        {cancelSuccess && (
          <div className="p-5 rounded-3xl border-2 shadow-2xl animate-in zoom-in-95 fade-in duration-300 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-base font-black uppercase tracking-tight text-amber-900 dark:text-amber-100">
                  {tr('sub_cancel_scheduled') || 'Suscripción cancelada'}
                </p>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400 opacity-80">
                  {tr('sub_access_until_info') || 'Seguirás teniendo acceso hasta el final de tu período de facturación actual.'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCancelSuccess(false)}>
                <XCircle className="h-5 w-5 opacity-50 hover:opacity-100" />
              </Button>
            </div>
          </div>
        )}

        {/* Plan Change Confirmation Modal */}
        {planChangeConfirm?.show && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
              <div className="text-center space-y-3">
                <div className={cn(
                  "w-16 h-16 rounded-2xl mx-auto flex items-center justify-center",
                  planChangeConfirm.isUpgrade 
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" 
                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                )}>
                  {planChangeConfirm.isUpgrade ? <TrendingUp className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
                </div>
                <h3 className="text-2xl font-heading font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {planChangeConfirm.isUpgrade 
                    ? tr('sub_upgrade_confirm')
                    : tr('sub_change_confirm')
                  }
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {planChangeConfirm.isUpgrade
                    ? tr('sub_upgrade_desc')
                    : tr('sub_change_desc')
                  }
                  {' '}
                  {lang === 'en'
                    ? `You currently have ${getPlanName(currentPlan)}.`
                    : `Actualmente tienes ${getPlanName(currentPlan)}.`
                  }
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  ⚠️ {tr('sub_cancel_warning')}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl font-bold"
                  onClick={() => setPlanChangeConfirm(null)}
                  disabled={isProcessingChange}
                >
                  {tr('common_cancel') || 'Cancelar'}
                </Button>
                <Button
                  className={cn(
                    "flex-1 h-12 rounded-2xl font-bold",
                    planChangeConfirm.isUpgrade
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-amber-600 hover:bg-amber-700 text-white"
                  )}
                  onClick={confirmPlanChange}
                  disabled={isProcessingChange}
                >
                  {isProcessingChange ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    tr('common_next') || 'Continuar'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Current Subscription Status */}
        {currentPlan !== 'free' && subData && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 border-0 shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0yMGgtNjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
              <CardContent className="py-10 relative">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30 transform group-hover:scale-110 transition-transform duration-500">
                      <Crown className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-4xl font-heading font-black text-white capitalize tracking-tighter mb-1">
                        {getPlanName(subData.subscription?.plan || currentPlan)}
                      </h2>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <div className={cn("w-2 h-2 rounded-full", subData.subscription?.status === 'active' ? 'bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,1)]' : 'bg-red-400')} />
                        <span className="text-xs font-black text-white uppercase tracking-widest">
                          {subData.subscription?.status === 'active' ? (tr('sub_status_active') || 'Activa') : (tr('sub_status_canceled') || 'Cancelada')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {subData.subscription?.currentPeriodEnd && (
                    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 shadow-2xl min-w-[200px] text-center">
                      <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-2">{tr('sub_period_end') || 'Vence el'}</p>
                      <p className="text-3xl font-heading font-black text-white">
                        {new Date(subData.subscription.currentPeriodEnd).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-[10px] text-white/50 font-bold uppercase mt-1">{new Date(subData.subscription.currentPeriodEnd).getFullYear()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-950 shadow-xl overflow-hidden glass-card">
                  <CardHeader className="pb-4 border-b border-slate-50 dark:border-slate-800/50">
                    <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                      {tr('sub_billing_upcoming') || 'Próximo Pago'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-inner gap-6 text-center sm:text-left transition-all hover:border-emerald-500/30 group">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-px shadow-lg group-hover:rotate-6 transition-transform">
                          <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-950 flex items-center justify-center">
                            <CreditCard className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div>
                          <p className="text-xl font-black text-slate-900 dark:text-slate-100 capitalize">
                            NutriFlow {getPlanName(subData.subscription?.plan || 'free')}
                          </p>
                          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
                            {tr('sub_billing_details') || 'Detalles de facturación'}
                          </p>
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-4xl font-heading font-black text-slate-900 dark:text-slate-100">
                          ${subData.subscription?.amount ? subData.subscription.amount.toFixed(2) : (subData.subscription?.plan === 'pro' ? '19.99' : '9.99')}
                        </p>
                        <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-1">USD / {tr('common_back')||'Més'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {subData.history && subData.history.length > 0 && (
                  <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-950 shadow-xl glass-card">
                    <CardHeader className="pb-4 border-b border-slate-50 dark:border-slate-800/50">
                      <CardTitle className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
                          <Receipt className="h-5 w-5" />
                        </div>
                        {tr('sub_billing_history') || 'Historial de Pagos'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      {subData.history.map((h: any, idx: number) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-3xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all group gap-4">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                              h.status === 'active' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-slate-50 dark:bg-slate-900 text-slate-400"
                            )}>
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-base font-black text-slate-900 dark:text-slate-100 capitalize">{getPlanName(h.plan)}</p>
                              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                {new Date(h.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">${h.amount ? h.amount.toFixed(2) : (h.plan === 'pro' ? '19.99' : '9.99')}</p>
                            <div className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                              h.status === 'active' ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800" : "bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800"
                            )}>
                              {h.status === 'active' ? (tr('sub_status_active') || 'Aceptado') : (tr('sub_status_canceled') || 'Exp.')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-950 shadow-xl glass-card overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{tr('common_confirm') || 'Acciones'}</p>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    {currentPlan !== 'free' && subData?.subscription?.status === 'active' && !subData.subscription?.cancelAtPeriodEnd && (
                      <Button
                        variant="destructive"
                        className="w-full justify-center gap-3 h-14 rounded-2xl font-bold shadow-lg shadow-red-500/20"
                        onClick={() => {
                          if (confirm(tr('set_acc_delete_confirm') || '¿Estás seguro de que quieres cancelar tu suscripción? Perderás acceso al finalizar el período actual.')) {
                            handleCancelSubscription();
                          }
                        }}
                        disabled={isCanceling}
                      >
                        {isCanceling ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                        {isCanceling ? 'Cancelando...' : (tr('sub_cancel_plan') || 'Cancelar Suscripción')}
                      </Button>
                    )}
                    {subData?.subscription?.cancelAtPeriodEnd && (
                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-center">
                        <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                          ⚠️ {tr('sub_cancel_scheduled') || 'Tu suscripción se cancelará al final del período actual.'}
                        </p>
                        {subData.subscription?.currentPeriodEnd && (
                          <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                            {tr('sub_access_until') || 'Acceso hasta:'} {new Date(subData.subscription.currentPeriodEnd).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full justify-center gap-3 h-12 rounded-2xl border-slate-100 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-800 font-bold transition-all"
                      onClick={() => router.push('/subscription?tab=plans')}
                    >
                      <ArrowRight className="h-4 w-4" /> {tr('sub_change_plan') || 'Cambiar Plan'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-violet-600 to-indigo-700 border-0 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-2 shadow-xl border border-white/30 rotate-3 group-hover:rotate-0 transition-transform">
                      <AlertCircle className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-lg font-black text-white leading-tight uppercase tracking-tight">{tr('sub_help_title') || '¿Necesitas Ayuda?'}</p>
                    <p className="text-xs text-white/70 font-medium leading-relaxed">
                      {tr('sub_help_desc') || 'Si tienes problemas con tu suscripción, contacta a soporte.'}
                    </p>
                    <Button className="w-full rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-black uppercase tracking-widest text-[10px] h-11 border-0 shadow-lg shadow-indigo-900/20 active:scale-95 transition-all">
                      {tr('sub_help_cta') || 'Soporte 24/7'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        <div className="pt-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
              {tr('sub_upgrade_premium') || 'Mejora tu plan'}
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-4 rounded-full shadow-lg shadow-emerald-500/20" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = currentPlan === plan.id;

              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "relative flex flex-col justify-between transition-all duration-500 rounded-[3rem] overflow-hidden group",
                    plan.highlighted
                      ? "border-emerald-500/50 dark:border-emerald-400/30 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.15)] bg-white dark:bg-slate-950 scale-105 z-10 border-2"
                      : "border-slate-200 dark:border-slate-800 dark:bg-slate-950/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 border-2",
                    isCurrentPlan && "ring-4 ring-amber-400/20 border-amber-400/50"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute top-6 right-6">
                      <div className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-lg shadow-emerald-500/40 animate-pulse">
                        TOP
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8 pt-12">
                    <div className={cn(
                      "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl",
                      plan.id === 'pro' ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" :
                      plan.id === 'premium' ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white" :
                      "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    )}>
                      {Icon ? <Icon className="h-10 w-10" /> : <Zap className="h-10 w-10" />}
                    </div>
                    <CardTitle className="text-4xl font-heading font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none mb-2">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-base font-bold text-slate-500 dark:text-slate-400 opacity-80">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-8 pb-8 flex-1">
                    <div className="mb-10 text-center">
                      {plan.price === 0 ? (
                        <span className="text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase">{tr('sub_plan_free_name') || 'GRATIS'}</span>
                      ) : (
                        <div className="flex items-baseline justify-center">
                          <span className="text-3xl font-black text-slate-400 dark:text-slate-600 mr-1">$</span>
                          <span className="text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{plan.price}</span>
                          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px] ml-2 block">/ {tr('common_back')||'Més'}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5",
                            plan.highlighted ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-emerald-500"
                          )}>
                            <Check className="h-4 w-4 stroke-[3px]" />
                          </div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">
                            {feature}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="px-8 pb-12 pt-4">
                    {isCurrentPlan ? (
                      <div className="w-full text-center p-4 rounded-3xl bg-amber-400/10 border-2 border-amber-400/30 text-amber-600 dark:text-amber-500 font-black uppercase tracking-widest text-xs shadow-inner shadow-amber-950/5">
                        {tr('sub_current_plan') || 'Tu plan actual'}
                      </div>
                    ) : (
                      <div className="w-full">
                        {selectedPlan === plan.id ? (
                          <div className="animate-in slide-in-from-bottom-5 duration-500">
                            <PayPalCheckout
                              planId={plan.id}
                              onSuccess={() => { setPaymentSuccess(true); setSelectedPlan(null); loadSubscriptionData(); }}
                              onError={(msg) => setPaymentError(msg)}
                            />
                            <Button variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500" onClick={() => setSelectedPlan(null)}>
                                {tr('common_back') || 'Cancelar'}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className={cn(
                              "w-full h-16 rounded-[2rem] font-black uppercase tracking-[0.14em] text-xs transition-all active:scale-[0.98] shadow-2xl",
                              plan.highlighted
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 border-0"
                                : "bg-slate-900 hover:bg-black text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 border-0"
                            )}
                            onClick={() => handlePlanSelect(plan.id)}
                          >
                            {plan.cta} <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="pt-20">
          <Card className="border-0 bg-slate-100/50 dark:bg-slate-900/50 rounded-[3rem] shadow-inner overflow-hidden">
            <CardHeader className="text-center pt-16 pb-12">
              <CardTitle className="text-4xl font-heading font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase px-4">
                {tr('sub_faq_title') || 'Preguntas Frecuentes'}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-20 max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
              {[
                { q: tr('sub_faq_q1') || '¿Puedo cancelar?', a: tr('sub_faq_a1') || 'Sí, en cualquier momento desde ajustes.' },
                { q: tr('sub_faq_q2') || '¿Es seguro?', a: tr('sub_faq_a2') || 'Usamos PayPal con encriptación de nivel bancario.' },
                { q: tr('sub_faq_q3') || '¿Hay reembolsos?', a: tr('sub_faq_a3') || 'Garantía de 14 días en todos los planes.' },
                { q: tr('sub_faq_q4') || '¿Puedo cambiar de plan?', a: tr('sub_faq_a4') || 'Sí, puedes actualizar o reducir tu plan en cualquier momento.' }
              ].map((faq, i) => (
                <div key={i} className="space-y-3 group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-950 shadow-md flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-800/50 group-hover:rotate-12 transition-transform">
                      <Zap size={16} className="text-emerald-500" />
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">{faq.q}</h3>
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed pl-12 border-l-2 border-slate-200 dark:border-slate-800 ml-4 group-hover:border-emerald-500/50 transition-colors">
                    {faq.a}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-12">
           <PromoCodeRedeemer />
           <ReferralProgram />
        </div>
      </div>
    </DashboardLayout>
  );
}
