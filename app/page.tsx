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

const FEATURES = [
  {
    icon: Utensils,
    title: 'Registro Inteligente',
    description: 'Controla tu alimentación con IA que reconoce alimentos y calcula nutrientes automáticamente.',
    accent: 'from-emerald-500 to-blue-600',
  },
  {
    icon: Dumbbell,
    title: 'Entrenamiento Premium',
    description: 'Rutinas personalizadas con cálculos automáticos de calorías quemadas y progreso.',
    accent: 'from-teal-500 to-purple-600',
  },
  {
    icon: MessageCircle,
    title: 'Coach IA 24/7',
    description: 'Asistente personal de nutrición disponible siempre para resolver tus dudas.',
    accent: 'from-fuchsia-500 to-pink-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Avanzado',
    description: 'Visualiza tu progreso con gráficos detallados y análisis de tendencias.',
    accent: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Shield,
    title: 'Información Verificada',
    description: 'Contenido revisado por nutricionistas y profesionales certificados.',
    accent: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Zap,
    title: 'Ciencia Precisa',
    description: 'Fórmulas validadas como Mifflin-St Jeor para máxima precisión.',
    accent: 'from-amber-500 to-orange-600',
  },
];

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
    ],
    cta: 'Comenzar gratis',
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
    ],
    cta: 'Prueba Premium',
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
      'Exportación de datos PDF/CSV',
      'Soporte prioritario',
    ],
    cta: 'Obtener Pro',
    highlighted: false,
    icon: Star,
  },
];

const TESTIMONIALS = [
  {
    name: 'María González',
    role: 'Perdió 15kg en 4 meses',
    content: 'NutriFlow cambió mi vida. La IA me ayudó a entender mis hábitos y ahora me siento increíble.',
    avatar: 'MG',
    rating: 5,
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Atleta CrossFit',
    content: 'El módulo de ejercicio es exactamente lo que necesitaba. Puedo seguir mi progreso perfectamente.',
    avatar: 'CR',
    rating: 5,
  },
  {
    name: 'Ana Martínez',
    role: 'Nutricionista certificada',
    content: 'Recomiendo NutriFlow a mis pacientes. La información es precisa y basada en evidencia científica.',
    avatar: 'AM',
    rating: 5,
  },
];

const STATS = [
  { value: '50K+', label: 'Usuarios activos', icon: Users },
  { value: '2M+', label: 'Comidas registradas', icon: Utensils },
  { value: '98%', label: 'Satisfacción', icon: Heart },
  { value: '4.9★', label: 'Calificación', icon: Star },
];

const APP_FEATURES = [
  { icon: Clock, title: 'Rápido', description: 'Registra tus comidas en segundos' },
  { icon: Target, title: 'Preciso', description: 'Cálculos basados en ciencia' },
  { icon: Award, title: 'Efectivo', description: 'Resultados comprobados' },
  { icon: Sparkles, title: 'IA', description: 'Recomendaciones inteligentes' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header — Glass Navigation */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? 'border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/20'
            : 'border-b border-transparent bg-white/70 backdrop-blur-lg'
        }`}>
        <div className="container-nutriflow flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              NutriFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {['features', 'testimonials', 'pricing'].map((item) => (
              <Link
                key={item}
                href={`#${item}`}
                className="text-sm font-semibold text-slate-800 hover:text-emerald-700 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-600 after:transition-all hover:after:w-full"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            ))}
            <Link href="/login" className="text-sm font-semibold text-slate-800 hover:text-emerald-700 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/register">
              <Button className="btn-glow">Comenzar gratis</Button>
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
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl">
            <nav className="container-nutriflow py-5 flex flex-col gap-3">
              {['features', 'testimonials', 'pricing'].map((item) => (
                <Link
                  key={item}
                  href={`#${item}`}
                  className="text-sm font-semibold text-slate-800 py-2.5 px-4 rounded-xl hover:bg-slate-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              ))}
              <Link href="/login" className="text-sm font-semibold text-slate-800 py-2.5 px-4 rounded-xl hover:bg-slate-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Iniciar sesión
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="px-4">
                <Button className="w-full btn-glow">Comenzar gratis</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section — Clean Elegant with Particles */}
      <section className="min-h-screen flex items-center bg-slate-50 text-slate-900 relative overflow-hidden pt-20">
        <ParticlesBackground />

        {/* Ambient lighting — emerald/teal glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[180px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-fuchsia-400/5 rounded-full blur-[120px]" />
        </div>

        <div className="container-nutriflow relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            {/* Logo Icon */}
            <div className="flex justify-center animate-fade-in-down">
              <div className="p-5 rounded-3xl bg-white/60 backdrop-blur-2xl border border-slate-200/50 shadow-2xl shadow-emerald-500/5">
                <Leaf className="h-20 w-20 text-emerald-500" />
              </div>
            </div>

            {/* Badge */}
            <div className="flex justify-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 border border-emerald-200/50 text-sm font-medium text-emerald-700">
                <Sparkles className="h-4 w-4" />
                Potenciado por Inteligencia Artificial
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-extrabold tracking-tighter leading-[1.05] animate-fade-in-up text-slate-900">
              La ciencia de tu
              <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mt-2 pb-2">
                mejor versión.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
              Controla tu alimentación, ejercicio y bienestar con una plataforma
              diseñada científicamente para tu éxito.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto btn-glow">
                    Ir al Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" variant="default" className="w-full sm:w-auto btn-glow bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl px-8 py-4 font-semibold text-base shadow-lg shadow-emerald-500/30">
                      Comenzar gratis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl px-8 py-4 font-semibold text-base shadow-sm"
                    >
                      Iniciar sesión
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-slate-200 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {STATS.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group cursor-default">
                    <Icon className="h-7 w-7 mx-auto mb-3 opacity-40 text-slate-500 group-hover:opacity-100 group-hover:text-emerald-500 transition-all duration-300" />
                    <div className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-2 tracking-tight">{stat.value}</div>
                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* App Features Banner — Clean White */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container-nutriflow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {APP_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center gap-4 group"
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 group-hover:from-emerald-100 group-hover:to-teal-100 transition-colors duration-300">
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="font-semibold text-slate-900">{feature.title}</div>
                  <div className="text-sm text-slate-500">{feature.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section — Light Gradient */}
      <section id="features" className="py-24 md:py-32 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-50">
        <div className="container-nutriflow">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
              <Zap className="h-4 w-4" />
              Potenciado por IA
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter">
              Redefiniendo tu
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">bienestar.</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
              Una plataforma completa que combina nutrición, ejercicio y tecnología
              para ayudarte a alcanzar tus metas de salud.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group card-nutriflow hover:-translate-y-2 overflow-hidden border-slate-200/60"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <CardHeader className="pb-4">
                    <div className={`inline-flex p-3.5 rounded-2xl bg-gradient-to-br ${feature.accent} mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section — Clean White */}
      <section id="testimonials" className="py-24 md:py-32 bg-white">
        <div className="container-nutriflow">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-100 text-teal-800 text-sm font-medium">
              <Heart className="h-4 w-4" />
              Testimonios reales
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter">
              Historias que
              <span className="block bg-gradient-to-r from-teal-600 to-fuchsia-600 bg-clip-text text-transparent">inspiran.</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
              Miles de personas ya transformaron su vida con NutriFlow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="card-nutriflow hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 border-slate-200/60">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-500/20">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-emerald-600 font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 italic leading-relaxed">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section — Light Elegant Table */}
      <section id="pricing" className="py-24 md:py-32 bg-slate-50 text-slate-900 overflow-hidden relative">
        <ParticlesBackground />
        <div className="container-nutriflow relative z-10 max-w-5xl">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 border border-emerald-200/50 text-emerald-700 text-sm font-medium">
              <Gem className="h-4 w-4" />
              Planes para todos
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter">
              Desempeño sin <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">concesiones.</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
              Compara nuestros planes y elige el nivel de acceso que potenciará tus objetivos reales.
            </p>
          </div>

          <div className="rounded-[40px] border border-slate-200 bg-white backdrop-blur-3xl overflow-hidden shadow-2xl shadow-emerald-500/5">
            <div className="grid grid-cols-4 border-b border-slate-200 bg-white">
              <div className="p-8 flex items-end">
                <span className="text-xl font-bold text-slate-600">Características</span>
              </div>

              {/* Column Headers */}
              {PLANS.map((plan) => (
                <div key={plan.id} className="p-8 text-center border-l border-slate-200 flex flex-col justify-end relative bg-slate-50/50">
                  {plan.highlighted && (
                     <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                  )}
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">{plan.name}</h3>
                  <div className="text-4xl font-extrabold tracking-tight mb-6 text-slate-900">
                    {plan.price === 0 ? 'Gratis' : `$${plan.price}`}
                    {plan.price !== 0 && <span className="text-lg text-slate-500 font-medium">/mes</span>}
                  </div>
                  <Link href={isAuthenticated ? '/subscription' : '/register'} className="w-full">
                    <Button
                      variant={plan.highlighted ? 'default' : 'outline'}
                      className={`w-full h-12 rounded-2xl font-semibold transition-all duration-300 ${plan.highlighted ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Matrix Rows */}
            <div className="divide-y divide-slate-100 text-sm md:text-base">
               {[
                 { feature: "Registro de calorías", allow: [true, true, true] },
                 { feature: "Análisis de Hidratación", allow: [true, true, true] },
                 { feature: "Coach IA (Límite)", allow: ["10/día", "Ilimitado", "Ilimitado"] },
                 { feature: "Historial de Progreso", allow: ["14 Días", "30 Días", "Sin límite"] },
                 { feature: "Reconocimiento de imágenes IA", allow: [false, true, true] },
                 { feature: "Sin Anuncios", allow: [false, true, true] },
                 { feature: "Rutinas con IA", allow: [false, false, true] },
                 { feature: "Exportación de Datos (PDF)", allow: [false, false, true] },
               ].map((row, i) => (
                 <div key={i} className={`grid grid-cols-4 transition-colors ${i%2===0 ? 'bg-slate-50' : 'bg-white'} hover:bg-slate-100/50`}>
                   <div className="p-6 font-medium text-slate-700 flex items-center">{row.feature}</div>
                   {row.allow.map((val, j) => (
                     <div key={j} className={`p-6 border-l border-slate-100 flex items-center justify-center font-medium ${val === false ? 'opacity-30' : ''}`}>
                       {val === true ? (
                         <Check className={`h-6 w-6 ${PLANS[j].highlighted ? 'text-emerald-500' : 'text-slate-400'}`} />
                       ) : val === false ? (
                         <span className="text-slate-400 text-xl">-</span>
                       ) : (
                         <span className={PLANS[j].highlighted ? 'text-emerald-600' : 'text-slate-600'}>{val}</span>
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
      <section className="py-24 md:py-32 bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-800 text-white relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px]" />
        </div>

        <div className="container-nutriflow relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-10">
            <div className="flex justify-center animate-float">
              <Heart className="h-20 w-20 text-white/80" />
            </div>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter">
              Tu transformación
              <span className="block text-white/80">comienza hoy.</span>
            </h2>
            <p className="text-xl text-white/70 max-w-xl mx-auto font-light">
              Únete a miles de usuarios que ya están mejorando su salud con NutriFlow
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="bg-white text-emerald-700 hover:bg-white/90 font-bold text-lg px-12 py-7 rounded-2xl shadow-2xl shadow-emerald-900/30 transition-all duration-300 hover:-translate-y-1">
                Crear cuenta gratis
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer — Slate Elegant */}
      <footer className="border-t border-slate-200 bg-white py-16">
        <div className="container-nutriflow">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="font-heading text-xl font-bold text-slate-900">NutriFlow</span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                Tu compañero inteligente para una vida más saludable. Nutrición, ejercicio y bienestar potenciados por IA.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Shield className="h-4 w-4" />
                <span>Encriptación de grado bancario</span>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-semibold mb-5 text-slate-900 text-sm uppercase tracking-wider">Producto</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#features" className="text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1"><ChevronRight className="h-3 w-3" />Características</Link></li>
                <li><Link href="#pricing" className="text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1"><ChevronRight className="h-3 w-3" />Precios</Link></li>
                <li><Link href="/register" className="text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1"><ChevronRight className="h-3 w-3" />Comenzar</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-slate-900 text-sm uppercase tracking-wider">Compañía</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1"><ChevronRight className="h-3 w-3" />Sobre nosotros</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1"><ChevronRight className="h-3 w-3" />Blog</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1"><ChevronRight className="h-3 w-3" />Contacto</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-slate-900 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/terms" className="text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1"><ChevronRight className="h-3 w-3" />Términos</Link></li>
                <li><Link href="/privacy" className="text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1"><ChevronRight className="h-3 w-3" />Privacidad</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1"><ChevronRight className="h-3 w-3" />Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-400">
              © 2026 NutriFlow. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-400">
              Hecho con <Heart className="h-3.5 w-3.5 text-emerald-500 inline mx-1" /> para tu bienestar
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
