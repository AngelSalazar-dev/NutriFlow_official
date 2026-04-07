'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Leaf,
  Utensils,
  Dumbbell,
  MessageCircle,
  TrendingUp,
  Crown,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ElementType;
}

export function OnboardingWizard() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const { success } = useToast();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isCompleting, setIsCompleting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    // Step 1: Welcome
    acknowledged: false,
    // Step 2: Goal
    goal: 'lose' as 'lose' | 'maintain' | 'gain',
    // Step 3: Activity Level
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    // Step 4: Preferences
    notifications: true,
    weeklyReports: true,
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: '¡Bienvenido a NutriFlow!',
      description: 'Tu compañero inteligente para una vida más saludable',
      icon: Leaf,
      component: WelcomeStep,
    },
    {
      id: 'goal',
      title: '¿Cuál es tu objetivo principal?',
      description: 'Esto nos ayudará a personalizar tu experiencia',
      icon: TrendingUp,
      component: GoalStep,
    },
    {
      id: 'activity',
      title: 'Nivel de Actividad Física',
      description: 'Seamos honestos, esto afecta tus necesidades calóricas',
      icon: Dumbbell,
      component: ActivityStep,
    },
    {
      id: 'features',
      title: 'Características Principales',
      description: 'Conoce todo lo que puedes hacer en NutriFlow',
      icon: MessageCircle,
      component: FeaturesStep,
    },
    {
      id: 'complete',
      title: '¡Todo Listo!',
      description: 'Estás listo para comenzar tu transformación',
      icon: Check,
      component: CompleteStep,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);

    try {
      await updateUser({
        goal: formData.goal,
        activityLevel: formData.activityLevel,
      });

      // Mark onboarding as complete in localStorage
      localStorage.setItem('onboarding-complete', 'true');

      success('¡Perfil configurado exitosamente!', 'Comienza a registrar tus comidas y ejercicios');

      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const StepComponent = steps[currentStep].component;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-stone-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 w-fit">
            {React.createElement(steps[currentStep].icon, {
              className: "h-8 w-8 text-white",
            })}
          </div>
          <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-stone-500">
              Paso {currentStep + 1} de {steps.length}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <StepComponent
            formData={formData}
            setFormData={setFormData}
          />

          <div className="flex justify-between mt-6 pt-6 border-t">
            {currentStep > 0 ? (
              <Button
                onClick={handleBack}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Atrás
              </Button>
            ) : (
              <div />
            )}

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                className="gap-2 btn-glow"
                size="lg"
              >
                <Check className="h-4 w-4" />
                {isCompleting ? 'Configurando...' : 'Comenzar Ahora'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="gap-2"
                size="lg"
                disabled={currentStep === 0 && !formData.acknowledged}
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Step 1: Welcome
function WelcomeStep({ formData, setFormData }: { formData: any; setFormData: any }) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-lg bg-emerald-50 border border-emerald-200">
          <Utensils className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
          <p className="font-semibold text-sm">Registro de Alimentos</p>
          <p className="text-xs text-stone-600 mt-1">Trackea tus comidas diarias</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
          <Dumbbell className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="font-semibold text-sm">Módulo de Ejercicio</p>
          <p className="text-xs text-stone-600 mt-1">Registra tus entrenamientos</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
          <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="font-semibold text-sm">Chat con IA</p>
          <p className="text-xs text-stone-600 mt-1">Asistencia 24/7</p>
        </div>
      </div>

      <label className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer hover:bg-stone-50 transition-colors">
        <input
          type="checkbox"
          checked={formData.acknowledged}
          onChange={(e) => setFormData({ ...formData, acknowledged: e.target.checked })}
          className="mt-1 h-4 w-4 text-emerald-600 rounded"
        />
        <span className="text-sm text-stone-700">
          Entiendo que NutriFlow es una herramienta de seguimiento y no reemplaza el consejo médico profesional.
        </span>
      </label>
    </div>
  );
}

// Step 2: Goal
function GoalStep({ formData, setFormData }: { formData: any; setFormData: any }) {
  const goals = [
    {
      id: 'lose',
      title: 'Perder Peso',
      description: 'Reducir grasa corporal de forma saludable',
      icon: TrendingUp,
      color: 'from-red-500 to-orange-600',
    },
    {
      id: 'maintain',
      title: 'Mantener Peso',
      description: 'Consolidar hábitos saludables',
      icon: Leaf,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'gain',
      title: 'Ganar Músculo',
      description: 'Aumentar masa muscular y fuerza',
      icon: Dumbbell,
      color: 'from-blue-500 to-indigo-600',
    },
  ];

  return (
    <div className="grid gap-3">
      {goals.map((goal) => (
        <button
          key={goal.id}
          onClick={() => setFormData({ ...formData, goal: goal.id })}
          className={`
            flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left
            ${formData.goal === goal.id
              ? 'border-emerald-600 bg-emerald-50 shadow-md'
              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
            }
          `}
        >
          <div className={`p-3 rounded-full bg-gradient-to-br ${goal.color}`}>
            <goal.icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">{goal.title}</p>
            <p className="text-sm text-stone-600">{goal.description}</p>
          </div>
          {formData.goal === goal.id && (
            <Check className="h-6 w-6 text-emerald-600" />
          )}
        </button>
      ))}
    </div>
  );
}

// Step 3: Activity Level
function ActivityStep({ formData, setFormData }: { formData: any; setFormData: any }) {
  const activityLevels = [
    {
      id: 'sedentary',
      title: 'Sedentario',
      description: 'Trabajo de oficina, poco o ningún ejercicio',
      multiplier: '1.2x',
    },
    {
      id: 'light',
      title: 'Ligero',
      description: 'Ejercicio ligero 1-3 días por semana',
      multiplier: '1.375x',
    },
    {
      id: 'moderate',
      title: 'Moderado',
      description: 'Ejercicio moderado 3-5 días por semana',
      multiplier: '1.55x',
    },
    {
      id: 'active',
      title: 'Activo',
      description: 'Ejercicio intenso 6-7 días por semana',
      multiplier: '1.725x',
    },
    {
      id: 'very_active',
      title: 'Muy Activo',
      description: 'Ejercicio muy intenso o trabajo físico',
      multiplier: '1.9x',
    },
  ];

  return (
    <div className="grid gap-2">
      {activityLevels.map((level) => (
        <button
          key={level.id}
          onClick={() => setFormData({ ...formData, activityLevel: level.id })}
          className={`
            flex items-center justify-between p-4 rounded-lg border-2 transition-all
            ${formData.activityLevel === level.id
              ? 'border-emerald-600 bg-emerald-50 shadow-md'
              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
            }
          `}
        >
          <div className="text-left">
            <p className="font-semibold">{level.title}</p>
            <p className="text-sm text-stone-600">{level.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-stone-100 px-2 py-1 rounded">
              {level.multiplier}
            </span>
            {formData.activityLevel === level.id && (
              <Check className="h-5 w-5 text-emerald-600" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// Step 4: Features
function FeaturesStep({ formData, setFormData }: { formData: any; setFormData: any }) {
  const features = [
    {
      icon: Utensils,
      title: 'Registro de Comidas',
      description: 'Anota todo lo que comes y bebe. La IA puede reconocer alimentos automáticamente (Premium).',
    },
    {
      icon: Dumbbell,
      title: 'Entrenamientos',
      description: 'Registra tus ejercicios, series, repeticiones y peso. Cálculo automático de calorías quemadas.',
    },
    {
      icon: MessageCircle,
      title: 'Chat con IA',
      description: 'Haz preguntas sobre nutrición y ejercicio. 5 mensajes/día gratis, ilimitado en Premium.',
    },
    {
      icon: TrendingUp,
      title: 'Progreso',
      description: 'Visualiza tu evolución con gráficos detallados. Exporta tus datos cuando quieras.',
    },
    {
      icon: Crown,
      title: 'Sin Anuncios',
      description: 'Los usuarios Premium y Pro disfrutan de la app sin interrupciones publicitarias.',
    },
  ];

  return (
    <div className="grid gap-3">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200"
        >
          <feature.icon className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">{feature.title}</p>
            <p className="text-xs text-stone-600 mt-1">{feature.description}</p>
          </div>
        </div>
      ))}

      <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Puedes invitar amigos con tu código de referido y ganar Premium gratis.
        </p>
      </div>
    </div>
  );
}

// Step 5: Complete
function CompleteStep({ formData, setFormData }: { formData: any; setFormData: any }) {
  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center animate-pulse-glow">
        <Check className="h-12 w-12 text-white" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold">¡Perfil Configurado!</h3>
        <p className="text-stone-600">
          Tu objetivo: <strong>{formData.goal === 'lose' ? 'Perder Peso' : formData.goal === 'gain' ? 'Ganar Músculo' : 'Mantener Peso'}</strong>
        </p>
        <p className="text-stone-600">
          Nivel de actividad: <strong>{formData.activityLevel === 'sedentary' ? 'Sedentario' : formData.activityLevel === 'very_active' ? 'Muy Activo' : formData.activityLevel}</strong>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-left">
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <Check className="h-5 w-5 text-emerald-600 mb-2" />
          <p className="text-sm font-medium">Objetivos calculados</p>
          <p className="text-xs text-stone-600">Calorías y macros personalizados</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <Check className="h-5 w-5 text-blue-600 mb-2" />
          <p className="text-sm font-medium">Dashboard listo</p>
          <p className="text-xs text-stone-600">Comienza a registrar hoy</p>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-800">
          🎁 <strong>Regalo de bienvenida:</strong> Usa el código <strong>WELCOME7</strong> en la página de suscripción para obtener 7 días Premium gratis.
        </p>
      </div>
    </div>
  );
}

export default OnboardingWizard;
