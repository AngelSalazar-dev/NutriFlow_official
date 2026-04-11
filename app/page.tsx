'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Leaf,
  Check,
  ArrowRight,
  Utensils,
  Dumbbell,
  MessageCircle,
  BarChart3,
  Shield,
  Zap,
  Crown,
  Heart,
  Users,
  Star,
  Menu,
  X,
  Sparkles,
  Target,
  Clock,
  Award,
  ChevronRight,
  Gem,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { ParticlesBackground } from '@/components/ui/ParticlesBackground';
import { useLang } from '@/context/LangContext';
import { ThemeLangToggle } from '@/components/ui/ThemeLangToggle';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { tr, lang } = useLang();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const FEATURES = [
    {
      icon: Utensils,
      title: tr('landing_feat_smart'),
      description: tr('landing_feat_smart_desc'),
      accent: 'from-emerald-500 to-blue-600',
    },
    {
      icon: Dumbbell,
      title: tr('landing_feat_premium'),
      description: tr('landing_feat_premium_desc'),
      accent: 'from-teal-500 to-purple-600',
    },
    {
      icon: MessageCircle,
      title: tr('landing_feat_ai_coach'),
      description: tr('landing_feat_ai_coach_desc'),
      accent: 'from-fuchsia-500 to-pink-600',
    },
    {
      icon: BarChart3,
      title: tr('landing_feat_analytics'),
      description: tr('landing_feat_analytics_desc'),
      accent: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Shield,
      title: tr('landing_feat_verified'),
      description: tr('landing_feat_verified_desc'),
      accent: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Zap,
      title: tr('landing_feat_science'),
      description: tr('landing_feat_science_desc'),
      accent: 'from-amber-500 to-orange-600',
    },
  ];

  const PLANS = [
    {
      id: 'free',
      name: tr('sub_plan_free_name'),
      price: 0,
      description: tr('sub_plan_free_desc'),
      features: [
        'food_log_title',
        'food_kcal',
        'sub_feature_chat_limit',
        'dash_no_weekly_data',
        'nav_history',
      ].map(k => tr(k as any) || k),
      cta: tr('auth_free_start'),
      highlighted: false,
      icon: null,
    },
    {
      id: 'premium',
      name: tr('sub_plan_premium_name'),
      price: 9.99,
      description: tr('sub_plan_premium_desc'),
      features: [
        'sub_feature_no_ads',
        'sub_feature_chat_unlimited',
        'sub_feature_expert_articles',
        'nav_exercise',
        'landing_row_vision',
        'dash_stat_streak',
      ].map(k => tr(k as any) || k),
      cta: tr('sub_upgrade_premium'),
      highlighted: true,
      icon: Crown,
    },
    {
      id: 'pro',
      name: tr('sub_plan_pro_name'),
      price: 19.99,
      description: tr('sub_plan_pro_desc'),
      features: [
        'sub_feature_all_premium',
        'sub_feature_ai_training',
        'sub_feature_detailed_nutrition',
        'sub_feature_wearables',
        'sub_feature_unlimited_history',
        'sub_feature_priority_support',
      ].map(k => tr(k as any) || k),
      cta: tr('sub_get_pro'),
      highlighted: false,
      icon: Star,
    },
  ];

  const TESTIMONIALS = [
    {
      name: 'María González',
      role: lang === 'es' ? 'Perdió 15kg en 4 meses' : 'Lost 15kg in 4 months',
      content: tr('landing_testimonial_1'),
      avatar: 'MG',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      role: lang === 'es' ? 'Atleta CrossFit' : 'CrossFit Athlete',
      content: tr('landing_testimonial_2'),
      avatar: 'CR',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      role: lang === 'es' ? 'Nutricionista certificada' : 'Certified Nutritionist',
      content: tr('landing_testimonial_3'),
      avatar: 'AM',
      rating: 5,
    },
  ];

  const STATS = [
    { value: '50K+', label: lang === 'es' ? 'Usuarios activos' : 'Active Users', icon: Users },
    { value: '2M+', label: lang === 'es' ? 'Comidas registradas' : 'Meals logged', icon: Utensils },
    { value: '98%', label: lang === 'es' ? 'Satisfacción' : 'Satisfaction', icon: Heart },
    { value: '4.9★', label: lang === 'es' ? 'Calificación' : 'Rating', icon: Star },
  ];

  const APP_FEATURES = [
    { icon: Clock, title: 'Rápido', description: 'Registra tus comidas en segundos' },
    { icon: Target, title: 'Preciso', description: 'Cálculos basados en ciencia' },
    { icon: Award, title: 'Efectivo', description: 'Resultados comprobados' },
    { icon: Sparkles, title: 'IA', description: 'Recomendaciones inteligentes' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Header — Glass Navigation */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? 'border-b border-slate-200/80 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg'
            : 'border-b border-transparent bg-white/70 dark:bg-slate-900/40 backdrop-blur-lg'
        }`}>
        <div className="container-nutriflow flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              NutriFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {['features', 'testimonials', 'pricing'].map((item) => (
              <Link
                key={item}
                href={`#${item}`}
                className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors uppercase tracking-widest"
              >
                {tr(`landing_${item}` as any) || item}
              </Link>
            ))}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            <ThemeLangToggle />
            <Link href="/login" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-700 transition-colors uppercase tracking-widest">
              {tr('auth_login')}
            </Link>
            <Link href="/register">
              <Button className="btn-glow bg-emerald-600 hover:bg-emerald-700 text-white border-0 font-black uppercase tracking-widest text-xs px-6 h-12 rounded-xl shadow-lg shadow-emerald-500/20">
                {tr('auth_register')}
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-700" />
            ) : (
              <Menu className="h-6 w-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            <nav className="container-nutriflow py-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{tr('set_theme')} / {tr('set_language')}</span>
                <ThemeLangToggle />
              </div>
              {['features', 'testimonials', 'pricing'].map((item) => (
                <Link
                  key={item}
                  href={`#${item}`}
                  className="text-sm font-bold text-slate-800 dark:text-slate-200 py-3 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {tr(`landing_${item}` as any) || item}
                </Link>
              ))}
              <Link href="/login" className="text-sm font-bold text-slate-800 dark:text-slate-200 py-3 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
                {tr('auth_login')}
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="px-4 pt-2">
                <Button className="w-full h-14 btn-glow bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest">
                  {tr('auth_register')}
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section — Clean Elegant with Particles */}
      <section className="min-h-screen flex items-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden pt-20 transition-colors duration-500">
        <ParticlesBackground />

        {/* Ambient lighting — emerald/teal glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[150px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[180px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-fuchsia-400/5 dark:bg-fuchsia-400/2 rounded-full blur-[120px]" />
        </div>

        <div className="container-nutriflow relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            {/* Logo Icon */}
            <div className="flex justify-center animate-fade-in-down">
              <div className="p-5 rounded-3xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl shadow-emerald-500/5">
                <Leaf className="h-20 w-20 text-emerald-500 dark:text-emerald-400" />
              </div>
            </div>

            {/* Badge */}
            <div className="flex justify-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200/50 dark:border-emerald-800/50 text-sm font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                <Sparkles className="h-4 w-4" />
                {tr('sub_feature_ai_training')}
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-extrabold tracking-tighter leading-[1.05] animate-fade-in-up text-slate-900 dark:text-slate-100">
              {lang === 'es' ? 'La ciencia de tu' : 'The science of your'}
              <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mt-2 pb-2">
                {lang === 'es' ? 'mejor versión.' : 'best version.'}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
              {tr('landing_hero_subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-500/20 border-0 hover:scale-[1.02] transition-transform">
                    {tr('nav_dashboard')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-500/20 border-0 hover:scale-[1.02] transition-transform">
                      {tr('auth_free_start')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold uppercase tracking-widest text-sm shadow-sm"
                    >
                      {tr('auth_login')}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-slate-200 dark:border-slate-800/50 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {STATS.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group cursor-default">
                    <Icon className="h-7 w-7 mx-auto mb-3 opacity-40 text-slate-500 dark:text-slate-400 group-hover:opacity-100 group-hover:text-emerald-500 transition-all duration-300" />
                    <div className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-slate-100 mb-2 tracking-tight leading-none">{stat.value}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-widest leading-none">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* App Features Banner — Clean White */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
        <div className="container-nutriflow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {APP_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center gap-4 group"
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[10px]">{feature.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 font-medium px-4">{feature.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section — Light Gradient */}
      <section id="features" className="py-24 md:py-32 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-slate-950 transition-colors">
        <div className="container-nutriflow">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <Zap className="h-4 w-4" />
              {tr('landing_feat_smart')}
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter text-slate-900 dark:text-slate-100">
              {lang === 'es' ? 'Redefiniendo tu' : 'Redefining your'}
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                {lang === 'es' ? 'bienestar.' : 'wellness.'}
              </span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              {tr('landing_feat_ai_coach_desc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group relative bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <CardHeader className="pb-4">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.accent} mb-4 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg transition-all duration-500`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section — Clean White */}
      <section id="testimonials" className="py-24 md:py-32 bg-white dark:bg-slate-900 transition-colors">
        <div className="container-nutriflow">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-400 text-[10px] font-black uppercase tracking-widest">
              <Heart className="h-4 w-4" />
              {tr('landing_testimonials' as any) || 'Testimonials'}
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter text-slate-900 dark:text-slate-100">
              {lang === 'es' ? 'Historias que' : 'Stories that'}
              <span className="block bg-gradient-to-r from-teal-600 to-fuchsia-600 dark:from-teal-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                {lang === 'es' ? 'inspiran.' : 'inspire.'}
              </span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light">
              {lang === 'es' ? 'Miles de personas ya transformaron su vida con NutriFlow' : 'Thousands of people have already transformed their lives with NutriFlow'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800/60 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 tracking-tight">{testimonial.name}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed font-medium">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section — Light Elegant Table */}
      <section id="pricing" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden relative transition-colors">
        <ParticlesBackground />
        <div className="container-nutriflow relative z-10 max-w-5xl">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <Gem className="h-4 w-4" />
              {tr('landing_prices_title')}
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter">
              {lang === 'es' ? 'Desempeño sin' : 'Performance without'} <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">{lang === 'es' ? 'concesiones.' : 'compromise.'}</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              {tr('landing_prices_subtitle')}
            </p>
          </div>

          <div className="rounded-[40px] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl overflow-hidden shadow-2xl transition-all duration-500">
            <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
              <div className="p-8 flex items-end">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{lang === 'es' ? 'Características' : 'Features'}</span>
              </div>

              {/* Column Headers */}
              {PLANS.map((plan) => (
                <div key={plan.id} className="p-8 text-center border-l border-slate-200 dark:border-slate-800 flex flex-col justify-end relative bg-slate-50/30 dark:bg-slate-900/30">
                  {plan.highlighted && (
                     <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                  )}
                  <h3 className="text-2xl font-black mb-2 text-slate-900 dark:text-slate-100 tracking-tight">{plan.name}</h3>
                  <div className="text-4xl font-black tracking-tighter mb-6 text-slate-900 dark:text-slate-50">
                    {plan.price === 0 ? (lang === 'es' ? 'Gratis' : 'Free') : `$${plan.price}`}
                    {plan.price !== 0 && <span className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest ml-1">{tr('sub_month')}</span>}
                  </div>
                  <Link href={isAuthenticated ? '/subscription' : '/register'} className="w-full">
                    <Button
                      variant={plan.highlighted ? 'default' : 'outline'}
                      className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${plan.highlighted ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.02] text-white border-0' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Matrix Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm md:text-base">
               {[
                 { feature: tr('landing_row_kcal'), allow: [true, true, true] },
                 { feature: tr('landing_row_water'), allow: [true, true, true] },
                 { feature: tr('landing_row_ai_limit'), allow: ["10/día", "Ilimitado", "Ilimitado"] },
                 { feature: tr('landing_row_history'), allow: ["14 Días", "30 Días", "Sin límite"] },
                 { feature: tr('landing_row_vision'), allow: [false, true, true] },
                 { feature: tr('landing_row_ads'), allow: [false, true, true] },
                 { feature: tr('landing_row_routines'), allow: [false, false, true] },
                 { feature: tr('landing_row_export'), allow: [false, false, true] },
               ].map((row, i) => (
                 <div key={i} className={`grid grid-cols-4 transition-colors ${i%2===0 ? 'bg-slate-50/30 dark:bg-slate-900/20' : 'bg-white/30 dark:bg-slate-900/40'} hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10`}>
                   <div className="p-6 font-bold text-slate-700 dark:text-slate-300 flex items-center text-xs uppercase tracking-widest">{row.feature}</div>
                   {row.allow.map((val, j) => (
                     <div key={j} className={`p-6 border-l border-slate-100 dark:border-slate-800 flex items-center justify-center font-bold ${val === false ? 'opacity-20' : ''}`}>
                       {val === true ? (
                         <div className={`p-1.5 rounded-full ${PLANS[j].highlighted ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            <Check className="h-4 w-4" />
                         </div>
                       ) : val === false ? (
                         <span className="text-slate-400 dark:text-slate-600 text-2xl font-light">×</span>
                       ) : (
                         <span className={`text-xs font-black uppercase tracking-widest ${PLANS[j].highlighted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>{val}</span>
                       )}
                     </div>
                   ))}
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — Gradient Elegant */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 text-white relative overflow-hidden transition-all duration-700">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container-nutriflow relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="flex justify-center animate-float">
              <div className="p-6 rounded-[2.5rem] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl">
                <Heart className="h-20 w-20 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-6xl md:text-8xl font-heading font-extrabold tracking-tighter leading-none">
              {lang === 'es' ? 'Tu transformación' : 'Your transformation'}
              <span className="block text-white/60">{lang === 'es' ? 'comienza hoy.' : 'starts today.'}</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              {lang === 'es' ? 'Únete a miles de usuarios que ya están mejorando su salud con NutriFlow' : 'Join thousands of users who are already improving their health with NutriFlow'}
            </p>
            <Link href="/register">
              <Button size="lg" className="h-20 px-16 rounded-[2rem] bg-white text-emerald-900 border-0 hover:bg-white/90 font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-emerald-950/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-white/20">
                {tr('auth_free_start')}
                <ArrowRight className="ml-4 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer — Slate Elegant */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors py-16">
        <div className="container-nutriflow">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="font-heading text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">NutriFlow</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed font-medium">
                {tr('landing_footer_brand')}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                <Shield className="h-4 w-4" />
                <span>{lang === 'es' ? 'Encriptación de grado bancario' : 'Bank-grade encryption'}</span>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-black mb-6 text-slate-900 dark:text-slate-100 text-xs uppercase tracking-[0.2em]">{tr('landing_footer_product')}</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="#features" className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 decoration-emerald-500/30 underline-offset-4 hover:underline"><ChevronRight className="h-3 w-3" />{tr('landing_features')}</Link></li>
                <li><Link href="#pricing" className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 decoration-emerald-500/30 underline-offset-4 hover:underline"><ChevronRight className="h-3 w-3" />{tr('landing_pricing')}</Link></li>
                <li><Link href="/register" className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 decoration-emerald-500/30 underline-offset-4 hover:underline"><ChevronRight className="h-3 w-3" />{tr('auth_free_start')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-6 text-slate-900 dark:text-slate-100 text-xs uppercase tracking-[0.2em]">{tr('landing_footer_company')}</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 decoration-emerald-500/30 underline-offset-4 hover:underline"><ChevronRight className="h-3 w-3" />{lang === 'es' ? 'Sobre nosotros' : 'About us'}</Link></li>
                <li><Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 decoration-emerald-500/30 underline-offset-4 hover:underline"><ChevronRight className="h-3 w-3" />Blog</Link></li>
                <li><Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 decoration-emerald-500/30 underline-offset-4 hover:underline"><ChevronRight className="h-3 w-3" />{lang === 'es' ? 'Contacto' : 'Contact'}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-6 text-slate-900 dark:text-slate-100 text-xs uppercase tracking-[0.2em]">{tr('landing_footer_legal')}</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/terms" className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 decoration-emerald-500/30 underline-offset-4 hover:underline"><ChevronRight className="h-3 w-3" />{lang === 'es' ? 'Términos' : 'Terms'}</Link></li>
                <li><Link href="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 decoration-emerald-500/30 underline-offset-4 hover:underline"><ChevronRight className="h-3 w-3" />{lang === 'es' ? 'Privacidad' : 'Privacy'}</Link></li>
                <li><Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-2 decoration-emerald-500/30 underline-offset-4 hover:underline"><ChevronRight className="h-3 w-3" />Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              © 2026 NutriFlow. {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {tr('landing_footer_made_with')} <Heart className="h-3.5 w-3.5 text-emerald-500 animate-pulse inline mx-2" /> {tr('landing_footer_for_wellness')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
