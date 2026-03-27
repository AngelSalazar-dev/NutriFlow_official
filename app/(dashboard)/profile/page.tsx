'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Save, Loader2 } from 'lucide-react';

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

export default function ProfilePage() {
  const { user, updateUser, isPremium } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    age: user?.age || 25,
    sex: user?.sex || 'male',
    weight: user?.weight || 70,
    height: user?.height || 170,
    activityLevel: user?.activityLevel || 'sedentary',
    goal: user?.goal || 'maintain',
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || 25,
        sex: user.sex || 'male',
        weight: user.weight || 70,
        height: user.height || 170,
        activityLevel: user.activityLevel || 'sedentary',
        goal: user.goal || 'maintain',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await updateUser(formData);
      setMessage('Perfil actualizado correctamente');
    } catch (error: any) {
      setMessage(error.message || 'Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-stone-500">Gestiona tu información personal y objetivos</p>
        </div>

        {/* Profile Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>TDEE (Gasto diario)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">{user.tdee || 0}</div>
              <div className="text-xs text-stone-500">calorías/día</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>BMR (Metabolismo basal)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.bmr || 0}</div>
              <div className="text-xs text-stone-500">calorías/día</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Objetivo calórico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.calorieGoal || 0}</div>
              <div className="text-xs text-stone-500">calorías/día</div>
            </CardContent>
          </Card>
        </div>

        {/* Macro Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Objetivos de Macronutrientes</CardTitle>
            <CardDescription>Tus metas diarias basadas en tu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-stone-50 rounded-lg">
                <div className="text-3xl font-bold text-emerald-700">{user.proteinGoal || 0}g</div>
                <div className="text-sm text-stone-500 mt-1">Proteínas</div>
                <div className="text-xs text-stone-400">{Math.round(((user.proteinGoal || 0) * 4 / (user.calorieGoal || 1)) * 100)}% del total</div>
              </div>
              <div className="text-center p-4 bg-stone-50 rounded-lg">
                <div className="text-3xl font-bold text-emerald-700">{user.carbGoal || 0}g</div>
                <div className="text-sm text-stone-500 mt-1">Carbohidratos</div>
                <div className="text-xs text-stone-400">{Math.round(((user.carbGoal || 0) * 4 / (user.calorieGoal || 1)) * 100)}% del total</div>
              </div>
              <div className="text-center p-4 bg-stone-50 rounded-lg">
                <div className="text-3xl font-bold text-emerald-700">{user.fatGoal || 0}g</div>
                <div className="text-sm text-stone-500 mt-1">Grasas</div>
                <div className="text-xs text-stone-400">{Math.round(((user.fatGoal || 0) * 9 / (user.calorieGoal || 1)) * 100)}% del total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Editar Perfil
            </CardTitle>
            <CardDescription>
              Actualiza tu información para recalcular tus objetivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex">Sexo</Label>
                  <select
                    id="sex"
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value as 'male' | 'female' })}
                    className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    required
                  >
                    <option value="male">Hombre</option>
                    <option value="female">Mujer</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="activityLevel">Nivel de actividad física</Label>
                <select
                  id="activityLevel"
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
                  className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  required
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
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
                  className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  required
                >
                  {GOALS.map((goal) => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </div>

              {message && (
                <div className={`p-3 text-sm rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {message}
                </div>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                Guardar cambios
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
