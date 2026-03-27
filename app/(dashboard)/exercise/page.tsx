'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Flame, Clock, Trash2, Plus, Crown } from 'lucide-react';
import Link from 'next/link';

interface ExerciseLog {
  _id: string;
  exerciseName: string;
  exerciseType: string;
  muscleGroups: string[];
  metValue: number;
  durationMin: number;
  caloriesBurned: number;
  setsData?: any[];
  notes?: string;
  date: string;
}

const EXERCISE_TYPES = [
  { value: 'strength', label: 'Fuerza' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'flexibility', label: 'Flexibilidad' },
  { value: 'hiit', label: 'HIIT' },
];

const MUSCLE_GROUPS = [
  'Pecho',
  'Espalda',
  'Hombros',
  'Bíceps',
  'Tríceps',
  'Abdomen',
  'Cuádriceps',
  'Isquiotibiales',
  'Glúteos',
  'Pantorrillas',
  'Cardio',
];

const EXERCISE_DATABASE: { name: string; met: number; type: string }[] = [
  { name: 'Sentadilla', met: 5.0, type: 'strength' },
  { name: 'Press de banca', met: 4.0, type: 'strength' },
  { name: 'Peso muerto', met: 6.0, type: 'strength' },
  { name: 'Press militar', met: 3.5, type: 'strength' },
  { name: 'Dominadas', met: 8.0, type: 'strength' },
  { name: 'Flexiones', met: 3.8, type: 'strength' },
  { name: 'Correr (moderado)', met: 8.0, type: 'cardio' },
  { name: 'Correr (rápido)', met: 11.0, type: 'cardio' },
  { name: 'Caminar', met: 3.5, type: 'cardio' },
  { name: 'Bicicleta estática', met: 7.0, type: 'cardio' },
  { name: 'Elíptica', met: 5.0, type: 'cardio' },
  { name: 'Natación', met: 6.0, type: 'cardio' },
  { name: 'Yoga', met: 2.5, type: 'flexibility' },
  { name: 'Estiramientos', met: 2.3, type: 'flexibility' },
  { name: 'HIIT', met: 12.0, type: 'hiit' },
];

export default function ExercisePage() {
  const { user, isPremium } = useAuth();
  const [logs, setLogs] = React.useState<ExerciseLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [totalCalories, setTotalCalories] = React.useState(0);

  React.useEffect(() => {
    if (isPremium) {
      loadLogs();
    }
  }, [isPremium]);

  const loadLogs = async () => {
    try {
      const response = await fetch('/api/exercise/log');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setTotalCalories(data.totalCalories);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const handleAddLog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const selectedExercise = EXERCISE_DATABASE.find(
        (ex) => ex.name === formData.get('exerciseName')
      );

      const response = await fetch('/api/exercise/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseName: formData.get('exerciseName'),
          exerciseType: formData.get('exerciseType'),
          muscleGroups: Array.from(formData.getAll('muscleGroups')),
          metValue: selectedExercise?.met || Number(formData.get('metValue')),
          durationMin: Number(formData.get('durationMin')),
          notes: formData.get('notes'),
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        loadLogs();
      }
    } catch (error) {
      console.error('Error adding log:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    try {
      const response = await fetch(`/api/exercise/log?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadLogs();
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  // Show upgrade prompt for free users
  if (!isPremium) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <Card>
            <CardHeader>
              <Crown className="h-16 w-16 text-emerald-700 mx-auto mb-4" />
              <CardTitle className="text-2xl">Módulo de Ejercicio</CardTitle>
              <CardDescription>
                Esta función está disponible solo para usuarios Premium
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-stone-600">
                Registra tus rutinas, calcula calorías quemadas automáticamente,
                y haz seguimiento de tu progreso con estadísticas detalladas.
              </p>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-emerald-600" />
                  <span>Registro de rutinas y ejercicios</span>
                </li>
                <li className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-emerald-600" />
                  <span>Cálculo automático de calorías quemadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span>Historial de entrenamientos</span>
                </li>
              </ul>
              <Link href="/subscription">
                <Button size="lg" className="mt-6">
                  Actualizar a Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Ejercicio</h1>
            <p className="text-stone-500">Registra tu entrenamiento de hoy</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Ejercicio
          </Button>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Calorías Quemadas Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center py-4">
              {totalCalories} kcal
            </div>
          </CardContent>
        </Card>

        {/* Add Exercise Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Agregar Ejercicio</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddLog} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exerciseName">Ejercicio</Label>
                    <select
                      id="exerciseName"
                      name="exerciseName"
                      className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      required
                    >
                      {EXERCISE_DATABASE.map((ex) => (
                        <option key={ex.name} value={ex.name}>
                          {ex.name} (MET: {ex.met})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exerciseType">Tipo</Label>
                    <select
                      id="exerciseType"
                      name="exerciseType"
                      className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      required
                    >
                      {EXERCISE_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="durationMin">Duración (minutos)</Label>
                    <Input
                      id="durationMin"
                      name="durationMin"
                      type="number"
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Grupos musculares</Label>
                    <select
                      name="muscleGroups"
                      multiple
                      className="flex min-h-[100px] w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      {MUSCLE_GROUPS.map((mg) => (
                        <option key={mg} value={mg}>
                          {mg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas (opcional)</Label>
                  <Input id="notes" name="notes" placeholder="Series, repeticiones, peso..." />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    Agregar
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Exercise Logs */}
        <div className="space-y-4">
          {logs.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-stone-500">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay ejercicios registrados hoy</p>
              </CardContent>
            </Card>
          ) : (
            logs.map((log) => (
              <Card key={log._id}>
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{log.exerciseName}</h3>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full capitalize">
                          {log.exerciseType}
                        </span>
                      </div>
                      <div className="text-sm text-stone-500 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {log.durationMin} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-4 w-4" />
                          {log.caloriesBurned} kcal
                        </span>
                      </div>
                      {log.muscleGroups.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {log.muscleGroups.map((mg, i) => (
                            <span key={i} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">
                              {mg}
                            </span>
                          ))}
                        </div>
                      )}
                      {log.notes && (
                        <p className="text-sm text-stone-600 mt-2">{log.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLog(log._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
