'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
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
  ChevronLeft,
  ChevronRight,
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
  const { tr, lang } = useLang();
  const { success: toastSuccess, error: toastError } = useToast();
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
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const EXERCISE_DATABASE: Exercise[] = [
    { id: 'str-1', name: 'Squat', met: 5.0, type: 'strength', muscleGroups: ['Quads', 'Glutes'], icon: 'legs', emoji: '🏋️' },
    { id: 'str-2', name: 'Bench Press', met: 4.0, type: 'strength', muscleGroups: ['Chest', 'Triceps'], icon: 'chest', emoji: '💪' },
    { id: 'str-3', name: 'Deadlift', met: 6.0, type: 'strength', muscleGroups: ['Back', 'Glutes'], icon: 'back', emoji: '🏋️' },
    { id: 'str-4', name: 'Shoulder Press', met: 3.5, type: 'strength', muscleGroups: ['Shoulders', 'Triceps'], icon: 'shoulders', emoji: '💪' },
    { id: 'str-10', name: 'Plancha', met: 3.5, type: 'strength', muscleGroups: ['Abs'], icon: 'core', emoji: '🎯' },
    { id: 'card-1', name: 'Running', met: 8.0, type: 'cardio', muscleGroups: ['Cardio', 'Quads'], icon: 'running', emoji: '🏃' },
    { id: 'card-3', name: 'Walking', met: 3.5, type: 'cardio', muscleGroups: ['Cardio'], icon: 'walking', emoji: '🚶' },
    { id: 'flex-1', name: 'Yoga', met: 2.5, type: 'flexibility', muscleGroups: ['Cardio'], icon: 'yoga', emoji: '🧘' },
    { id: 'hiit-1', name: 'HIIT', met: 12.0, type: 'hiit', muscleGroups: ['Cardio', 'Quads'], icon: 'hiit', emoji: '⚡' },
  ];

  const EXERCISE_CATEGORIES = [
    { id: 'all', label: lang === 'en' ? 'All' : 'Todos', icon: Target, emoji: '🎯' },
    { id: 'strength', label: lang === 'en' ? 'Strength' : 'Fuerza', icon: Dumbbell, emoji: '💪' },
    { id: 'cardio', label: lang === 'en' ? 'Cardio' : 'Cardio', icon: Heart, emoji: '❤️' },
    { id: 'flexibility', label: lang === 'en' ? 'Flexibility' : 'Flexibilidad', icon: Activity, emoji: '🧘' },
    { id: 'hiit', label: 'HIIT', icon: Zap, emoji: '⚡' },
  ];

  const MUSCLE_GROUPS = [
    { id: 'Chest', emoji: '🫁' },
    { id: 'Back', emoji: '🔙' },
    { id: 'Shoulders', emoji: '🤷' },
    { id: 'Biceps', emoji: '💪' },
    { id: 'Triceps', emoji: '🦾' },
    { id: 'Abs', emoji: '🎯' },
    { id: 'Quads', emoji: '🦵' },
    { id: 'Glutes', emoji: '🍑' },
    { id: 'Calves', emoji: '🦶' },
    { id: 'Cardio', emoji: '❤️' },
  ];

  React.useEffect(() => {
    loadLogs();
  }, [selectedDate]);

  const loadLogs = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/exercise/log?date=${dateStr}`, { credentials: 'include' });
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
          date: selectedDate.toISOString(),
        }),
      });

      if (response.ok) {
        toastSuccess(tr('ex_add_success'), `${selectedExercise.name} — ${caloriesBurned} kcal ${tr('food_verified')}`);
        setShowAddForm(false);
        setSelectedExercise(null);
        setDurationMin(30);
        setSelectedMuscles([]);
        setNotes('');
        await loadLogs();
      } else {
        toastError(tr('common_error'), tr('food_register_error'));
      }
    } catch (error) {
      toastError(tr('common_error'), tr('common_error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm(tr('food_delete_confirm'))) return;
    try {
      const response = await fetch(`/api/exercise/log?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toastSuccess(tr('common_delete') + '!');
        await loadLogs();
      } else {
        toastError(tr('common_error'), tr('common_error'));
      }
    } catch (error) {
      toastError(tr('common_error'), tr('common_error'));
    }
  };

  // Show upgrade prompt for free users
  if (!isPremium) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardHeader>
              <Crown className="h-16 w-16 text-emerald-700 dark:text-emerald-500 mx-auto mb-4" />
              <CardTitle className="text-2xl dark:text-slate-100">{tr('nav_exercise')}</CardTitle>
              <CardDescription className="dark:text-slate-400">
                {tr('sub_status_free')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                {tr('landing_hero_subtitle')}
              </p>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-center gap-2 dark:text-slate-200">
                  <Dumbbell className="h-5 w-5 text-emerald-600" />
                  <span>{tr('ex_type_strength')}</span>
                </li>
                <li className="flex items-center gap-2 dark:text-slate-200">
                  <Flame className="h-5 w-5 text-emerald-600" />
                  <span>{tr('food_kcal')}</span>
                </li>
                <li className="flex items-center gap-2 dark:text-slate-200">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span>{tr('dash_no_weekly_data')}</span>
                </li>
              </ul>
              <Link href="/subscription">
                <Button size="lg" className="mt-6 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600">
                  {tr('sub_upgrade_premium')}
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tighter text-slate-900 dark:text-slate-100">{tr('nav_exercise')}</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{tr('food_log_subtitle')}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-orange-600 dark:text-orange-500">
              {totalCalories} <span className="text-xl md:text-2xl text-orange-600/50 dark:text-orange-500/50 font-bold">{tr('food_kcal')}</span>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">{tr('food_verified')}</div>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 shadow-sm transition-colors duration-300">
          <Button variant="ghost" size="sm" onClick={() => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; })} className="gap-1 dark:text-slate-300 dark:hover:bg-slate-800">
            <ChevronLeft className="h-4 w-4" /> {tr('food_yesterday')}
          </Button>
          <div className="text-center">
            <div className="font-bold text-slate-900 dark:text-slate-100">
              {selectedDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              {selectedDate.toDateString() === new Date().toDateString() ? tr('dash_today') : ''}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; })} className="gap-1 dark:text-slate-300 dark:hover:bg-slate-800" disabled={selectedDate.toDateString() === new Date().toDateString()}>
            {tr('food_tomorrow')} <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Exercise Selector */}
        <Card className="card-nutriflow shadow-lg border-orange-100 dark:border-orange-900/30 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-slate-100">
              <Dumbbell className="h-5 w-5 text-orange-600 dark:text-orange-500" />
              {tr('common_add')} {tr('nav_exercise')}
            </CardTitle>
            <CardDescription className="dark:text-slate-400">{tr('food_search_placeholder')}</CardDescription>
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
                      ? 'bg-orange-600 dark:bg-orange-700 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 dark:text-slate-500" />
              <input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedCategory('all'); }}
                placeholder={`${tr('common_search')}...`}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-slate-100 font-medium transition-all"
              />
            </div>

            {/* Exercise Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
              {filteredExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleSelectExercise(ex)}
                  className={`p-4 rounded-2xl border-2 transition-all hover:shadow-lg text-left ${
                    selectedExercise?.id === ex.id ? 'border-orange-500 scale-105' : 'border-transparent dark:border-slate-800'
                  } ${
                    CATEGORY_BG[ex.type]
                  } dark:bg-slate-800/40 hover:scale-105`}
                >
                  <div className="text-3xl mb-2">{ex.emoji}</div>
                  <div className="font-bold text-sm leading-tight dark:text-slate-100">{ex.name}</div>
                  <div className="text-xs mt-1 opacity-75 dark:text-slate-400">MET: {ex.met}</div>
                </button>
              ))}
            </div>

            {filteredExercises.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-600 italic">
                {tr('dash_no_weekly_data')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Workout Log */}
        <Card className="card-nutriflow shadow-xl border-orange-100 dark:border-orange-900/30 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-orange-900 dark:text-orange-100 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-600 dark:text-orange-500" />
              {selectedDate.toDateString() === new Date().toDateString() ? tr('food_verified') : `${tr('nav_exercise')} ${tr('common_back')} ${selectedDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'long' })}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-10 text-stone-400 dark:text-slate-500 italic">
                {tr('dash_no_weekly_data')}... {selectedDate.toDateString() === new Date().toDateString() ? tr('landing_start_button') : tr('common_confirm')}.
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log, index) => {
                  const categoryColor = CATEGORY_COLORS[log.exerciseType] || 'from-slate-500 to-slate-600';
                  const exData = EXERCISE_DATABASE.find(e => e.name === log.exerciseName);
                  const logId = log.id || `log-${index}`;
                  const createdAt = log.createdAt || log.date || new Date();
                  const timeStr = new Date(createdAt).toLocaleTimeString(lang === 'en' ? 'en-US' : 'es-ES', { hour: '2-digit', minute: '2-digit' });
                  const cals = Math.round(Number(log.caloriesBurned) || 0);
                  const dur = Number(log.durationMin) || 0;
                  return (
                    <div key={logId} className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-orange-500/5 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${categoryColor} text-white shadow-lg shadow-orange-500/10 group-hover:scale-110 transition-transform`}>
                          <span className="text-xl">{exData?.emoji || '🏋️'}</span>
                        </div>
                        <div>
                          <div className="font-black text-slate-900 dark:text-slate-100 tracking-tight">{log.exerciseName}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {dur} min
                          </div>
                          {log.muscleGroups && log.muscleGroups.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {log.muscleGroups.slice(0, 3).map((mg, i) => {
                                const muscleData = MUSCLE_GROUPS.find(m => m.id === mg);
                                return (
                                  <span key={i} className="text-[9px] bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg font-bold border border-slate-100 dark:border-slate-600 shadow-sm">
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
                          <div className="font-black text-orange-600 dark:text-orange-500 text-lg">{cals} <span className="text-[10px] text-orange-600/50 dark:text-orange-500/50 font-black">kcal</span></div>
                          <div className="text-[9px] text-slate-400 dark:text-slate-500 font-black tracking-tighter uppercase">
                            {timeStr}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLog(logId)}
                          className="h-9 w-9 text-slate-300 dark:text-slate-700 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-all"
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
        <DialogContent className="sm:max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-orange-900 dark:text-orange-100 font-bold text-xl flex items-center gap-2">
              <span className="text-2xl">{selectedExercise?.emoji}</span>
              {selectedExercise?.name}
            </DialogTitle>
            <DialogDescription className="dark:text-slate-400">
              <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${CATEGORY_BG[selectedExercise?.type || 'strength']} dark:bg-slate-800`}>
                {selectedExercise?.type}
              </span>
              {' '}• MET: {selectedExercise?.met}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Timer className="h-3 w-3" />
                {tr('common_back')}
              </Label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-1.5">
                <button
                  onClick={() => setDurationMin(Math.max(5, durationMin - 5))}
                  disabled={durationMin <= 5}
                  className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-800 text-orange-700 dark:text-orange-300 font-black text-lg disabled:opacity-30 transition-colors"
                >
                  -
                </button>
                <Input
                  type="number"
                  value={durationMin}
                  onChange={(e) => setDurationMin(Math.max(5, Number(e.target.value)))}
                  className="text-2xl font-black border-none text-center focus-visible:ring-0 flex-1 dark:bg-transparent dark:text-slate-100"
                  min="5"
                  step="5"
                />
                <button
                  onClick={() => setDurationMin(durationMin + 5)}
                  className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 hover:bg-orange-200 dark:hover:bg-orange-800 text-orange-700 dark:text-orange-300 font-black text-lg transition-colors"
                >
                  +
                </button>
                <span className="pl-2 pr-3 font-black text-slate-600 dark:text-slate-400 uppercase text-[10px]">min</span>
              </div>
            </div>

            {/* Muscle Groups */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Target className="h-3 w-3" />
                {tr('food_nutrient_density')}
              </Label>
              <div className="grid grid-cols-4 gap-1.5">
                {MUSCLE_GROUPS.map((muscle) => (
                  <button
                    key={muscle.id}
                    onClick={() => toggleMuscle(muscle.id)}
                    className={`p-2 rounded-lg text-[10px] font-bold transition-all ${
                      selectedMuscles.includes(muscle.id)
                        ? 'bg-orange-600 text-white shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
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
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">{tr('comming_soon')} ({tr('common_back')})</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="..."
                className="rounded-xl h-9 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              />
            </div>

            {/* Calorie Preview */}
            <div className="flex justify-between items-center px-3 py-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-100 dark:border-orange-900/30">
              <span className="text-[10px] font-bold text-orange-800 dark:text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="h-3 w-3" />
                {tr('food_kcal')}
              </span>
              <span className="font-black text-orange-600 dark:text-orange-500 text-base">
                {calculateCaloriesBurned()} kcal
              </span>
            </div>
          </div>

          <DialogFooter className="sm:justify-between gap-2">
            <Button variant="ghost" onClick={() => { setShowAddForm(false); setSelectedExercise(null); }} className="rounded-lg font-bold text-sm dark:text-slate-400 dark:hover:bg-slate-800">
              {tr('common_back')}
            </Button>
            <Button onClick={handleAddLog} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white rounded-lg shadow-md font-bold px-6 text-sm">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : tr('common_add')}
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
