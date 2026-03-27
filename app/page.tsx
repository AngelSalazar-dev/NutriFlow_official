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
  TrendingUp,
  Users,
  Star,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  {
    icon: Utensils,
    title: 'Registro Inteligente',
    description: 'Controla tu alimentación con IA que reconoce alimentos y calcula nutrientes automáticamente.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Dumbbell,
    title: 'Entrenamiento Premium',
    description: 'Rutinas personalizadas con cálculos automáticos de calorías quemadas y progreso.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: MessageCircle,
    title: 'Coach IA 24/7',
    description: 'Asistente personal de nutrición disponible siempre para resolver tus dudas.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Avanzado',
    description: 'Visualiza tu progreso con gráficos detallados y análisis de tendencias.',
    color: 'from-orange-500 to-amber-600',
  },
  {
    icon: Shield,
    title: 'Información Verificada',
    description: 'Contenido revisado por nutricionistas y profesionales certificados.',
    color: 'from-emerald-600 to-green-700',
  },
  {
    icon: Zap,
    title: 'Ciencia Precisa',
    description: 'Fórmulas validadas como Mifflin-St Jeor para máxima precisión.',
    color: 'from-red-500 to-rose-600',
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
      'Historial de 7 días',
      'Chat IA: 5 mensajes/día',
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
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Atleta CrossFit',
    content: 'El módulo de ejercicio es exactamente lo que necesitaba. Puedo追踪 mi progreso perfectamente.',
    avatar: 'CR',
  },
  {
    name: 'Ana Martínez',
    role: 'Nutricionista certificada',
    content: 'Recomiendo NutriFlow a mis pacientes. La información es precisa y basada en evidencia científica.',
    avatar: 'AM',
  },
];

const STATS = [
  { value: '50K+', label: 'Usuarios activos' },
  { value: '2M+', label: 'Comidas registradas' },
  { value: '98%', label: 'Satisfacción' },
  { value: '4.9★', label: 'Calificación' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="container-nutriflow flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 group-hover:shadow-lg transition-all">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
              NutriFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition-colors">
              Características
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition-colors">
              Testimonios
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition-colors">
              Precios
            </Link>
            <Link href="/login" className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/register">
              <Button className="btn-glow">Comenzar gratis</Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white">
            <nav className="container-nutriflow py-4 flex flex-col gap-4">
              <Link href="#features" className="text-sm font-medium text-stone-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Características
              </Link>
              <Link href="#testimonials" className="text-sm font-medium text-stone-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Testimonios
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-stone-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Precios
              </Link>
              <Link href="/login" className="text-sm font-medium text-stone-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Iniciar sesión
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full btn-glow">Comenzar gratis</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="gradient-emerald-premium text-white py-20 md:py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        </div>
        
        <div className="container-nutriflow relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm animate-pulse-glow">
                <Leaf className="h-20 w-20" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Nutrición Inteligente,
              <span className="block bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                Resultados Reales
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Controla tu alimentación, ejercicio y bienestar con una plataforma 
              diseñada científicamente para tu éxito.
            </p>
            
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
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto btn-glow">
                      Comenzar gratis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                    >
                      Iniciar sesión
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              {STATS.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm md:text-base text-emerald-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-gradient-to-br from-stone-50 via-white to-stone-50">
        <div className="container-nutriflow">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
              <Zap className="h-4 w-4" />
              Potenciado por IA
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Todo lo que necesitas para
              <span className="block text-emerald-700">tu bienestar</span>
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
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
                  className="group card-nutriflow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <CardHeader>
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28 bg-white">
        <div className="container-nutriflow">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Historias de éxito
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Miles de personas ya transformaron su vida con NutriFlow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="card-nutriflow hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-stone-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28 bg-gradient-to-br from-stone-50 via-emerald-50 to-stone-50">
        <div className="container-nutriflow">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
              <Crown className="h-4 w-4" />
              Planes flexibles
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Invierte en tu salud
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Comienza gratis y actualiza cuando estés listo para más funciones
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.id}
                  className={`relative card-nutriflow ${
                    plan.highlighted
                      ? 'ring-2 ring-emerald-600 shadow-xl scale-105'
                      : ''
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                        <Crown className="h-3 w-3" />
                        Más popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    {Icon && (
                      <Icon className="h-12 w-12 text-emerald-700 mx-auto mb-4" />
                    )}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      {plan.price === 0 ? (
                        <span className="text-5xl font-bold">Gratis</span>
                      ) : (
                        <>
                          <span className="text-5xl font-bold">${plan.price}</span>
                          <span className="text-stone-500">/mes</span>
                        </>
                      )}
                    </div>
                    <ul className="space-y-3 text-left">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                          <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-stone-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href={isAuthenticated ? '/subscription' : '/register'} className="w-full">
                      <Button
                        variant={plan.highlighted ? 'default' : 'outline'}
                        className="w-full py-6 text-base font-semibold"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-emerald-premium text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-400 rounded-full blur-3xl" />
        </div>
        
        <div className="container-nutriflow relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Heart className="h-16 w-16 mx-auto" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Comienza tu transformación hoy
            </h2>
            <p className="text-xl text-emerald-100">
              Únete a miles de usuarios que ya están mejorando su salud con NutriFlow
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="btn-glow text-lg px-10 py-6">
                Crear cuenta gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-stone-50 py-12">
        <div className="container-nutriflow">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-emerald-700" />
                <span className="font-heading text-lg font-bold text-emerald-900">NutriFlow</span>
              </div>
              <p className="text-sm text-stone-600">
                Tu compañero inteligente para una vida más saludable.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-stone-900">Producto</h4>
              <ul className="space-y-2 text-sm text-stone-600">
                <li><Link href="#features" className="hover:text-emerald-700 transition-colors">Características</Link></li>
                <li><Link href="#pricing" className="hover:text-emerald-700 transition-colors">Precios</Link></li>
                <li><Link href="/register" className="hover:text-emerald-700 transition-colors">Comenzar</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-stone-900">Compañía</h4>
              <ul className="space-y-2 text-sm text-stone-600">
                <li><Link href="#" className="hover:text-emerald-700 transition-colors">Sobre nosotros</Link></li>
                <li><Link href="#" className="hover:text-emerald-700 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-emerald-700 transition-colors">Contacto</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-stone-900">Legal</h4>
              <ul className="space-y-2 text-sm text-stone-600">
                <li><Link href="/terms" className="hover:text-emerald-700 transition-colors">Términos</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-700 transition-colors">Privacidad</Link></li>
                <li><Link href="#" className="hover:text-emerald-700 transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-stone-500">
              © 2026 NutriFlow. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <Shield className="h-4 w-4" />
              <span>Protegido con encriptación de grado bancario</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
