'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, Loader2, CheckCircle, Mail, Lock, User, Activity, Target, Scale } from 'lucide-react';
import { ParticlesBackground } from '@/components/ui/ParticlesBackground';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentario', desc: 'Poco o nada de ejercicio' },
  { value: 'light', label: 'Ligero', desc: 'Ejercicio 1-3 días/semana' },
  { value: 'moderate', label: 'Moderado', desc: 'Ejercicio 3-5 días/semana' },
  { value: 'active', label: 'Activo', desc: 'Ejercicio 6-7 días/semana' },
  { value: 'very_active', label: 'Muy activo', desc: 'Ejercicio muy intenso' },
];

const GOALS = [
  { value: 'lose', label: 'Perder peso', icon: '🏃' },
  { value: 'maintain', label: 'Mantener peso', icon: '⚖️' },
  { value: 'gain', label: 'Ganar músculo', icon: '💪' },
];

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  age?: string;
  weight?: string;
  height?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [step, setStep] = React.useState(1);
  const [validationErrors, setValidationErrors] = React.useState<ValidationErrors>({});

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    sex: 'male' as 'male' | 'female',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    goal: 'maintain',
  });

  React.useEffect(() => {
    // Navigation is handled by register() function after successful registration
  }, []);

  // Validaciones en tiempo real
  React.useEffect(() => {
    const errors: ValidationErrors = {};

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (formData.password && formData.password.length < 8) {
      errors.password = 'Mínimo 8 caracteres';
    } else if (formData.password && !/[A-Z]/.test(formData.password)) {
      errors.password = 'Debe contener una mayúscula';
    } else if (formData.password && !/[a-z]/.test(formData.password)) {
      errors.password = 'Debe contener una minúscula';
    } else if (formData.password && !/[0-9]/.test(formData.password)) {
      errors.password = 'Debe contener un número';
    }

    // Validación de confirmación de contraseña
    if (formData.confirmPassword) {
      const pw = formData.password.trim();
      const cpw = formData.confirmPassword.trim();
      console.log('Password validation:', { pw, cpw, match: pw === cpw });
      if (pw !== cpw) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    if (formData.age && (Number(formData.age) < 10 || Number(formData.age) > 100)) {
      errors.age = 'Edad entre 10 y 100';
    }

    if (formData.weight && (Number(formData.weight) < 30 || Number(formData.weight) > 300)) {
      errors.weight = 'Peso entre 30 y 300 kg';
    }

    if (formData.height && (Number(formData.height) < 100 || Number(formData.height) > 250)) {
      errors.height = 'Altura entre 100 y 250 cm';
    }

    setValidationErrors(errors);
  }, [formData.email, formData.password, formData.confirmPassword, formData.age, formData.weight, formData.height]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (step < 3) {
      if (canContinue()) {
        setStep(step + 1);
      }
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.name,
        age: Number(formData.age),
        sex: formData.sex,
        weight: Number(formData.weight),
        height: Number(formData.height),
        activityLevel: formData.activityLevel as any,
        goal: formData.goal as any,
      });

      success('¡Cuenta creada!', 'Redirigiendo al dashboard...');
      // Navigation is handled by register() function
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Error al registrar');
      toastError('Error', err.message || 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const canContinue = () => {
    if (step === 1) {
      return formData.name && formData.email && formData.password && formData.confirmPassword &&
             formData.password.length >= 8 && formData.password === formData.confirmPassword &&
             /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) && /[0-9]/.test(formData.password) &&
             Object.keys(validationErrors).length === 0;
    }
    if (step === 2) {
      return formData.age && formData.sex && formData.weight && formData.height &&
             Object.keys(validationErrors).length === 0;
    }
    return true;
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden relative">
      <ParticlesBackground />
      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col pt-8 pb-12 px-4 sm:px-8 lg:p-12 z-10 bg-background/80 backdrop-blur-2xl border-r border-stone-200/50 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.1)] h-screen overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-lg mx-auto">
          <Card className="w-full shadow-none border-0 bg-transparent">
            {/* Header / Logo */}
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group w-fit">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 transition-transform group-hover:scale-105 shadow-md">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading text-xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                NutriFlow
              </span>
            </Link>
            
            <CardHeader className="space-y-3 px-0 pt-0">
              <CardTitle className="text-3xl font-bold text-foreground">
                Únete a NutriFlow
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Completa tu perfil para comenzar tu transformación.
              </CardDescription>
              
              {/* Progress Bar */}
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Paso {step} de 3</span>
                  <span className="text-emerald-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 rounded-full" />
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit} className="mt-4">
              <CardContent className="space-y-6 px-0 pb-6">
                {error && (
                  <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-start gap-2 animate-fade-in">
                     <span className="mt-0.5">⚠️</span>
                     <span className="font-medium">{error}</span>
                  </div>
                )}

                {/* Step 1: Información Básica */}
                {step === 1 && (
                  <div className="space-y-5 animate-fade-in-up">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-medium">Nombre completo</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><User className="h-5 w-5" /></div>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          placeholder="Ej: Juan Pérez"
                          required
                          disabled={isLoading}
                          className="pl-10 h-12 rounded-xl bg-stone-50 border-stone-200 transition-all focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-medium">Email</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Mail className="h-5 w-5" /></div>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="tu@email.com"
                          required
                          disabled={isLoading}
                          className={`pl-10 h-12 rounded-xl bg-stone-50 border-stone-200 transition-all focus:ring-2 focus:ring-emerald-500 ${validationErrors.email ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                        />
                      </div>
                      {validationErrors.email && (
                        <p className="text-xs text-red-500 font-medium ml-1">
                          ⚠️ {validationErrors.email}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-medium">Contraseña</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Lock className="h-5 w-5" /></div>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          minLength={8}
                          required
                          disabled={isLoading}
                          className={`pl-10 h-12 rounded-xl bg-stone-50 border-stone-200 transition-all focus:ring-2 focus:ring-emerald-500 ${validationErrors.password ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                        />
                      </div>
                      {validationErrors.password && (
                        <p className="text-xs text-red-500 font-medium ml-1">
                          ⚠️ {validationErrors.password}
                        </p>
                      )}
                      {formData.password && formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) && /[0-9]/.test(formData.password) && (
                        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 ml-1">
                          <CheckCircle className="h-3.5 w-3.5" /> Contraseña segura
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="font-medium">Confirmar contraseña</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Lock className="h-5 w-5" /></div>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => updateField('confirmPassword', e.target.value)}
                          placeholder="Repita su contraseña"
                          minLength={8}
                          required
                          disabled={isLoading}
                          className={`pl-10 h-12 rounded-xl bg-stone-50 border-stone-200 transition-all focus:ring-2 focus:ring-emerald-500 ${validationErrors.confirmPassword ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                        />
                      </div>
                      {validationErrors.confirmPassword && (
                        <p className="text-xs text-red-500 font-medium ml-1">
                          ⚠️ {validationErrors.confirmPassword}
                        </p>
                      )}
                      {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6 && (
                        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 ml-1">
                          <CheckCircle className="h-3.5 w-3.5" /> Las contraseñas coinciden
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Datos Físicos */}
                {step === 2 && (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="age" className="font-medium flex items-center gap-2">
                          <Activity className="h-4 w-4 opacity-70" /> Edad
                        </Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => updateField('age', e.target.value)}
                          placeholder="25"
                          min="10"
                          max="100"
                          required
                          disabled={isLoading}
                          className={`h-12 rounded-xl bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 ${validationErrors.age ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                        />
                        {validationErrors.age && <p className="text-xs text-red-500 ml-1">{validationErrors.age}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sex" className="font-medium">Sexo</Label>
                        <select
                          id="sex"
                          value={formData.sex}
                          onChange={(e) => updateField('sex', e.target.value)}
                          className="flex h-12 w-full rounded-xl bg-stone-50 border border-stone-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                          required
                          disabled={isLoading}
                        >
                          <option value="male">Hombre</option>
                          <option value="female">Mujer</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="weight" className="font-medium flex items-center gap-2">
                          <Scale className="h-4 w-4 opacity-70" /> Peso (kg)
                        </Label>
                        <Input
                          id="weight"
                          type="number"
                          value={formData.weight}
                          onChange={(e) => updateField('weight', e.target.value)}
                          placeholder="70"
                          step="0.1"
                          min="30"
                          max="300"
                          required
                          disabled={isLoading}
                          className={`h-12 rounded-xl bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 ${validationErrors.weight ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                        />
                        {validationErrors.weight && <p className="text-xs text-red-500 ml-1">{validationErrors.weight}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height" className="font-medium text-muted-foreground flex items-center gap-2">
                          <span className="font-bold font-mono opacity-70 w-4 pl-0.5 select-none">H</span> Altura (cm)
                        </Label>
                        <Input
                          id="height"
                          type="number"
                          value={formData.height}
                          onChange={(e) => updateField('height', e.target.value)}
                          placeholder="170"
                          min="100"
                          max="250"
                          required
                          disabled={isLoading}
                          className={`h-12 rounded-xl bg-stone-50 border-stone-200 focus:ring-2 focus:ring-emerald-500 ${validationErrors.height ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                        />
                        {validationErrors.height && <p className="text-xs text-red-500 ml-1">{validationErrors.height}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Actividad y Objetivos */}
                {step === 3 && (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="space-y-3">
                      <Label className="font-medium flex items-center gap-2 text-base">
                        Actividad física actual
                      </Label>
                      <div className="grid gap-2">
                        {ACTIVITY_LEVELS.map((level) => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => updateField('activityLevel', level.value)}
                            className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                              formData.activityLevel === level.value
                                ? 'border-emerald-500 bg-emerald-50/50'
                                : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm">{level.label}</span>
                              <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${formData.activityLevel === level.value ? 'border-emerald-500 bg-emerald-500' : 'border-stone-300'}`}>
                                {formData.activityLevel === level.value && <CheckCircle className="h-3 w-3 text-white" />}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5">{level.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="font-medium flex items-center gap-2 text-base">
                        Tu objetivo
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {GOALS.map((goal) => (
                          <button
                            key={goal.value}
                            type="button"
                            onClick={() => updateField('goal', goal.value)}
                            className={`p-4 flex flex-col items-center justify-center gap-2 rounded-xl border text-center transition-all duration-200 ${
                              formData.goal === goal.value
                                ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                                : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                            }`}
                          >
                            <span className="text-3xl filter hover:brightness-110">{goal.icon}</span>
                            <span className="font-medium text-xs uppercase tracking-wide">{goal.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-5 px-0">
                <div className="flex gap-3 w-full">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      disabled={isLoading}
                      className="flex-1 h-12 rounded-xl text-base border-stone-200 bg-background hover:bg-stone-100"
                    >
                      Atrás
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => setStep(step + 1)}
                      disabled={!canContinue() || isLoading}
                      className="flex-1 h-12 rounded-xl text-base bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50"
                    >
                      Continuar
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex-1 h-12 rounded-xl text-base btn-glow disabled:opacity-50"
                      disabled={isLoading || !canContinue()}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creando cuenta...
                        </>
                      ) : (
                        'Comenzar Ahora'
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="text-sm text-center text-muted-foreground w-full border-t border-stone-100 pt-5">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold">
                    Inicia sesión
                  </Link>
                </div>
                <div className="text-xs text-center text-stone-400 max-w-[280px] mx-auto leading-relaxed">
                  Al registrarte, confirmas tu acuerdo con nuestros{' '}
                  <Link href="/terms" className="text-stone-500 hover:underline">Términos</Link>{' '}
                  y <Link href="/privacy" className="text-stone-500 hover:underline">Política de Privacidad</Link>.
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      
      {/* Visual / Image Side */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-stone-950 items-center justify-center pointer-events-none">
        <div className="absolute inset-0 z-0 opacity-80">
          <Image src="/fitness-glow.png" alt="NutriFlow Abstract Premium" fill className="object-cover" priority sizes="50vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent z-10" />
        
        <div className="relative z-20 p-12 max-w-xl text-center mt-auto mb-24 animate-fade-in-up">
           <div className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 mb-6 shadow-2xl">
             <Leaf className="h-10 w-10 text-emerald-400" />
           </div>
           <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-5 tracking-tight leading-tight">
             Descubre la mejor versión de ti
           </h2>
           <p className="text-stone-300 text-lg leading-relaxed max-w-md mx-auto">
             Integra tus datos, optimiza tu alimentación y potencia tu rendimiento físico en una sola plataforma.
           </p>
        </div>
      </div>
    </div>
  );
}
