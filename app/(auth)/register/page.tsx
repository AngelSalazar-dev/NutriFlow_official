'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, Loader2, CheckCircle, Mail, Lock, User, Activity, Target, Scale, ChevronLeft, ChevronRight } from 'lucide-react';
import { ParticlesBackground } from '@/components/ui/ParticlesBackground';
import { useLang } from '@/context/LangContext';
import { ThemeLangToggle } from '@/components/ui/ThemeLangToggle';

const getActivityLevels = (tr: any) => [
  { value: 'sedentary', label: tr('auth_activity_sedentary'), desc: tr('auth_activity_sedentary_desc') },
  { value: 'light', label: tr('auth_activity_light'), desc: tr('auth_activity_light_desc') },
  { value: 'moderate', label: tr('auth_activity_moderate'), desc: tr('auth_activity_moderate_desc') },
  { value: 'active', label: tr('auth_activity_active'), desc: tr('auth_activity_active_desc') },
  { value: 'very_active', label: tr('auth_activity_very_active'), desc: tr('auth_activity_very_active_desc') },
];

const getGoals = (tr: any) => [
  { value: 'lose', label: tr('auth_goal_lose'), icon: '🏃' },
  { value: 'maintain', label: tr('auth_goal_maintain'), icon: '⚖️' },
  { value: 'gain', label: tr('auth_goal_gain'), icon: '💪' },
];

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  age?: string;
  weight?: string;
  height?: string;
}

import { Suspense } from 'react';

function RegisterForm() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const { tr, lang } = useLang();
  const searchParams = useSearchParams();
  const referralCodeFromUrl = searchParams.get('ref');
  const { success, error: toastError } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [step, setStep] = React.useState(1);
  const [validationErrors, setValidationErrors] = React.useState<ValidationErrors>({});
  
  const ACTIVITY_LEVELS = getActivityLevels(tr);
  const GOALS = getGoals(tr);

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
      errors.email = lang === 'es' ? 'Email inválido' : 'Invalid email';
    }

    if (formData.password && formData.password.length < 8) {
      errors.password = lang === 'es' ? 'Mínimo 8 caracteres' : 'Minimum 8 characters';
    } else if (formData.password && !/[A-Z]/.test(formData.password)) {
      errors.password = lang === 'es' ? 'Debe contener una mayúscula' : 'Must contain uppercase';
    } else if (formData.password && !/[a-z]/.test(formData.password)) {
      errors.password = lang === 'es' ? 'Debe contener una minúscula' : 'Must contain lowercase';
    } else if (formData.password && !/[0-9]/.test(formData.password)) {
      errors.password = lang === 'es' ? 'Debe contener un número' : 'Must contain a number';
    }

    // Validación de confirmación de contraseña
    if (formData.confirmPassword) {
      const pw = formData.password.trim();
      const cpw = formData.confirmPassword.trim();
      if (pw !== cpw) {
        errors.confirmPassword = lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match';
      }
    }

    if (formData.age && (Number(formData.age) < 10 || Number(formData.age) > 100)) {
      errors.age = lang === 'es' ? 'Edad entre 10 y 100' : 'Age between 10 and 100';
    }

    if (formData.weight && (Number(formData.weight) < 30 || Number(formData.weight) > 300)) {
      errors.weight = lang === 'es' ? 'Peso entre 30 y 300 kg' : 'Weight between 30 and 300 kg';
    }

    if (formData.height && (Number(formData.height) < 100 || Number(formData.height) > 250)) {
      errors.height = lang === 'es' ? 'Altura entre 100 y 250 cm' : 'Height between 100 and 250 cm';
    }

    setValidationErrors(errors);
  }, [formData.email, formData.password, formData.confirmPassword, formData.age, formData.weight, formData.height, lang]);

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
        referralCode: referralCodeFromUrl,
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
    <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative transition-colors duration-500">
      <ParticlesBackground />
      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col pt-8 pb-12 px-4 sm:px-8 lg:p-12 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-r border-slate-200 dark:border-slate-800 h-screen overflow-y-auto custom-scrollbar shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-lg mx-auto">
          <Card className="w-full shadow-none border-0 bg-transparent">
            {/* Header / Logo */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 transition-all group-hover:scale-110 shadow-lg shadow-emerald-500/20">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="font-heading text-2xl font-black bg-gradient-to-r from-emerald-700 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
                  NutriFlow
                </span>
              </Link>
              <ThemeLangToggle />
            </div>
            
            <CardHeader className="space-y-4 px-0 pt-0">
              <CardTitle className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none">
                {tr('auth_register')}
              </CardTitle>
              <CardDescription className="text-base text-slate-500 dark:text-slate-400 font-medium">
                {tr('auth_register_subtitle')}
              </CardDescription>
              
              {/* Progress Bar */}
              <div className="space-y-3 pt-6">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  <span>{tr('auth_steps')} {step} {tr('auth_step_of')} 3</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
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
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="space-y-2.5">
                      <Label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">{tr('auth_name')}</Label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors"><User className="h-5 w-5" /></div>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          placeholder="Ej: Juan Pérez"
                          required
                          disabled={isLoading}
                          className="pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-900 dark:text-slate-100 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">{tr('auth_email')}</Label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors"><Mail className="h-5 w-5" /></div>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="tu@email.com"
                          required
                          disabled={isLoading}
                          className={`pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-900 dark:text-slate-100 transition-all ${validationErrors.email ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                        />
                      </div>
                      {validationErrors.email && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1 animate-fade-in">
                          {validationErrors.email}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2.5">
                      <Label htmlFor="password" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">{tr('auth_password')}</Label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors"><Lock className="h-5 w-5" /></div>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          minLength={8}
                          required
                          disabled={isLoading}
                          className={`pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-900 dark:text-slate-100 transition-all ${validationErrors.password ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                        />
                      </div>
                      {validationErrors.password && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1 animate-fade-in">
                          {validationErrors.password}
                        </p>
                      )}
                      {formData.password && !validationErrors.password && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest flex items-center gap-2 ml-1 animate-fade-in">
                          <CheckCircle className="h-4 w-4" /> {lang === 'es' ? 'Contraseña segura' : 'Secure password'}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2.5">
                      <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">{lang === 'es' ? 'Confirmar contraseña' : 'Confirm password'}</Label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors"><Lock className="h-5 w-5" /></div>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => updateField('confirmPassword', e.target.value)}
                          placeholder="Repita su contraseña"
                          minLength={8}
                          required
                          disabled={isLoading}
                          className={`pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-900 dark:text-slate-100 transition-all ${validationErrors.confirmPassword ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                        />
                      </div>
                      {validationErrors.confirmPassword && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1 animate-fade-in">
                          {validationErrors.confirmPassword}
                        </p>
                      )}
                      {formData.confirmPassword && formData.password === formData.confirmPassword && !validationErrors.confirmPassword && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest flex items-center gap-2 ml-1 animate-fade-in">
                          <CheckCircle className="h-4 w-4" /> {lang === 'es' ? 'Las contraseñas coinciden' : 'Passwords match'}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Datos Físicos */}
                {step === 2 && (
                  <div className="space-y-8 animate-fade-in-up">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <Label htmlFor="age" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-emerald-500" /> {tr('auth_age')}
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
                          className={`h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-900 dark:text-slate-100 transition-all ${validationErrors.age ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                        />
                        {validationErrors.age && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1">{validationErrors.age}</p>}
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="sex" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">{tr('auth_sex')}</Label>
                        <select
                          id="sex"
                          value={formData.sex}
                          onChange={(e) => updateField('sex', e.target.value)}
                          className="flex h-14 w-full rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                          required
                          disabled={isLoading}
                        >
                          <option value="male">{tr('auth_male')}</option>
                          <option value="female">{tr('auth_female')}</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <Label htmlFor="weight" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-2">
                          <Scale className="h-4 w-4 text-emerald-500" /> {tr('auth_weight')}
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
                          className={`h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-900 dark:text-slate-100 transition-all ${validationErrors.weight ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                        />
                        {validationErrors.weight && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1">{validationErrors.weight}</p>}
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="height" className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-2">
                          <Target className="h-4 w-4 text-emerald-500" /> {tr('auth_height')}
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
                          className={`h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-900 dark:text-slate-100 transition-all ${validationErrors.height ? 'border-red-400 ring-2 ring-red-400/20' : ''}`}
                        />
                        {validationErrors.height && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1">{validationErrors.height}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Actividad y Objetivos */}
                {step === 3 && (
                  <div className="space-y-8 animate-fade-in-up">
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">
                        {tr('auth_activity_title')}
                      </Label>
                      <div className="grid gap-3">
                        {ACTIVITY_LEVELS.map((level) => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => updateField('activityLevel', level.value)}
                            className={`p-5 rounded-2xl border text-left transition-all duration-300 group ${
                              formData.activityLevel === level.value
                                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`font-bold text-sm tracking-tight ${formData.activityLevel === level.value ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{level.label}</span>
                              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.activityLevel === level.value ? 'border-emerald-500 bg-emerald-500 shadow-md' : 'border-slate-300 dark:border-slate-700'}`}>
                                {formData.activityLevel === level.value && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">{level.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-1">
                        {tr('auth_goal_title')}
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {GOALS.map((goal) => (
                          <button
                            key={goal.value}
                            type="button"
                            onClick={() => updateField('goal', goal.value)}
                            className={`p-6 flex flex-col items-center justify-center gap-3 rounded-2xl border text-center transition-all duration-300 group ${
                              formData.goal === goal.value
                                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/10 scale-[1.05]'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20'
                            }`}
                          >
                            <span className="text-4xl group-hover:scale-110 transition-transform">{goal.icon}</span>
                            <span className={`font-black text-[10px] uppercase tracking-widest ${formData.goal === goal.value ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>{goal.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-6 px-0 pt-6">
                <div className="flex gap-4 w-full">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      disabled={isLoading}
                      className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      {tr('auth_back')}
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => setStep(step + 1)}
                      disabled={!canContinue() || isLoading}
                      className="flex-[2] h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-emerald-600 to-emerald-500 hover:scale-[1.02] shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-30"
                    >
                      {tr('auth_continue')}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex-[2] h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-emerald-600 to-teal-600 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all disabled:opacity-30"
                      disabled={isLoading || !canContinue()}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {tr('auth_creating')}
                        </>
                      ) : (
                        tr('auth_start_now')
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="text-[10px] font-black text-center text-slate-400 dark:text-slate-500 uppercase tracking-widest w-full border-t border-slate-100 dark:border-slate-800 pt-8">
                  {tr('auth_already_account')}{' '}
                  <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline decoration-emerald-500/30 underline-offset-4 transition-all">
                    {tr('auth_login')}
                  </Link>
                </div>
                <div className="text-[10px] font-bold text-center text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-relaxed uppercase tracking-wider opacity-60">
                   {tr('auth_terms_agree')}{' '}
                  <Link href="/terms" className="text-slate-500 hover:text-emerald-500 transition-colors">{tr('auth_terms')}</Link>{' '}
                  {lang === 'es' ? 'y' : 'and'} <Link href="/privacy" className="text-slate-500 hover:text-emerald-500 transition-colors">{tr('auth_privacy')}</Link>.
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      
      {/* Visual / Image Side */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center pointer-events-none">
        {/* Realistic background image with Next.js optimization */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/auth-real-bg.png" 
            alt="Healthy Lifestyle" 
            className="w-full h-full object-cover"
          />
          {/* Grainy texture overlay for premium feel */}
          <div className="absolute inset-0 bg-emerald-950/40 mix-blend-multiply opacity-50" />
        </div>

        {/* Animated health/fitness themed background elements (Subtle) */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[130px] animate-pulse" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/20 blur-[150px] animate-pulse [animation-delay:2s]" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-teal-950/40 to-transparent z-20" />

        <div className="relative z-20 p-16 max-w-xl text-center mt-auto mb-24 animate-fade-in-up space-y-8">
           <div className="inline-flex p-6 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 mb-2 shadow-2xl animate-float">
             <Leaf className="h-12 w-12 text-emerald-400" />
           </div>
           <h2 className="text-5xl lg:text-6xl font-heading font-black text-white mb-6 tracking-tighter leading-none">
             {lang === 'es' ? 'Descubre la mejor' : 'Discover the best'}
             <span className="block text-white/50">{lang === 'es' ? 'versión de ti.' : 'version of you.'}</span>
           </h2>
           <p className="text-slate-300 text-xl leading-relaxed font-light max-w-md mx-auto">
             {tr('auth_health_rules_desc')}
           </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
