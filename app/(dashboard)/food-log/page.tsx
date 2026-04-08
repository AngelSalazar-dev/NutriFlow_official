'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
} from 'lucide-react';
import { FoodItem, searchFoods } from '@/lib/food-database';

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

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Desayuno', icon: Sun },
  { value: 'lunch', label: 'Almuerzo', icon: Utensils },
  { value: 'dinner', label: 'Cena', icon: Moon },
  { value: 'snack', label: 'Snack', icon: Coffee },
];

const WATER_AMOUNTS = [
  { ml: 150, label: '150ml', icon: '🥛' },
  { ml: 250, label: '250ml', icon: '🥤' },
  { ml: 500, label: '500ml', icon: '🍶' },
  { ml: 750, label: '750ml', icon: '🚰' },
];

const BEVERAGE_TYPES = [
  { id: 'water', label: 'Agua', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'coffee', label: 'Café', icon: Coffee, color: 'text-amber-700', bg: 'bg-amber-50' },
  { id: 'tea', label: 'Té', icon: Moon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'juice', label: 'Jugo/Soda', icon: CupSoda, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'milk', label: 'Lácteo', icon: Milk, color: 'text-stone-500', bg: 'bg-stone-50' },
];

export default function FoodLogPage() {
  const { user, isPremium } = useAuth();
  const { success, error: toastError } = useToast();
  const router = useRouter();
  
  // Estados
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [frequentFoods, setFrequentFoods] = React.useState<any[]>([]);
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
  const [showHistory, setShowHistory] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const searchControllerRef = React.useRef<AbortController | null>(null);

  // Cargar datos al iniciar
  React.useEffect(() => {
    loadTodayLogs();
    loadFrequentFoods();
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

  const loadFrequentFoods = async () => {
    try {
      const response = await fetch('/api/food/search?frequent=true', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setFrequentFoods(data.foods || []);
      } else {
        // Fallback to local DB frequent foods
        const { getFrequentFoods } = await import('@/lib/food-database');
        setFrequentFoods(getFrequentFoods());
      }
    } catch (error) {
      console.error('Error loading frequent foods:', error);
      const { getFrequentFoods } = await import('@/lib/food-database');
      setFrequentFoods(getFrequentFoods());
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
          // API returned empty — fallback to local DB
          const localResults = searchFoods(query);
          setSearchResults(localResults);
        }
      } else {
        // API failed — fallback to local DB
        const errData = await response.json().catch(() => ({}));
        console.error('[FOOD-LOG] Search failed:', response.status, errData);
        const localResults = searchFoods(query);
        setSearchResults(localResults);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error searching foods:', error);
        // Fallback to local DB
        const localResults = searchFoods(query);
        setSearchResults(localResults);
      }
    } finally {
      if (!searchControllerRef.current?.signal.aborted) {
        setIsSearching(false);
      }
    }
  };

  const selectFood = (food: any) => {
    setSelectedFood(food);
    const baseServingSize = food.servingSize || 100;
    setServingSize(baseServingSize);
    setServingCount(1);
    // Default to pieces mode if food has a meaningful servingName
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
      
      // Build servingName based on piece count
      let finalServingName = selectedFood.servingName || 'porción';
      if (usePieces && servingCount !== 1) {
        // For multiple pieces, adjust the name (e.g., "1 taco" -> "2 tacos")
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
        success('¡Alimento registrado!', `${selectedFood.name} agregado.`);
        setSelectedFood(null);
        loadTodayLogs();
      } else {
        toastError('Error', 'Error al registrar alimento');
      }
    } catch (error) {
      toastError('Error', 'Error de red');
    } finally {
      setIsSaving(false);
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
        success('¡Alimento actualizado!');
        setEditingLog(null);
        loadTodayLogs();
      } else {
        toastError('Error', 'Error al actualizar');
      }
    } catch (error) {
      toastError('Error', 'Error de red');
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
        loadWaterToday();
        const bevName = BEVERAGE_TYPES.find(b => b.id === selectedBeverage)?.label;
        success(`¡${bevName} registrado!`, `+${amountMl}ml agregados.`);
        setCustomMl('');
      }
    } catch (error) {
      toastError('Error', 'Error al registrar bebida');
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

  const deleteLog = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;
    try {
      const response = await fetch(`/api/food/log?id=${id}`, { method: 'DELETE', credentials: 'include' });
      if (response.ok) {
        loadTodayLogs();
        success('Registro eliminado');
      }
    } catch (error) {
      toastError('Error', 'Error al eliminar');
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
  const waterPercentage = Math.min((waterTotal / 2000) * 100, 100);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
          <p className="text-stone-500 font-medium animate-pulse">Cargando NutriFlow...</p>
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
            <h1 className="text-5xl font-heading font-extrabold tracking-tighter text-slate-900">Bitácora de Salud</h1>
            <p className="text-lg text-slate-500 font-medium">Control preciso de comida e hidratación</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-heading font-extrabold tracking-tight text-emerald-600">
              {dailyTotals.calories} <span className="text-2xl text-emerald-600/50 font-bold">/ {calorieGoal} kcal</span>
            </div>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm">
          <Button variant="ghost" size="sm" onClick={() => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; })} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Ayer
          </Button>
          <div className="text-center">
            <div className="font-bold text-slate-900">
              {selectedDate.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div className="text-xs text-slate-400">
              {selectedDate.toDateString() === new Date().toDateString() ? 'Hoy' : ''}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; })} className="gap-1" disabled={selectedDate.toDateString() === new Date().toDateString()}>
            Mañana <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Hidratación Premium y Búsqueda */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="card-nutriflow overflow-hidden border-blue-500/20 bg-white shadow-xl relative group">
            <div className="absolute inset-0 bg-blue-50/50 opacity-50 pointer-events-none" />
            
            {/* WAVE ANIMATION BACKGROUND */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500/30 to-blue-400/20 transition-all duration-[1500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] pointer-events-none overflow-visible"
              style={{ height: `${waterPercentage}%` }}
            >
              <div className="absolute -top-6 left-0 w-[200%] h-6 animate-wave">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor" className="text-blue-400/60 w-full h-full">
                  <path fillOpacity="0.4" d="M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,176C672,149,768,107,864,106.7C960,107,1056,149,1152,176C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                  <path fillOpacity="0.8" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,133.3C960,107,1056,85,1152,90.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>
            </div>

            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-3xl bg-blue-600 shadow-lg shadow-blue-200 text-white">
                    <Droplets className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900 text-2xl font-black">
                      {selectedDate.toDateString() === new Date().toDateString() ? 'Hidratación' : `Agua del ${selectedDate.toLocaleDateString('es', { day: 'numeric', month: 'long' })}`}
                    </CardTitle>
                    <CardDescription className="text-blue-700 font-bold uppercase tracking-wider text-[10px]">
                      {waterTotal}ml {selectedDate.toDateString() === new Date().toDateString() ? 'consumidos hoy' : 'registrados'}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-blue-600 leading-none">{Math.round(waterPercentage)}%</div>
                  <div className="text-[10px] text-blue-400 font-bold uppercase mt-1">Meta: 2000ml</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
              {/* Beverage Type Selector */}
              <div className="flex items-center justify-between gap-2 bg-slate-100/80 p-1 rounded-2xl border border-white/50 backdrop-blur-sm">
                {BEVERAGE_TYPES.map((bev, index) => (
                  <button
                    key={`${bev.id}-${index}`}
                    onClick={() => setSelectedBeverage(bev.id)}
                    className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${
                      selectedBeverage === bev.id 
                      ? 'bg-white shadow-md scale-105' 
                      : 'hover:bg-white/50 grayscale opacity-60'
                    }`}
                  >
                    <bev.icon className={`h-5 w-5 ${bev.color} mb-1`} />
                    <span className="text-[9px] font-black uppercase text-slate-500">{bev.label}</span>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-3">
                {WATER_AMOUNTS.map((water, index) => (
                  <Button 
                    key={`${water.ml}-${index}`} 
                    onClick={() => addWater(water.ml)} 
                    variant="ghost" 
                    className="flex flex-col h-auto py-4 bg-white/60 border border-white hover:bg-blue-50 hover:border-blue-200 rounded-2xl transition-all"
                  >
                    <span className="text-2xl mb-1">{water.icon}</span>
                    <span className="text-xs font-black text-blue-700 leading-none">{water.label}</span>
                  </Button>
                ))}
              </div>

              {/* Custom and History Toggle */}
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center bg-white border border-blue-100 rounded-2xl px-4 py-2 ring-blue-50 focus-within:ring-4 transition-all">
                  <Input
                    type="number"
                    placeholder="Otro (ml)..."
                    value={customMl}
                    onChange={(e) => setCustomMl(e.target.value)}
                    className="border-none p-0 focus-visible:ring-0 text-lg font-bold"
                  />
                  {customMl && (
                    <Button 
                      size="sm" 
                      onClick={() => addWater(Number(customMl))} 
                      className="bg-blue-600 hover:bg-blue-700 text-white h-8 rounded-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowHistory(!showHistory)}
                  className={`rounded-2xl h-12 w-12 border-blue-100 ${showHistory ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
                >
                  <Clock className="h-5 w-5" />
                </Button>
              </div>

              {/* Detailed History (Collapsible) */}
              {showHistory && (
                <div className="animate-in slide-in-from-top-4 duration-300 space-y-2 max-h-40 overflow-y-auto pr-1">
                  {waterLogs.length === 0 ? (
                    <p className="text-center py-4 text-xs text-slate-400 italic">No hay registros para este día.</p>
                  ) : (
                    waterLogs.map((log, index) => {
                      const bev = BEVERAGE_TYPES.find(b => b.id === log.beverageType) || BEVERAGE_TYPES[0];
                      return (
                        <div key={`${log.id}-${index}`} className="flex items-center justify-between p-3 bg-white/40 border border-white rounded-xl group/log">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${bev.bg}`}>
                              <bev.icon className={`h-4 w-4 ${bev.color}`} />
                            </div>
                            <div>
                              <div className="text-xs font-black text-slate-700">{log.amountMl}ml de {bev.label}</div>
                              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteWaterLog(log.id)}
                            className="h-8 w-8 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-nutriflow shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-emerald-600" />
                Buscador Nutricional
              </CardTitle>
              <CardDescription>Base de datos global con 250k+ alimentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tacos, Ramen, Pizza, Pollo..."
                    className="pl-10 h-12 text-lg"
                  />
                </div>

                {isSearching && <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-500" /></div>}

                {searchResults.length > 0 && !selectedFood && (
                  <div className="grid gap-2 max-h-80 overflow-y-auto pr-1">
                    {searchResults.map((food, index) => (
                      <div key={`${food.id}-${index}`} className="group relative flex flex-col p-4 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 cursor-pointer" onClick={() => selectFood(food)}>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900">{food.name}</span>
                              {food.isVerified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                            </div>
                            <div className="text-xs text-stone-500">{food.brand || (food.isBaseIngredient ? 'Ingrediente Base' : 'Tradicional')}</div>
                          </div>
                          <div className="text-right mr-4 font-black text-emerald-700">{food.calories} kcal</div>
                        </div>
                        {food.ingredients && (
                          <div className="mt-2 text-[10px] text-stone-400 italic border-t border-stone-100 pt-2">
                            Ingredientes: {food.ingredients}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {selectedFood && (
                  <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-2xl text-emerald-900">{selectedFood.name}</h3>
                        </div>
                        <p className="text-emerald-600/70 text-xs font-bold uppercase mt-1 flex items-center gap-1">
                          <Globe2 className="h-3 w-3" /> Fuente: {selectedFood.dataSource || 'Oficial'}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedFood(null)} className="rounded-full"><X className="h-5 w-5" /></Button>
                    </div>

                    {/* Serving mode toggle */}
                    {selectedFood.servingName && !selectedFood.servingName.includes('100g') && (
                      <div className="flex bg-white rounded-2xl border-2 border-emerald-100 p-1">
                        <button
                          onClick={() => setUsePieces(true)}
                          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                            usePieces 
                              ? 'bg-emerald-600 text-white shadow-md' 
                              : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          Por Piezas
                        </button>
                        <button
                          onClick={() => setUsePieces(false)}
                          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                            !usePieces 
                              ? 'bg-emerald-600 text-white shadow-md' 
                              : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          Por Gramos
                        </button>
                      </div>
                    )}

                    <div className="space-y-4">
                      {usePieces ? (
                        <div className="space-y-3">
                          <div className="flex items-center bg-white rounded-2xl border-2 border-emerald-100 p-2">
                            <button
                              onClick={() => handleServingCountChange(servingCount - 0.5)}
                              disabled={servingCount <= 0.5}
                              className="w-12 h-12 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-black text-xl disabled:opacity-30 transition-colors"
                            >
                              -
                            </button>
                            <Input
                              type="number"
                              value={servingCount}
                              onChange={(e) => handleServingCountChange(Number(e.target.value))}
                              className="text-3xl font-black border-none text-center focus-visible:ring-0 flex-1"
                              min="0.5"
                              step="0.5"
                            />
                            <button
                              onClick={() => handleServingCountChange(servingCount + 0.5)}
                              className="w-12 h-12 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-black text-xl transition-colors"
                            >
                              +
                            </button>
                            <span className="pl-3 pr-4 font-black text-emerald-900 uppercase text-xs">
                              {(() => {
                                const name = selectedFood.servingName || 'porción';
                                // Strip leading number for clean pluralization
                                const baseName = name.replace(/^\d+\s+/, '').replace(/^1\s+/, '');
                                return servingCount > 1 ? `${baseName}s` : baseName;
                              })()}
                            </span>
                          </div>
                          <div className="text-center text-xs font-bold text-emerald-600">
                            Equivale a {servingSize}g
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center bg-white rounded-2xl border-2 border-emerald-100 p-2">
                          <Input
                            type="number"
                            value={servingSize}
                            onChange={(e) => handleServingSizeChange(Number(e.target.value))}
                            className="text-2xl font-black border-none text-center focus-visible:ring-0"
                          />
                          <span className="pr-4 font-black text-emerald-900 uppercase text-xs">Gramos</span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button onClick={saveFoodLog} disabled={isSaving} className="col-span-2 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100">
                          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'REGISTRAR ALIMENTO'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bitácora de hoy */}
        <Card className="card-nutriflow mt-6 shadow-xl border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-900 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-emerald-600" />
              {selectedDate.toDateString() === new Date().toDateString() ? 'Consumo Diario' : `Comidas del ${selectedDate.toLocaleDateString('es', { day: 'numeric', month: 'long' })}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {foodLogs.length === 0 ? (
              <div className="text-center py-10 text-stone-400 italic">
                No has registrado alimentos para este día... {selectedDate.toDateString() === new Date().toDateString() ? '¡empieza a registrar!' : 'descansa.'}
              </div>
            ) : (
              <div className="space-y-3">
                {foodLogs.map((log, index) => {
                  // Hide "gramos" label since it's redundant with the "g" value
                  const servingNameClean = log.servingName && 
                    !log.servingName.includes('100g') && 
                    log.servingName !== 'gramos' &&
                    log.servingName !== 'porción'
                    ? log.servingName : null;
                  const servingDisplay = servingNameClean 
                    ? `${servingNameClean} (${log.servingSize}g)` 
                    : `${log.servingSize}g`;
                  return (
                    <div key={`${log.id}-${index}`} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white shadow-sm border border-emerald-50 rounded-xl"><Flame className="h-5 w-5 text-emerald-600" /></div>
                        <div>
                          <div className="font-bold text-stone-900">{log.foodName}</div>
                          <div className="text-xs text-stone-500 uppercase font-black">{MEAL_TYPES.find(m => m.value === log.mealType)?.label} • {servingDisplay}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-6">
                        <div className="text-right">
                          <div className="font-black text-emerald-700">{log.calories} kcal</div>
                          <div className="text-[10px] text-stone-400 font-bold uppercase">P:{log.protein} C:{log.carbs} G:{log.fat}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" size="icon" 
                            onClick={() => { setEditingLog(log); setEditServingSize(log.servingSize); }} 
                            className="text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" size="icon" 
                            onClick={() => deleteLog(log.id)} 
                            className="text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editingLog} onOpenChange={(open) => !open && setEditingLog(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-emerald-900 font-bold text-2xl flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-emerald-500" /> Editar Cantidad
            </DialogTitle>
            <DialogDescription>
              {editingLog?.foodName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center bg-stone-50 rounded-2xl border-2 border-stone-200 p-2">
              <Input
                type="number"
                value={editServingSize}
                onChange={(e) => setEditServingSize(Number(e.target.value))}
                className="text-2xl font-black border-none text-center bg-transparent focus-visible:ring-0"
              />
              <span className="pr-4 font-black text-stone-500 uppercase text-xs">Gramos</span>
            </div>
            {editingLog && (
              <div className="flex justify-between items-center px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Nuevas Calorías:</span>
                <span className="font-black text-emerald-600 text-lg">
                  {Math.round(editingLog.calories * (editServingSize / (editingLog.servingSize || 100)))} kcal
                </span>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setEditingLog(null)} className="rounded-xl font-bold">Cancelar</Button>
            <Button onClick={updateFoodLog} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md font-bold px-8">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WAVE ANIMATION CSS */}
      <style jsx global>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave {
          animation: wave 4s linear infinite;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
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
