'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Loader2 } from 'lucide-react';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentario (poco o nada de ejercicio)' },
  { value: 'light', label: 'Ligero (ejercicio 1-3 días/semana)' },
  { value: 'moderate', label: 'Moderado (ejercicio 3-5 días/semana)' },
  { value: 'active', label: 'Activo (ejercicio 6-7 días/semana)' },
  { value: 'very_active', label: 'Muy activo (ejercicio muy intenso)' },
];

const GOALS = [
  { value: 'lose', label: 'Perder peso' },
  { value: 'maintain', label: 'Mantener peso' },
  { value: 'gain', label: 'Ganar masa muscular' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [step, setStep] = React.useState(1);
  
  // Estado para guardar los datos del formulario
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    age: '',
    sex: 'male' as 'male' | 'female',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    goal: 'maintain',
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Sending data:', formData);

      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        age: Number(formData.age),
        sex: formData.sex,
        weight: Number(formData.weight),
        height: Number(formData.height),
        activityLevel: formData.activityLevel as any,
        goal: formData.goal as any,
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Error al registrar');
    } finally {
      setIsLoading(false);
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Leaf className="h-12 w-12 text-emerald-700" />
          </div>
          <CardTitle className="text-2xl text-center">Crear cuenta</CardTitle>
          <CardDescription className="text-center">
            Completa tu perfil para comenzar
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    minLength={6}
                    required
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Edad</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      min="10"
                      max="100"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex">Sexo</Label>
                    <select
                      id="sex"
                      value={formData.sex}
                      onChange={(e) => updateField('sex', e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                      disabled={isLoading}
                    >
                      <option value="male">Hombre</option>
                      <option value="female">Mujer</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => updateField('weight', e.target.value)}
                      step="0.1"
                      min="30"
                      max="300"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => updateField('height', e.target.value)}
                      min="100"
                      max="250"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Nivel de actividad física</Label>
                  <select
                    id="activityLevel"
                    value={formData.activityLevel}
                    onChange={(e) => updateField('activityLevel', e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                    disabled={isLoading}
                  >
                    {ACTIVITY_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Objetivo</Label>
                  <select
                    id="goal"
                    value={formData.goal}
                    onChange={(e) => updateField('goal', e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                    disabled={isLoading}
                  >
                    {GOALS.map((goal) => (
                      <option key={goal.value} value={goal.value}>
                        {goal.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex gap-2 w-full">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} disabled={isLoading} className="flex-1">
                  Atrás
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" variant="default" onClick={() => setStep(step + 1)} disabled={isLoading} className="flex-1">
                  Continuar
                </Button>
              ) : (
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear cuenta
                </Button>
              )}
            </div>
            <div className="text-sm text-center text-stone-500">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-emerald-700 hover:underline font-medium">
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
