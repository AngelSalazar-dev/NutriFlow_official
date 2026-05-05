'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { useToast } from '@/components/ui/toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Utensils,
  Plus,
  Search,
  Droplets,
  Flame,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  Apple,
  Coffee,
  Sun,
  Moon,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Waves,
  Clock,
  GlassWater,
  CupSoda,
  CheckCircle,
  ShieldCheck,
  Globe2,
  Beer,
  Wine,
  Milk,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FoodItem, searchFoods } from '@/lib/food-database';
import { getFoodName } from '@/lib/food-name-translations';

interface FoodLog {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingName?: string;
  mealType: string;
  date: string;
  isCustom: boolean;
}

interface WaterLog {
  id: string;
  amountMl: number;
  beverageType: string;
  createdAt: string;
}

export default function FoodLogPage() {
  const { user, isPremium } = useAuth();
  const { tr, lang } = useLang();
  const { success, error: toastError } = useToast();
  const router = useRouter();

  const MEAL_TYPES = [
    { value: 'breakfast', label: tr('food_breakfast'), icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50/50 dark:bg-orange-950/20' },
    { value: 'lunch', label: tr('food_lunch'), icon: Utensils, color: 'text-emerald-500', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20' },
    { value: 'dinner', label: tr('food_dinner'), icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50/50 dark:bg-indigo-950/20' },
    { value: 'snack', label: tr('food_snack'), icon: Coffee, color: 'text-purple-500', bg: 'bg-purple-50/50 dark:bg-purple-950/20' },
  ];

  const BEVERAGE_TYPES = [
    { id: 'water', label: tr('dash_water'), icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50/50' },
    { id: 'coffee', label: tr('food_bev_coffee'), icon: Coffee, color: 'text-amber-700', bg: 'bg-amber-50/50' },
    { id: 'tea', label: tr('food_bev_tea'), icon: Moon, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
    { id: 'juice', label: tr('food_bev_juice'), icon: CupSoda, color: 'text-orange-500', bg: 'bg-orange-50/50' },
    { id: 'milk', label: tr('food_bev_milk'), icon: Milk, color: 'text-blue-400', bg: 'bg-blue-50/50' },
  ];

  const WATER_AMOUNTS = [
    { ml: 150, label: '150ml', icon: '🥛' },
    { ml: 250, label: '250ml', icon: '🥤' },
    { ml: 500, label: '500ml', icon: '🍶' },
    { ml: 750, label: '750ml', icon: '🚰' },
  ];
  
  // Estados
  const [searchQuery, setSearchQuery] = React.useState('');
  const [smartText, setSmartText] = React.useState('');
  const [isSmartLoading, setIsSmartLoading] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedFood, setSelectedFood] = React.useState<any | null>(null);
  const [servingSize, setServingSize] = React.useState(100);
  const [servingCount, setServingCount] = React.useState(1);
  const [usePieces, setUsePieces] = React.useState(true);
  const [mealType, setMealType] = React.useState('breakfast');
  const [foodLogs, setFoodLogs] = React.useState<FoodLog[]>([]);
  const [waterTotal, setWaterTotal] = React.useState(0);
  const [waterLogs, setWaterLogs] = React.useState<WaterLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [editingLog, setEditingLog] = React.useState<FoodLog | null>(null);
  const [editServingSize, setEditServingSize] = React.useState(100);
  const [selectedBeverage, setSelectedBeverage] = React.useState('water');
  const [customMl, setCustomMl] = React.useState('');
  const [showWaterHistory, setShowWaterHistory] = React.useState(false);
  const [isGrams, setIsGrams] = React.useState(true);
  const [editingWaterId, setEditingWaterId] = React.useState<string | null>(null);
  const [editWaterAmount, setEditWaterAmount] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const searchControllerRef = React.useRef<AbortController | null>(null);

  // Cargar datos al iniciar
  React.useEffect(() => {
    loadTodayLogs();
    loadWaterToday();
  }, [selectedDate]);

  // Búsqueda en tiempo real
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadTodayLogs = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/food/today?date=${dateStr}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setFoodLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error loading food logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWaterToday = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/hydration/today?date=${dateStr}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setWaterTotal(data.totalMl || 0);
        setWaterLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error loading water logs:', error);
    }
  };

  const performSearch = async (query: string) => {
    if (searchControllerRef.current) {
      searchControllerRef.current.abort();
    }
    searchControllerRef.current = new AbortController();

    setIsSearching(true);
    try {
      const response = await fetch(`/api/food/search?q=${encodeURIComponent(query)}`, {
        signal: searchControllerRef.current.signal,
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        const apiResults = data.foods || [];
        if (apiResults.length > 0) {
          setSearchResults(apiResults);
        } else {
          const localResults = searchFoods(query);
          setSearchResults(localResults);
        }
      } else {
        const localResults = searchFoods(query);
        setSearchResults(localResults);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        const localResults = searchFoods(query);
        setSearchResults(localResults);
      }
    } finally {
      if (!searchControllerRef.current?.signal.aborted) {
        setIsSearching(false);
      }
    }
  };

  const handleSmartLog = async () => {
    if (!smartText.trim()) return;
    setIsSmartLoading(true);
    try {
      const response = await fetch('/api/food/smart-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: smartText, date: selectedDate.toISOString() }),
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        success(tr('food_register_success'), `${data.foods.length} ${tr('nav_food')} ${tr('common_add')}.`);
        setSmartText('');
        loadTodayLogs();
      } else {
        toastError(tr('common_error'), tr('food_register_error'));
      }
    } catch (error) {
      toastError(tr('common_error'), tr('common_error'));
    } finally {
      setIsSmartLoading(false);
    }
  };

  const selectFood = (food: any) => {
    setSelectedFood(food);
    const baseServingSize = food.servingSize || 100;
    setServingSize(baseServingSize);
    setServingCount(1);
    setUsePieces(!!food.servingName && !food.servingName.includes('100g'));
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleServingCountChange = (count: number) => {
    if (!selectedFood || count < 0.5) return;
    setServingCount(count);
    const baseServingSize = selectedFood.servingSize || 100;
    setServingSize(Math.round(baseServingSize * count));
  };

  const handleServingSizeChange = (grams: number) => {
    if (!selectedFood || grams < 1) return;
    setServingSize(grams);
    const baseServingSize = selectedFood.servingSize || 100;
    setServingCount(Math.round((grams / baseServingSize) * 10) / 10);
  };

  const calculateNutrition = (food: any, serving: number) => {
    const ratio = serving / 100;
    return {
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
    };
  };

  const saveFoodLog = async () => {
    if (!selectedFood) return;

    setIsSaving(true);
    try {
      const nutrition = calculateNutrition(selectedFood, servingSize);
      let finalServingName = selectedFood.servingName || 'porción';
      if (usePieces && servingCount !== 1) {
        const baseName = selectedFood.servingName.replace(/^1\s+/, '');
        finalServingName = `${servingCount} ${baseName}`;
      }
      
      const response = await fetch('/api/food/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          foodId: selectedFood.id,
          foodName: selectedFood.name,
          brand: selectedFood.brand,
          ...nutrition,
          servingSize,
          servingName: finalServingName,
          mealType,
          date: selectedDate.toISOString(),
          isCustom: false
        }),
      });

      if (response.ok) {
        success(tr('food_register_success'), `${selectedFood.name} ${tr('common_add')}.`);
        setSelectedFood(null);
        loadTodayLogs();
      } else {
        toastError(tr('common_error'), tr('food_register_error'));
      }
    } catch (error) {
      toastError(tr('common_error'), tr('common_error'));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLog = async (id: string) => {
    if (!confirm(tr('food_delete_confirm'))) return;
    try {
      const response = await fetch(`/api/food/log?id=${id}`, { method: 'DELETE', credentials: 'include' });
      if (response.ok) {
        loadTodayLogs();
        success(tr('common_delete') + '!');
      }
    } catch (error) {
      toastError(tr('common_error'), tr('common_delete'));
    }
  };

  const updateFoodLog = async () => {
    if (!editingLog) return;
    setIsSaving(true);
    try {
      const ratio = editServingSize / (editingLog.servingSize || 100);
      const newCalories = Math.round(editingLog.calories * ratio);
      const newProtein = Math.round(editingLog.protein * ratio * 10) / 10;
      const newCarbs = Math.round(editingLog.carbs * ratio * 10) / 10;
      const newFat = Math.round(editingLog.fat * ratio * 10) / 10;

      const response = await fetch('/api/food/log', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          logId: editingLog.id,
          servingSize: editServingSize,
          calories: newCalories,
          protein: newProtein,
          carbs: newCarbs,
          fat: newFat
        }),
      });

      if (response.ok) {
        success(tr('common_save') + '!');
        setEditingLog(null);
        loadTodayLogs();
      } else {
        toastError(tr('common_error'), tr('common_error'));
      }
    } catch (error) {
      toastError(tr('common_error'), tr('common_error'));
    } finally {
      setIsSaving(false);
    }
  };

  const addWater = async (amountMl: number) => {
    try {
      const response = await fetch('/api/hydration/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amountMl, beverageType: selectedBeverage, date: selectedDate.toISOString() }),
      });
      if (response.ok) {
        await loadWaterToday();
        const bevName = BEVERAGE_TYPES.find(b => b.id === selectedBeverage)?.label;
        success(`¡${bevName} ${tr('food_register_success')}!`, `+${amountMl}ml ${tr('common_add')}.`);
        setCustomMl('');
      } else {
        const errData = await response.json();
        toastError(tr('common_error'), errData.error || tr('common_error'));
      }
    } catch (error) {
      console.error('Error adding water:', error);
      toastError(tr('common_error'), tr('common_error'));
    }
  };

  const deleteWaterLog = async (id: string) => {
    try {
      const response = await fetch(`/api/hydration/quick?id=${id}`, { method: 'DELETE', credentials: 'include' });
      if (response.ok) {
        loadWaterToday();
        success('Registro eliminado');
      }
    } catch (error) {
      toastError('Error', 'Error al eliminar');
    }
  };

  const updateWaterLog = async (id: string, beverageType: string) => {
    const amount = Number(editWaterAmount);
    if (!amount || amount <= 0) return;

    try {
      const response = await fetch('/api/hydration/quick', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, amountMl: amount, beverageType }),
      });
      if (response.ok) {
        loadWaterToday();
        setEditingWaterId(null);
        success('Registro actualizado');
      }
    } catch (error) {
      toastError('Error', 'Error al actualizar');
    }
  };

  // Totales diarios
  const dailyTotals = foodLogs.reduce(
    (acc, log) => {
      acc.calories += log.calories;
      acc.protein += log.protein;
      acc.carbs += log.carbs;
      acc.fat += log.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const calorieGoal = user?.calorieGoal || 2000;
  const waterGoal = 2500;
  const waterPercentage = Math.min((waterTotal / waterGoal) * 100, 100);

  // Group logs by meal
  const logsByMeal = MEAL_TYPES.reduce((acc, meal) => {
    acc[meal.value] = foodLogs.filter(log => log.mealType === meal.value);
    return acc;
  }, {} as Record<string, FoodLog[]>);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest animate-pulse">{tr('common_loading')}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 pb-32">
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
            <Utensils className="h-64 w-64" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                {tr('dash_today')} • {selectedDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                {tr('food_log_title')}
              </h1>
              <p className="text-slate-400 text-lg max-w-md font-medium">
                {tr('food_log_subtitle')}
              </p>
              
              <div className="flex items-center gap-4 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; })}
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> {tr('food_yesterday')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; })}
                  disabled={selectedDate.toDateString() === new Date().toDateString()}
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl"
                >
                  {tr('food_tomorrow')} <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-6xl md:text-8xl font-black tracking-tighter text-emerald-500 leading-none">
                {dailyTotals.calories}
              </div>
              <div className="text-right">
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                  {tr('food_kcal')} {lang === 'es' ? 'Consumidas' : 'Consumed'}
                </p>
                <p className="text-slate-500 text-sm">
                  {lang === 'es' ? 'Meta' : 'Goal'}: {calorieGoal} kcal
                </p>
              </div>
              <div className="w-full md:w-64 h-3 bg-white/5 rounded-full mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((dailyTotals.calories / calorieGoal) * 100, 100)}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI SMART LOG & SEARCH */}
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* Smart Log AI Card */}
            <Card className="rounded-[2rem] border-purple-500/20 dark:border-purple-500/30 bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-900 dark:to-purple-950/10 shadow-xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="h-32 w-32 text-purple-600" />
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black tracking-tight">{lang === 'es' ? 'Registro Inteligente' : 'Smart Log'}</CardTitle>
                    <CardDescription className="text-purple-600/70 dark:text-purple-400 font-bold uppercase tracking-widest text-[10px]">Powered by NutriFlow AI</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <textarea
                    value={smartText}
                    onChange={(e) => setSmartText(e.target.value)}
                    placeholder={lang === 'es' ? 'Escribe lo que comiste (ej: "Desayuné 2 huevos revueltos con aguacate y un café")' : 'Describe what you ate (e.g., "I had 2 scrambled eggs with avocado and a coffee")'}
                    className="w-full h-32 p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-purple-900/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium text-slate-700 dark:text-slate-200"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <Button 
                      onClick={handleSmartLog}
                      disabled={isSmartLoading || !smartText.trim()}
                      className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest text-xs px-6 py-6 shadow-xl shadow-purple-500/30 group/btn"
                    >
                      {isSmartLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                        <>
                          {lang === 'es' ? 'Analizar Comida' : 'Analyze Meal'}
                          <Zap className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2">
                   <ShieldCheck className="h-3 w-3 text-emerald-500" />
                   <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">IA de grado profesional para análisis nutricional preciso</span>
                </div>
              </CardContent>
            </Card>

            {/* Manual Search Card */}
            <Card className="rounded-[2rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
               <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                    <Search className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black tracking-tight">{tr('common_search')}</CardTitle>
                    <CardDescription>{tr('food_log_subtitle')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={tr('food_search_placeholder')}
                    className="pl-14 h-16 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border-none text-lg font-medium dark:text-slate-100 focus-visible:ring-emerald-500/20"
                  />
                </div>

                {isSearching && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500 opacity-50" />
                  </div>
                )}

                <AnimatePresence>
                  {searchResults.length > 0 && !selectedFood && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
                    >
                      {searchResults.map((food, index) => (
                        <button
                          key={`${food.id}-${index}`}
                          onClick={() => selectFood(food)}
                          className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all text-left group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                              <Apple className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                {getFoodName(food.name, lang)}
                                {food.isVerified && <CheckCircle className="h-3 w-3 text-blue-500 inline ml-1.5" />}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{food.brand || tr('food_verified')}</div>
                            </div>
                          </div>
                          <div className="text-right font-black text-slate-900 dark:text-slate-100">{food.calories} kcal</div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedFood && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-[2rem] bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-100 dark:border-emerald-900/50 space-y-8"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl font-black text-emerald-950 dark:text-emerald-50 tracking-tight">{getFoodName(selectedFood.name, lang)}</h3>
                        <p className="text-emerald-600/70 dark:text-emerald-400 font-black uppercase tracking-widest text-[10px] mt-1">{selectedFood.brand || tr('food_verified')}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedFood(null)} className="rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-600">
                        <X className="h-6 w-6" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
                              {isGrams ? tr('food_serving_grams') : (lang === 'es' ? 'Piezas' : 'Pieces')}
                            </Label>
                            <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-0.5">
                               <button 
                                 onClick={() => setIsGrams(true)}
                                 className={`px-2 py-1 rounded text-[9px] font-black uppercase transition-all ${isGrams ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-500'}`}
                               >
                                 G
                               </button>
                               <button 
                                 onClick={() => setIsGrams(false)}
                                 className={`px-2 py-1 rounded text-[9px] font-black uppercase transition-all ${!isGrams ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-500'}`}
                                >
                                 P
                               </button>
                            </div>
                         </div>
                         
                         {isGrams ? (
                           <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/50 p-2 shadow-sm transition-colors focus-within:border-emerald-500">
                             <Input
                               type="number"
                               value={servingSize}
                               onChange={(e) => handleServingSizeChange(Number(e.target.value))}
                               className="text-2xl font-black border-none text-center focus-visible:ring-0 text-slate-900 dark:text-white bg-transparent"
                             />
                             <span className="pr-4 font-black text-emerald-900 dark:text-emerald-400">g</span>
                           </div>
                         ) : (
                           <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/50 p-2 shadow-sm transition-colors focus-within:border-emerald-500">
                             <Input
                               type="number"
                               value={servingCount}
                               onChange={(e) => handleServingCountChange(Number(e.target.value))}
                               className="text-2xl font-black border-none text-center focus-visible:ring-0 text-slate-900 dark:text-white bg-transparent"
                             />
                             <span className="pr-4 font-black text-emerald-900 dark:text-emerald-400">{lang === 'es' ? 'Uds' : 'Qty'}</span>
                           </div>
                         )}
                       </div>
                       <div className="space-y-3">
                         <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">{lang === 'es' ? 'Tipo de comida' : 'Meal Type'}</Label>
                         <div className="grid grid-cols-2 gap-2">
                           {MEAL_TYPES.map((m) => (
                             <button
                               key={m.value}
                               onClick={() => setMealType(m.value)}
                               className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                                 mealType === m.value 
                                   ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                                   : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                               }`}
                             >
                               {m.label}
                             </button>
                           ))}
                         </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 p-6 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                       {[
                         { label: 'Kcal', value: calculateNutrition(selectedFood, servingSize).calories, color: 'text-orange-500' },
                         { label: 'Prot', value: calculateNutrition(selectedFood, servingSize).protein, color: 'text-rose-500' },
                         { label: 'Carb', value: calculateNutrition(selectedFood, servingSize).carbs, color: 'text-amber-500' },
                         { label: 'Gras', value: calculateNutrition(selectedFood, servingSize).fat, color: 'text-emerald-500' },
                       ].map((n, i) => (
                         <div key={i} className="text-center">
                           <div className={`text-xl font-black ${n.color}`}>{n.value}{n.label !== 'Kcal' ? 'g' : ''}</div>
                           <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{n.label}</div>
                         </div>
                       ))}
                    </div>

                    <Button 
                      onClick={saveFoodLog} 
                      disabled={isSaving} 
                      className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30"
                    >
                      {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                        <>
                          {tr('food_add')}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Hydration Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2rem] border-blue-500/20 dark:border-blue-500/30 bg-white dark:bg-slate-900 shadow-xl overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/10 pointer-events-none" />
               
               {/* Wave background */}
               <div 
                 className="absolute bottom-0 left-0 right-0 bg-blue-500/10 dark:bg-blue-500/5 transition-all duration-1000"
                 style={{ height: `${waterPercentage}%` }}
               />

               <CardHeader className="relative z-10">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                        <Droplets className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black tracking-tight">{tr('food_water_title')}</CardTitle>
                        <CardDescription className="text-blue-600 font-bold">{waterTotal}ml / {waterGoal}ml</CardDescription>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-blue-600">{Math.round(waterPercentage)}%</div>
                 </div>
               </CardHeader>
               
               <CardContent className="relative z-10 space-y-6">
                 {/* Progress bar */}
                 <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${waterPercentage}%` }}
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    />
                 </div>

                 {/* Beverage selector */}
                 <div className="flex justify-between gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    {BEVERAGE_TYPES.map(bev => (
                      <button
                        key={bev.id}
                        onClick={() => setSelectedBeverage(bev.id)}
                        className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                          selectedBeverage === bev.id 
                            ? 'bg-white dark:bg-slate-700 shadow-md scale-105' 
                            : 'opacity-40 grayscale hover:opacity-60'
                        }`}
                      >
                        <bev.icon className={`h-5 w-5 ${bev.color}`} />
                        <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500">{bev.label}</span>
                      </button>
                    ))}
                 </div>

                 <div className="grid grid-cols-4 gap-3">
                    {WATER_AMOUNTS.map(w => (
                      <button
                        key={w.ml}
                        onClick={() => addWater(w.ml)}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-500 transition-all flex flex-col items-center gap-1 group"
                      >
                        <span className="text-xl group-hover:scale-125 transition-transform">{w.icon}</span>
                        <span className="text-[10px] font-black text-blue-600">{w.ml}ml</span>
                      </button>
                    ))}
                 </div>

                 {/* History Toggle */}
                 <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowWaterHistory(!showWaterHistory)}
                      className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-500 transition-all"
                    >
                      {lang === 'es' ? 'Ver Historial' : 'View History'}
                      {showWaterHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                    
                    <AnimatePresence>
                      {showWaterHistory && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-4 space-y-2"
                        >
                          {waterLogs.length === 0 ? (
                            <p className="text-center text-[10px] font-bold text-slate-400 py-4 uppercase tracking-widest">{lang === 'es' ? 'Sin registros' : 'No logs'}</p>
                          ) : (
                            waterLogs.map((log) => {
                              const bev = BEVERAGE_TYPES.find(b => b.id === log.beverageType) || BEVERAGE_TYPES[0];
                              const isEditing = editingWaterId === log.id;

                              return (
                                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 group/item transition-all">
                                   <div className="flex items-center gap-3 flex-1">
                                      <bev.icon className={`h-4 w-4 ${bev.color}`} />
                                      {isEditing ? (
                                        <div className="flex items-center gap-2 flex-1">
                                           <Input 
                                             type="number" 
                                             value={editWaterAmount} 
                                             onChange={(e) => setEditWaterAmount(e.target.value)}
                                             className="h-8 w-20 text-xs font-black dark:bg-slate-900 border-blue-500/30"
                                             autoFocus
                                           />
                                           <span className="text-[10px] font-black text-slate-400">ML</span>
                                        </div>
                                      ) : (
                                        <div className="text-[11px] font-black text-slate-700 dark:text-slate-200">{log.amountMl}ml <span className="opacity-50 text-[9px] uppercase ml-1 font-bold">{bev.label}</span></div>
                                      )}
                                   </div>
                                   <div className="flex items-center gap-1">
                                      {isEditing ? (
                                        <>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => updateWaterLog(log.id, log.beverageType)}
                                            className="h-7 w-7 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                          >
                                            <Check className="h-3 w-3" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => setEditingWaterId(null)}
                                            className="h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </>
                                      ) : (
                                        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                           <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => { setEditingWaterId(log.id); setEditWaterAmount(log.amountMl.toString()); }}
                                            className="h-7 w-7 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                          >
                                            <Edit2 className="h-3 w-3" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => deleteWaterLog(log.id)}
                                            className="h-7 w-7 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      )}
                                   </div>
                                </div>
                              )
                            })
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
               </CardContent>
            </Card>

            {/* Quick Stats Summary */}
            <Card className="rounded-[2rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-8 space-y-6">
               <h3 className="text-xl font-black tracking-tight">{lang === 'es' ? 'Resumen Nutricional' : 'Nutritional Summary'}</h3>
               <div className="space-y-6">
                  {[
                    { label: tr('dash_protein'), value: dailyTotals.protein, target: Math.round((calorieGoal * 0.3) / 4), color: 'bg-rose-500' },
                    { label: tr('dash_carbs'), value: dailyTotals.carbs, target: Math.round((calorieGoal * 0.45) / 4), color: 'bg-amber-500' },
                    { label: tr('dash_fat'), value: dailyTotals.fat, target: Math.round((calorieGoal * 0.25) / 9), color: 'bg-emerald-500' },
                  ].map((m, i) => {
                    const percentage = Math.min((m.value / m.target) * 100, 100);
                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                          <span>{m.label}</span>
                          <span className="text-slate-900 dark:text-slate-100">{Math.round(m.value)}g / {m.target}g</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${percentage}%` }}
                             className={`h-full ${m.color} rounded-full`}
                           />
                        </div>
                      </div>
                    )
                  })}
               </div>
            </Card>
          </div>
        </div>

        {/* DAILY LOG GROUPED BY MEAL */}
        <div className="space-y-8">
           <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-400 dark:text-slate-600">{tr('food_daily_consumption')}</h2>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
           </div>

           <div className="grid gap-8">
              {MEAL_TYPES.map((meal) => {
                const logs = logsByMeal[meal.value] || [];
                const mealCalories = logs.reduce((sum, l) => sum + l.calories, 0);
                
                return (
                  <motion.div 
                    key={meal.value}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between px-2">
                       <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-2xl ${meal.bg} ${meal.color}`}>
                             <meal.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black tracking-tight">{meal.label}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{logs.length} {lang === 'es' ? 'alimentos registrados' : 'items logged'}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className={`text-2xl font-black ${meal.color}`}>{mealCalories} <span className="text-xs opacity-50">kcal</span></div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total del {meal.label.toLowerCase()}</div>
                       </div>
                    </div>

                    <div className="grid gap-3">
                       {logs.length === 0 ? (
                         <div className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 font-medium italic text-sm">
                            {lang === 'es' ? 'No hay registros para esta comida' : 'No logs for this meal yet'}
                         </div>
                       ) : (
                         logs.map((log) => (
                           <div key={log.id} className="group flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all">
                              <div className="flex items-center gap-5">
                                 <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/20 group-hover:text-emerald-500 transition-all duration-300">
                                    <Utensils className="h-5 w-5" />
                                 </div>
                                 <div>
                                    <div className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                                      {getFoodName(log.foodName, lang)}
                                    </div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                      {log.servingName} • {log.servingSize}g
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-8">
                                 <div className="text-right">
                                    <div className="text-xl font-black text-slate-900 dark:text-slate-100">{log.calories} <span className="text-[10px] opacity-50">kcal</span></div>
                                    <div className="text-[9px] font-black uppercase tracking-tighter text-slate-400">P:{log.protein} C:{log.carbs} G:{log.fat}</div>
                                 </div>
                                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => { setEditingLog(log); setEditServingSize(log.servingSize); }}
                                      className="h-10 w-10 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => deleteLog(log.id)}
                                      className="h-10 w-10 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                 </div>
                              </div>
                           </div>
                         ))
                       )}
                    </div>
                  </motion.div>
                )
              })}
           </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingLog} onOpenChange={(open) => !open && setEditingLog(null)}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                <Edit2 className="h-5 w-5" />
              </div>
              {lang === 'es' ? 'Editar Cantidad' : 'Edit Serving'}
            </DialogTitle>
            <DialogDescription className="font-bold text-slate-500">
              {editingLog ? getFoodName(editingLog.foodName, lang) : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8 space-y-6">
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{tr('food_serving_grams')}</Label>
               </div>
               <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 p-3 shadow-inner">
                 <Input
                   type="number"
                   value={editServingSize}
                   onChange={(e) => setEditServingSize(Number(e.target.value))}
                   className="text-3xl font-black border-none text-center bg-transparent focus-visible:ring-0 text-slate-900 dark:text-white"
                 />
                 <span className="pr-4 font-black text-slate-400">g</span>
               </div>
            </div>

            {editingLog && (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 flex justify-between items-center">
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">{lang === 'es' ? 'Nuevas Calorías' : 'New Calories'}</span>
                 <span className="text-2xl font-black text-emerald-600">
                   {Math.round(editingLog.calories * (editServingSize / (editingLog.servingSize || 100)))} <span className="text-xs opacity-50">kcal</span>
                 </span>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setEditingLog(null)} className="flex-1 rounded-xl font-bold">{tr('common_cancel')}</Button>
            <Button 
              onClick={updateFoodLog} 
              disabled={isSaving} 
              className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : tr('common_save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #334155;
        }
      `}</style>
    </DashboardLayout>
  );
}
