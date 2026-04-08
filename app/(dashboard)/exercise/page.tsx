'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Dumbbell,
  Flame,
  Clock,
  Trash2,
  Plus,
  Crown,
  Heart,
  Timer,
  Zap,
  Target,
  ChevronDown,
  X,
  Check,
  Loader2,
  TrendingUp,
  Calendar,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

interface ExerciseLog {
  id: string;
  exerciseName: string;
  exerciseType: string;
  muscleGroups: string[];
  metValue: number;
  durationMin: number;
  caloriesBurned: number;
  notes?: string;
  date: string;
  createdAt: string;
}

interface Exercise {
  id: string;
  name: string;
  met: number;
  type: string;
  muscleGroups: string[];
  icon: string;
  emoji: string;
}

const EXERCISE_DATABASE: Exercise[] = [
  // Strength
  { id: 'str-1', name: 'Sentadilla', met: 5.0, type: 'strength', muscleGroups: ['Cuádriceps', 'Glúteos'], icon: 'legs', emoji: '🏋️' },
  { id: 'str-2', name: 'Press de banca', met: 4.0, type: 'strength', muscleGroups: ['Pecho', 'Tríceps'], icon: 'chest', emoji: '💪' },
  { id: 'str-3', name: 'Peso muerto', met: 6.0, type: 'strength', muscleGroups: ['Espalda', 'Isquiotibiales'], icon: 'back', emoji: '🏋️' },
  { id: 'str-4', name: 'Press militar', met: 3.5, type: 'strength', muscleGroups: ['Hombros', 'Tríceps'], icon: 'shoulders', emoji: '💪' },
  { id: 'str-5', name: 'Dominadas', met: 8.0, type: 'strength', muscleGroups: ['Espalda', 'Bíceps'], icon: 'back', emoji: '🔝' },
  { id: 'str-6', name: 'Flexiones', met: 3.8, type: 'strength', muscleGroups: ['Pecho', 'Tríceps'], icon: 'chest', emoji: '💪' },
  { id: 'str-7', name: 'Curl de bíceps', met: 3.0, type: 'strength', muscleGroups: ['Bíceps'], icon: 'arms', emoji: '💪' },
  { id: 'str-8', name: 'Extensiones de tríceps', met: 3.0, type: 'strength', muscleGroups: ['Tríceps'], icon: 'arms', emoji: '💪' },
  { id: 'str-9', name: 'Prensa de piernas', met: 4.5, type: 'strength', muscleGroups: ['Cuádriceps', 'Glúteos'], icon: 'legs', emoji: '🦵' },
  { id: 'str-10', name: 'Plancha', met: 3.5, type: 'strength', muscleGroups: ['Abdomen'], icon: 'core', emoji: '🎯' },
  // Cardio
  { id: 'card-1', name: 'Correr (moderado)', met: 8.0, type: 'cardio', muscleGroups: ['Cardio', 'Cuádriceps'], icon: 'running', emoji: '🏃' },
  { id: 'card-2', name: 'Correr (rápido)', met: 11.0, type: 'cardio', muscleGroups: ['Cardio', 'Cuádriceps'], icon: 'running', emoji: '🏃' },
  { id: 'card-3', name: 'Caminar', met: 3.5, type: 'cardio', muscleGroups: ['Cardio'], icon: 'walking', emoji: '🚶' },
  { id: 'card-4', name: 'Bicicleta estática', met: 7.0, type: 'cardio', muscleGroups: ['Cardio', 'Cuádriceps'], icon: 'cycling', emoji: '🚴' },
  { id: 'card-5', name: 'Elíptica', met: 5.0, type: 'cardio', muscleGroups: ['Cardio'], icon: 'elliptical', emoji: '🏃' },
  { id: 'card-6', name: 'Natación', met: 6.0, type: 'cardio', muscleGroups: ['Cardio', 'Espalda'], icon: 'swimming', emoji: '🏊' },
  { id: 'card-7', name: 'Saltar cuerda', met: 10.0, type: 'cardio', muscleGroups: ['Cardio', 'Pantorrillas'], icon: 'jumping', emoji: '⏱️' },
  { id: 'card-8', name: 'Senderismo', met: 6.0, type: 'cardio', muscleGroups: ['Cardio', 'Cuádriceps'], icon: 'hiking', emoji: '🥾' },
  // Flexibility
  { id: 'flex-1', name: 'Yoga', met: 2.5, type: 'flexibility', muscleGroups: ['Cardio'], icon: 'yoga', emoji: '🧘' },
  { id: 'flex-2', name: 'Estiramientos', met: 2.3, type: 'flexibility', muscleGroups: ['Cardio'], icon: 'stretch', emoji: '🤸' },
  { id: 'flex-3', name: 'Pilates', met: 3.0, type: 'flexibility', muscleGroups: ['Abdomen'], icon: 'pilates', emoji: '🧘' },
  // HIIT
  { id: 'hiit-1', name: 'HIIT', met: 12.0, type: 'hiit', muscleGroups: ['Cardio', 'Cuádriceps'], icon: 'hiit', emoji: '⚡' },
  { id: 'hiit-2', name: 'Burpees', met: 10.0, type: 'hiit', muscleGroups: ['Cardio', 'Pecho'], icon: 'burpee', emoji: '🔥' },
  { id: 'hiit-3', name: 'Jumping Jacks', met: 8.0, type: 'hiit', muscleGroups: ['Cardio'], icon: 'jumping', emoji: '⭐' },
  { id: 'hiit-4', name: 'Mountain Climbers', met: 9.0, type: 'hiit', muscleGroups: ['Abdomen', 'Cardio'], icon: 'climber', emoji: '🧗' },
];

const EXERCISE_CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Target, emoji: '🎯' },
  { id: 'strength', label: 'Fuerza', icon: Dumbbell, emoji: '💪' },
  { id: 'cardio', label: 'Cardio', icon: Heart, emoji: '❤️' },
  { id: 'flexibility', label: 'Flexibilidad', icon: Activity, emoji: '🧘' },
  { id: 'hiit', label: 'HIIT', icon: Zap, emoji: '⚡' },
];

const MUSCLE_GROUPS = [
  { id: 'Pecho', emoji: '🫁' },
  { id: 'Espalda', emoji: '🔙' },
  { id: 'Hombros', emoji: '🤷' },
  { id: 'Bíceps', emoji: '💪' },
  { id: 'Tríceps', emoji: '🦾' },
  { id: 'Abdomen', emoji: '🎯' },
  { id: 'Cuádriceps', emoji: '🦵' },
  { id: 'Isquiotibiales', emoji: '🦿' },
  { id: 'Glúteos', emoji: '🍑' },
  { id: 'Pantorrillas', emoji: '🦶' },
  { id: 'Cardio', emoji: '❤️' },
];

const CATEGORY_COLORS: Record<string, string> = {
  strength: 'from-blue-500 to-blue-600',
  cardio: 'from-red-500 to-red-600',
  flexibility: 'from-purple-500 to-purple-600',
  hiit: 'from-orange-500 to-orange-600',
};

const CATEGORY_BG: Record<string, string> = {
  strength: 'bg-blue-50 border-blue-200 text-blue-700',
  cardio: 'bg-red-50 border-red-200 text-red-700',
  flexibility: 'bg-purple-50 border-purple-200 text-purple-700',
  hiit: 'bg-orange-50 border-orange-200 text-orange-700',
};

export default function ExercisePage() {
  const { user, isPremium } = useAuth();
  const toast = useToast();
  const [logs, setLogs] = React.useState<ExerciseLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [totalCalories, setTotalCalories] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedExercise, setSelectedExercise] = React.useState<Exercise | null>(null);
  const [durationMin, setDurationMin] = React.useState(30);
  const [selectedMuscles, setSelectedMuscles] = React.useState<string[]>([]);
  const [notes, setNotes] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const response = await fetch('/api/exercise/log', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        const logsArray = data.logs || [];
        setLogs(logsArray);
        setTotalCalories(data.totalCalories || 0);
      } else {
        console.error('[EXERCISE] loadLogs failed:', response.status);
        setLogs([]);
        setTotalCalories(0);
      }
    } catch (error) {
      console.error('[EXERCISE] Error loading logs:', error);
      setLogs([]);
      setTotalCalories(0);
    }
  };

  const filteredExercises = EXERCISE_DATABASE.filter((ex) => {
    const matchesCategory = selectedCategory === 'all' || ex.type === selectedCategory;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setSelectedMuscles(exercise.muscleGroups);
    setShowAddForm(true);
  };

  const toggleMuscle = (muscleId: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscleId)
        ? prev.filter((m) => m !== muscleId)
        : [...prev, muscleId]
    );
  };

  const calculateCaloriesBurned = () => {
    if (!selectedExercise || !user?.weight) return 0;
    const weightKg = Number(user.weight) || 70;
    const met = selectedExercise.met;
    const duration = durationMin;
    // Formula: MET * weight(kg) * duration(hours)
    return Math.round(met * weightKg * (duration / 60));
  };

  const handleAddLog = async () => {
    if (!selectedExercise) return;
    setIsSaving(true);

    try {
      const caloriesBurned = calculateCaloriesBurned();

      const response = await fetch('/api/exercise/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          exerciseName: selectedExercise.name,
          exerciseType: selectedExercise.type,
          muscleGroups: selectedMuscles,
          metValue: selectedExercise.met,
          durationMin,
          caloriesBurned,
          notes: notes || undefined,
        }),
      });

      if (response.ok) {
        toast.success('Ejercicio registrado', `${selectedExercise.name} — ${caloriesBurned} kcal quemadas`);
        setShowAddForm(false);
        setSelectedExercise(null);
        setDurationMin(30);
        setSelectedMuscles([]);
        setNotes('');
        await loadLogs();
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error('[EXERCISE] Save failed:', response.status, JSON.stringify(errData));
        toast.error('Error', errData.error || 'No se pudo guardar el ejercicio');
      }
    } catch (error) {
      console.error('[EXERCISE] Error adding log:', error);
      toast.error('Error de conexión', 'No se pudo comunicar con el servidor');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm('¿Eliminar este ejercicio?')) return;
    try {
      const response = await fetch(`/api/exercise/log?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Ejercicio eliminado');
        await loadLogs();
      } else {
        const errData = await response.json().catch(() => ({}));
        toast.error('Error', errData.error || 'No se pudo eliminar el ejercicio');
      }
    } catch (error) {
      console.error('[EXERCISE] Error deleting log:', error);
      toast.error('Error de conexión', 'No se pudo comunicar con el servidor');
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
      <div className="space-y-6 pb-32">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-heading font-extrabold tracking-tighter text-slate-900">Entrenamiento</h1>
            <p className="text-lg text-slate-500 font-medium">Registra tu actividad física</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-heading font-extrabold tracking-tight text-orange-600">
              {totalCalories} <span className="text-2xl text-orange-600/50 font-bold">kcal</span>
            </div>
            <div className="text-xs text-slate-400 font-bold uppercase">quemadas hoy</div>
          </div>
        </div>

        {/* Exercise Selector */}
        <Card className="card-nutriflow shadow-lg border-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-orange-600" />
              Agregar Ejercicio
            </CardTitle>
            <CardDescription>Selecciona un ejercicio para registrarlo</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {EXERCISE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedCategory('all'); }}
                placeholder="Buscar ejercicio..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />
            </div>

            {/* Exercise Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
              {filteredExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExercise(ex)}
                  className={`p-4 rounded-2xl border-2 transition-all hover:shadow-lg text-left ${
                    CATEGORY_BG[ex.type]
                  } hover:scale-105`}
                >
                  <div className="text-3xl mb-2">{ex.emoji}</div>
                  <div className="font-bold text-sm leading-tight">{ex.name}</div>
                  <div className="text-xs mt-1 opacity-75">MET: {ex.met}</div>
                </button>
              ))}
            </div>

            {filteredExercises.length === 0 && (
              <div className="text-center py-8 text-stone-400">
                No se encontraron ejercicios
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Workout Log */}
        <Card className="card-nutriflow shadow-xl border-orange-100">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-600" />
              Entrenamiento de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-10 text-stone-400 italic">
                No has registrado ejercicios hoy... ¡es hora de entrenar!
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log, index) => {
                  const categoryColor = CATEGORY_COLORS[log.exerciseType] || 'from-slate-500 to-slate-600';
                  const exData = EXERCISE_DATABASE.find(e => e.name === log.exerciseName);
                  const logId = log.id || `log-${index}`;
                  const createdAt = log.createdAt || log.date || new Date();
                  const timeStr = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const cals = Math.round(Number(log.caloriesBurned) || 0);
                  const dur = Number(log.durationMin) || 0;
                  return (
                    <div key={logId} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryColor} text-white shadow-md`}>
                          <span className="text-xl">{exData?.emoji || '🏋️'}</span>
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">{log.exerciseName}</div>
                          <div className="text-xs text-stone-500 uppercase font-black flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {dur} min
                          </div>
                          {log.muscleGroups && log.muscleGroups.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {log.muscleGroups.slice(0, 3).map((mg, i) => {
                                const muscleData = MUSCLE_GROUPS.find(m => m.id === mg);
                                return (
                                  <span key={i} className="text-[9px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full font-bold">
                                    {muscleData?.emoji} {mg}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="font-black text-orange-600">{cals} kcal</div>
                          <div className="text-[9px] text-stone-400 font-bold uppercase">
                            {timeStr}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLog(logId)}
                          className="text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Exercise Dialog */}
      <Dialog open={showAddForm} onOpenChange={(open) => { setShowAddForm(open); if (!open) setSelectedExercise(null); }}>
        <DialogContent className="sm:max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-orange-900 font-bold text-xl flex items-center gap-2">
              <span className="text-2xl">{selectedExercise?.emoji}</span>
              {selectedExercise?.name}
            </DialogTitle>
            <DialogDescription>
              <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${CATEGORY_BG[selectedExercise?.type || 'strength']}`}>
                {selectedExercise?.type}
              </span>
              {' '}• MET: {selectedExercise?.met}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <Timer className="h-3 w-3" />
                Duración
              </Label>
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-1.5">
                <button
                  onClick={() => setDurationMin(Math.max(5, durationMin - 5))}
                  disabled={durationMin <= 5}
                  className="w-10 h-10 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 font-black text-lg disabled:opacity-30 transition-colors"
                >
                  -
                </button>
                <Input
                  type="number"
                  value={durationMin}
                  onChange={(e) => setDurationMin(Math.max(5, Number(e.target.value)))}
                  className="text-2xl font-black border-none text-center focus-visible:ring-0 flex-1"
                  min="5"
                  step="5"
                />
                <button
                  onClick={() => setDurationMin(durationMin + 5)}
                  className="w-10 h-10 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 font-black text-lg transition-colors"
                >
                  +
                </button>
                <span className="pl-2 pr-3 font-black text-slate-600 uppercase text-[10px]">min</span>
              </div>
            </div>

            {/* Muscle Groups */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <Target className="h-3 w-3" />
                Músculos trabajados
              </Label>
              <div className="grid grid-cols-4 gap-1.5">
                {MUSCLE_GROUPS.map((muscle) => (
                  <button
                    key={muscle.id}
                    onClick={() => toggleMuscle(muscle.id)}
                    className={`p-2 rounded-lg text-[10px] font-bold transition-all ${
                      selectedMuscles.includes(muscle.id)
                        ? 'bg-orange-600 text-white shadow-md scale-105'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <div className="text-base">{muscle.emoji}</div>
                    <div className="text-[8px] mt-0.5 truncate">{muscle.id}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">Notas (opcional)</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Series, repeticiones, peso..."
                className="rounded-xl h-9 text-sm"
              />
            </div>

            {/* Calorie Preview */}
            <div className="flex justify-between items-center px-3 py-2 bg-orange-50 rounded-lg border border-orange-100">
              <span className="text-[10px] font-bold text-orange-800 uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="h-3 w-3" />
                Calorías
              </span>
              <span className="font-black text-orange-600 text-base">
                {calculateCaloriesBurned()} kcal
              </span>
            </div>
          </div>

          <DialogFooter className="sm:justify-between gap-2">
            <Button variant="ghost" onClick={() => { setShowAddForm(false); setSelectedExercise(null); }} className="rounded-lg font-bold text-sm">
              Cancelar
            </Button>
            <Button onClick={handleAddLog} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md font-bold px-6 text-sm">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Registrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 20px;
        }
      `}</style>
    </DashboardLayout>
  );
}
