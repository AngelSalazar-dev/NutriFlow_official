'use client';

import * as React from 'react';
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
  GlassWater,
  CupSoda,
} from 'lucide-react';
import { FoodItem, searchFoods, getFrequentFoods } from '@/lib/food-database';

interface FoodLog {
  id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  mealType: string;
  date: string;
  isCustom: boolean;
}

interface WaterLog {
  id: string;
  amountMl: number;
  logTime: string;
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

export default function FoodLogPage() {
  const { user, isPremium } = useAuth();
  const { success, error: toastError } = useToast();
  
  // Estados
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<FoodItem[]>([]);
  const [frequentFoods, setFrequentFoods] = React.useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedFood, setSelectedFood] = React.useState<FoodItem | null>(null);
  const [servingSize, setServingSize] = React.useState(100);
  const [mealType, setMealType] = React.useState('breakfast');
  const [foodLogs, setFoodLogs] = React.useState<FoodLog[]>([]);
  const [waterLogs, setWaterLogs] = React.useState<WaterLog[]>([]);
  const [waterTotal, setWaterTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const searchControllerRef = React.useRef<AbortController | null>(null);
  
  // Edit dialog
  const [editingLog, setEditingLog] = React.useState<FoodLog | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editCalories, setEditCalories] = React.useState(0);
  const [editProtein, setEditProtein] = React.useState(0);
  const [editCarbs, setEditCarbs] = React.useState(0);
  const [editFat, setEditFat] = React.useState(0);

  // Cargar datos al iniciar
  React.useEffect(() => {
    loadTodayLogs();
    loadFrequentFoods();
    loadWaterToday();
  }, []);

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
      const response = await fetch('/api/food/today');
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
      const response = await fetch('/api/food/search?frequent=true');
      if (response.ok) {
        const data = await response.json();
        setFrequentFoods(data.foods || []);
      }
    } catch (error) {
      console.error('Error loading frequent foods:', error);
    }
  };

  const loadWaterToday = async () => {
    try {
      const response = await fetch('/api/hydration/today');
      if (response.ok) {
        const data = await response.json();
        setWaterTotal(data.totalMl || 0);
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
        signal: searchControllerRef.current.signal
      });
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.foods || []);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error searching foods:', error);
      }
    } finally {
      if (!searchControllerRef.current?.signal.aborted) {
        setIsSearching(false);
      }
    }
  };

  const selectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setServingSize(food.servingSize);
    setSearchQuery('');
    setSearchResults([]);
  };

  const calculateNutrition = (food: FoodItem, serving: number) => {
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
      
      const response = await fetch('/api/food/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodId: selectedFood.id,
          foodName: selectedFood.name,
          ...nutrition,
          servingSize,
          mealType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        success('¡Alimento registrado!', `${selectedFood.name} agregado al ${MEAL_TYPES.find(m => m.value === mealType)?.label}`);
        setSelectedFood(null);
        setServingSize(100);
        loadTodayLogs();
      } else {
        toastError('Error', data.error || 'Error al registrar alimento');
      }
    } catch (error) {
      console.error('Error saving food log:', error);
      toastError('Error', 'Error al registrar alimento');
    } finally {
      setIsSaving(false);
    }
  };

  const addWater = async (amountMl: number) => {
    try {
      const response = await fetch('/api/hydration/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountMl }),
      });

      if (response.ok) {
        success('¡Agua registrada!', `+${amountMl}ml`);
        setWaterTotal(prev => prev + amountMl);
      }
    } catch (error) {
      console.error('Error adding water:', error);
      toastError('Error', 'Error al registrar agua');
    }
  };

  const deleteFoodLog = async (logId: string) => {
    try {
      const response = await fetch(`/api/food/log?id=${logId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        success('Alimento eliminado');
        loadTodayLogs();
      } else {
        const data = await response.json();
        toastError('Error', data.error || 'Error al eliminar alimento');
      }
    } catch (error) {
      console.error('Error deleting food log:', error);
      toastError('Error', 'Error al eliminar alimento');
    }
  };

  const openEditDialog = (log: FoodLog) => {
    setEditingLog(log);
    setEditCalories(log.calories);
    setEditProtein(log.protein);
    setEditCarbs(log.carbs);
    setEditFat(log.fat);
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    if (!editingLog) return;

    try {
      const response = await fetch('/api/food/log', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logId: editingLog.id,
          foodName: editingLog.foodName,
          calories: editCalories,
          protein: editProtein,
          carbs: editCarbs,
          fat: editFat,
          servingSize: editingLog.servingSize,
          mealType: editingLog.mealType,
        }),
      });

      if (response.ok) {
        success('Alimento actualizado');
        setIsEditDialogOpen(false);
        setEditingLog(null);
        loadTodayLogs();
      } else {
        const data = await response.json();
        toastError('Error', data.error || 'Error al actualizar alimento');
      }
    } catch (error) {
      console.error('Error updating food log:', error);
      toastError('Error', 'Error al actualizar alimento');
    }
  };

  // Calcular totales del día
  const dailyTotals = foodLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein,
      carbs: acc.carbs + log.carbs,
      fat: acc.fat + log.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const calorieGoal = user?.calorieGoal || 2000;
  const calorieRemaining = calorieGoal - dailyTotals.calories;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-6xl w-full mx-auto animate-pulse">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-stone-200 rounded-lg"></div>
              <div className="h-4 w-40 bg-stone-200 rounded-lg"></div>
            </div>
            <div className="space-y-2 text-right">
              <div className="h-8 w-32 bg-stone-200 rounded-lg ml-auto"></div>
              <div className="h-4 w-24 bg-stone-200 rounded-lg ml-auto"></div>
            </div>
          </div>
          
          <div className="h-40 w-full bg-stone-200 rounded-3xl"></div>
          <div className="h-64 w-full bg-stone-200 rounded-3xl mt-6"></div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="h-32 bg-stone-200 rounded-3xl"></div>
            <div className="h-32 bg-stone-200 rounded-3xl"></div>
            <div className="h-32 bg-stone-200 rounded-3xl"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-5xl font-heading font-extrabold tracking-tighter text-slate-900">Registro de Alimentos</h1>
            <p className="text-lg text-slate-500 font-medium">Registra lo que comes hoy y mantén el control</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-heading font-extrabold tracking-tight text-emerald-600">
              {dailyTotals.calories} <span className="text-2xl text-emerald-600/50 font-bold">/ {calorieGoal} kcal</span>
            </div>
            <div className="text-sm font-medium text-slate-500">
              {calorieRemaining > 0 ? `${calorieRemaining} restantes` : '¡Objetivo alcanzado!'}
            </div>
          </div>
        </div>

        {/* Hidratación Rápida */}
        <Card className="card-nutriflow overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 shadow-[0_8px_30px_rgb(59,130,246,0.1)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-blue-600">
                  <Droplets className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">Hidratación</CardTitle>
                  <CardDescription className="text-blue-700">
                    {waterTotal}ml de 2000ml objetivo
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-700">
                  {Math.round((waterTotal / 2000) * 100)}%
                </div>
              </div>
            </div>
            <Progress value={(waterTotal / 2000) * 100} className="h-3 mt-4" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {WATER_AMOUNTS.map((water) => (
                <Button
                  key={water.ml}
                  onClick={() => addWater(water.ml)}
                  variant="outline"
                  className="flex flex-col h-auto py-3 border-blue-200 hover:bg-blue-100 transition-all"
                >
                  <span className="text-2xl mb-1">{water.icon}</span>
                  <span className="text-xs font-medium text-blue-700">{water.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Búsqueda de Alimentos */}
        <Card className="card-nutriflow shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-emerald-600" />
              Buscar Alimento
            </CardTitle>
            <CardDescription>
              Escribe el nombre del alimento y selecciónalo de la lista
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Input de búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej: Manzana, Pollo, Arroz..."
                  className="pl-10 h-12 text-lg"
                  disabled={isSearching || selectedFood !== null}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setSelectedFood(null);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Resultados de búsqueda */}
              {isSearching && (
                <div className="flex items-center gap-2 text-stone-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Buscando...</span>
                </div>
              )}

              {searchResults.length > 0 && !selectedFood && (
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {searchResults.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => selectFood(food)}
                      className="flex items-center justify-between p-4 rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-stone-900">{food.name}</div>
                        <div className="text-sm text-stone-500">
                          {food.servingName} ({food.servingSize}g)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-700">{food.calories} kcal</div>
                        <div className="text-xs text-stone-500">
                          P: {food.protein}g | C: {food.carbs}g | G: {food.fat}g
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-stone-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Alimentos frecuentes (cuando no hay búsqueda) */}
              {!searchQuery && !selectedFood && frequentFoods.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-stone-600 mb-2">
                    🕐 Alimentos frecuentes
                  </div>
                  <div className="grid gap-2">
                    {frequentFoods.map((food) => (
                      <button
                        key={food.id}
                        onClick={() => selectFood(food)}
                        className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {food.category === 'frutas' && '🍎'}
                            {food.category === 'verduras' && '🥦'}
                            {food.category === 'proteinas' && '🍗'}
                            {food.category === 'carbohidratos' && '🍚'}
                            {food.category === 'lacteos' && '🥛'}
                            {food.category === 'frutos_secos' && '🥜'}
                            {food.category === 'bebidas' && '🥤'}
                            {food.category === 'snacks' && '🍫'}
                            {food.category === 'comida_rapida' && '🍔'}
                            {food.category === 'legumbres' && '🫘'}
                          </div>
                          <div>
                            <div className="font-medium">{food.name}</div>
                            <div className="text-xs text-stone-500">{food.servingName}</div>
                          </div>
                        </div>
                        <div className="font-semibold text-emerald-700">
                          {Math.round(food.calories * (food.servingSize / 100))} kcal
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Alimento seleccionado */}
              {selectedFood && (
                <div className="p-4 rounded-lg bg-emerald-50 border-2 border-emerald-300 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg text-emerald-900">{selectedFood.name}</div>
                      <div className="text-sm text-emerald-700">
                        {selectedFood.servingName} base ({selectedFood.servingSize}g)
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFood(null);
                        setSearchQuery('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Selector de porción */}
                  <div className="space-y-2">
                    <Label htmlFor="serving">Tamaño de porción (gramos)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="serving"
                        type="number"
                        value={servingSize}
                        onChange={(e) => setServingSize(Number(e.target.value))}
                        className="w-32"
                        min="1"
                        max="1000"
                      />
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setServingSize(50)}
                        >
                          50g
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setServingSize(100)}
                        >
                          100g
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setServingSize(selectedFood.servingSize)}
                        >
                          Porción
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Información nutricional calculada */}
                  <div className="grid grid-cols-4 gap-3 p-3 rounded-lg bg-white border border-emerald-200">
                    <div className="text-center">
                      <div className="text-xs text-stone-500">Calorías</div>
                      <div className="font-bold text-emerald-700">
                        {calculateNutrition(selectedFood, servingSize).calories}
                      </div>
                      <div className="text-xs text-stone-400">kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-stone-500">Proteína</div>
                      <div className="font-bold text-blue-700">
                        {calculateNutrition(selectedFood, servingSize).protein}
                      </div>
                      <div className="text-xs text-stone-400">g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-stone-500">Carbs</div>
                      <div className="font-bold text-amber-700">
                        {calculateNutrition(selectedFood, servingSize).carbs}
                      </div>
                      <div className="text-xs text-stone-400">g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-stone-500">Grasa</div>
                      <div className="font-bold text-purple-700">
                        {calculateNutrition(selectedFood, servingSize).fat}
                      </div>
                      <div className="text-xs text-stone-400">g</div>
                    </div>
                  </div>

                  {/* Selector de tipo de comida */}
                  <div className="grid grid-cols-4 gap-2">
                    {MEAL_TYPES.map((meal) => {
                      const Icon = meal.icon;
                      return (
                        <Button
                          key={meal.value}
                          type="button"
                          variant={mealType === meal.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setMealType(meal.value)}
                          className={mealType === meal.value ? 'bg-emerald-600' : ''}
                        >
                          <Icon className="h-4 w-4 mr-1" />
                          {meal.label}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Botón de guardar */}
                  <Button
                    onClick={saveFoodLog}
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                    size="lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Registrar Alimento
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registro de hoy */}
        <Card className="card-nutriflow shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-emerald-600" />
              Alimentos Registrados Hoy
            </CardTitle>
            <CardDescription>
              {foodLogs.length} alimentos registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {foodLogs.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Utensils className="h-10 w-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">Tu bitácora está en blanco</h3>
                <p className="text-stone-500 max-w-sm mx-auto mb-6 leading-relaxed">
                  Busca un alimento arriba y regístralo para mantener tus calorías bajo control y acercarte a tu meta.
                </p>
                <Button 
                  variant="outline" 
                  className="rounded-xl border-dashed border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700 font-medium"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <Search className="h-4 w-4 mr-2" /> Buscar primer alimento
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {foodLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-5 rounded-3xl border border-stone-200/50 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">
                        {log.mealType === 'breakfast' && '🌅'}
                        {log.mealType === 'lunch' && '☀️'}
                        {log.mealType === 'dinner' && '🌙'}
                        {log.mealType === 'snack' && '🍿'}
                      </div>
                      <div>
                        <div className="font-semibold">{log.foodName}</div>
                        <div className="text-xs text-stone-500">
                          {MEAL_TYPES.find(m => m.value === log.mealType)?.label} • {log.servingSize}g
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-emerald-700">{log.calories} kcal</div>
                        <div className="text-xs text-slate-500">
                          P: {log.protein}g • C: {log.carbs}g • G: {log.fat}g
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(log)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteFoodLog(log.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumen de Macros */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-nutriflow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-stone-500">Proteína</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">
                {Math.round(dailyTotals.protein)}g
              </div>
              <Progress value={(dailyTotals.protein / ((user?.proteinGoal || 150))) * 100} className="h-2 mt-2" />
              <div className="text-xs text-stone-500 mt-1">
                Objetivo: {user?.proteinGoal || 150}g
              </div>
            </CardContent>
          </Card>

          <Card className="card-nutriflow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-stone-500">Carbohidratos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700">
                {Math.round(dailyTotals.carbs)}g
              </div>
              <Progress value={(dailyTotals.carbs / ((user?.carbGoal || 250))) * 100} className="h-2 mt-2" />
              <div className="text-xs text-stone-500 mt-1">
                Objetivo: {user?.carbGoal || 250}g
              </div>
            </CardContent>
          </Card>

          <Card className="card-nutriflow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-stone-500">Grasas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">
                {Math.round(dailyTotals.fat)}g
              </div>
              <Progress value={(dailyTotals.fat / ((user?.fatGoal || 65))) * 100} className="h-2 mt-2" />
              <div className="text-xs text-stone-500 mt-1">
                Objetivo: {user?.fatGoal || 65}g
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog de Edición */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Alimento</DialogTitle>
              <DialogDescription>
                Modifica los valores nutricionales de {editingLog?.foodName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-calories">Calorías</Label>
                <Input
                  id="edit-calories"
                  type="number"
                  value={editCalories}
                  onChange={(e) => setEditCalories(Number(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-protein">Proteína (g)</Label>
                  <Input
                    id="edit-protein"
                    type="number"
                    value={editProtein}
                    onChange={(e) => setEditProtein(Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-carbs">Carbs (g)</Label>
                  <Input
                    id="edit-carbs"
                    type="number"
                    value={editCarbs}
                    onChange={(e) => setEditCarbs(Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-fat">Grasa (g)</Label>
                  <Input
                    id="edit-fat"
                    type="number"
                    value={editFat}
                    onChange={(e) => setEditFat(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveEdit} className="bg-emerald-600 hover:bg-emerald-700">
                <Check className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
