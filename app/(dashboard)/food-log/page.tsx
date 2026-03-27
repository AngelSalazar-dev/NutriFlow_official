'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Search } from 'lucide-react';

interface FoodLog {
  _id: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Desayuno' },
  { value: 'lunch', label: 'Almuerzo' },
  { value: 'dinner', label: 'Cena' },
  { value: 'snack', label: 'Snack' },
];

export default function FoodLogPage() {
  const { user } = useAuth();
  const [logs, setLogs] = React.useState<FoodLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [totals, setTotals] = React.useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  React.useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const response = await fetch('/api/food/log');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setTotals(data.totals);
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
      const response = await fetch('/api/food/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: formData.get('foodName'),
          calories: Number(formData.get('calories')),
          protein: Number(formData.get('protein')),
          carbs: Number(formData.get('carbs')),
          fat: Number(formData.get('fat')),
          servingSize: Number(formData.get('servingSize')),
          mealType: formData.get('mealType'),
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
      const response = await fetch(`/api/food/log?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadLogs();
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const getLogsByMealType = (mealType: string) => {
    return logs.filter((log) => log.mealType === mealType);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Registro de Alimentos</h1>
            <p className="text-stone-500">Controla lo que comes hoy</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Comida
          </Button>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-700">{totals.calories}</div>
                <div className="text-sm text-stone-500">Calorías</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totals.protein}g</div>
                <div className="text-sm text-stone-500">Proteínas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totals.carbs}g</div>
                <div className="text-sm text-stone-500">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totals.fat}g</div>
                <div className="text-sm text-stone-500">Grasas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Food Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Agregar Comida</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddLog} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foodName">Nombre del alimento</Label>
                    <Input id="foodName" name="foodName" placeholder="Ej: Arroz con pollo" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mealType">Tipo de comida</Label>
                    <select
                      id="mealType"
                      name="mealType"
                      className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      required
                    >
                      {MEAL_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calories">Calorías</Label>
                    <Input id="calories" name="calories" type="number" min="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="protein">Proteínas (g)</Label>
                    <Input id="protein" name="protein" type="number" min="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input id="carbs" name="carbs" type="number" min="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fat">Grasas (g)</Label>
                    <Input id="fat" name="fat" type="number" min="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servingSize">Porciones</Label>
                    <Input id="servingSize" name="servingSize" type="number" min="0" step="0.5" defaultValue={1} />
                  </div>
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

        {/* Food Logs by Meal Type */}
        <div className="space-y-4">
          {MEAL_TYPES.map((mealType) => {
            const mealLogs = getLogsByMealType(mealType.value);
            const mealCalories = mealLogs.reduce((acc, log) => acc + log.calories, 0);

            return (
              <Card key={mealType.value}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{mealType.label}</CardTitle>
                    <span className="text-sm text-stone-500">{mealCalories} kcal</span>
                  </div>
                </CardHeader>
                <CardContent>
                  {mealLogs.length === 0 ? (
                    <p className="text-sm text-stone-500">No hay alimentos registrados</p>
                  ) : (
                    <div className="space-y-2">
                      {mealLogs.map((log) => (
                        <div
                          key={log._id}
                          className="flex justify-between items-center p-3 bg-stone-50 rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{log.foodName}</div>
                            <div className="text-sm text-stone-500">
                              {log.calories} kcal • P: {log.protein}g • C: {log.carbs}g • G: {log.fat}g
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLog(log._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
