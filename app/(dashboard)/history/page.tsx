'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DailyStats {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [stats, setStats] = React.useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/stats/history?days=7');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAverage = (key: keyof DailyStats) => {
    if (stats.length === 0) return 0;
    const sum = stats.reduce((acc, stat) => acc + (stat[key] as number), 0);
    return Math.round(sum / stats.length);
  };

  const getTrend = (key: keyof DailyStats) => {
    if (stats.length < 2) return 'stable';
    const last = stats[stats.length - 1][key] as number;
    const avg = getAverage(key);
    if (last > avg * 1.1) return 'up';
    if (last < avg * 0.9) return 'down';
    return 'stable';
  };

  const maxCalories = Math.max(...stats.map((s) => s.caloriesConsumed), user?.calorieGoal || 2000);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Historial</h1>
          <p className="text-stone-500">Tu progreso de los últimos 7 días</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Calorías promedio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAverage('caloriesConsumed')}</div>
              <div className="flex items-center gap-1 text-xs mt-1">
                {getTrend('caloriesConsumed') === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-orange-500" />
                ) : getTrend('caloriesConsumed') === 'down' ? (
                  <TrendingDown className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Minus className="h-3 w-3 text-stone-500" />
                )}
                <span className="text-stone-500">
                  {getTrend('caloriesConsumed') === 'up' ? '↑' : getTrend('caloriesConsumed') === 'down' ? '↓' : '→'} respecto al promedio
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Proteína promedio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAverage('protein')}g</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Carbs promedio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAverage('carbs')}g</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Grasas promedio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAverage('fat')}g</div>
            </CardContent>
          </Card>
        </div>

        {/* Calorie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-700" />
              Calorías de los últimos 7 días
            </CardTitle>
            <CardDescription>
              Comparativa con tu objetivo diario ({user?.calorieGoal} kcal)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2 md:gap-4">
              {stats.map((day, index) => {
                const heightPercent = (day.caloriesConsumed / maxCalories) * 100;
                const isOverGoal = day.caloriesConsumed > (user?.calorieGoal || 2000);
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative flex-1 flex items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          isOverGoal ? 'bg-orange-500' : 'bg-emerald-600'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <div
                        className="absolute w-full border-t-2 border-dashed border-stone-400"
                        style={{
                          bottom: `${((user?.calorieGoal || 2000) / maxCalories) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-stone-500">{dayName}</div>
                    <div className="text-xs font-medium">{day.caloriesConsumed}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Daily Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Desglose Diario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 px-4 font-medium text-stone-600">Fecha</th>
                    <th className="text-right py-2 px-4 font-medium text-stone-600">Calorías</th>
                    <th className="text-right py-2 px-4 font-medium text-stone-600">Proteína</th>
                    <th className="text-right py-2 px-4 font-medium text-stone-600">Carbs</th>
                    <th className="text-right py-2 px-4 font-medium text-stone-600">Grasas</th>
                    <th className="text-right py-2 px-4 font-medium text-stone-600">Agua</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((day, index) => (
                    <tr key={index} className="border-b border-stone-100">
                      <td className="py-3 px-4">
                        {new Date(day.date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="text-right py-3 px-4">{day.caloriesConsumed}</td>
                      <td className="text-right py-3 px-4">{day.protein}g</td>
                      <td className="text-right py-3 px-4">{day.carbs}g</td>
                      <td className="text-right py-3 px-4">{day.fat}g</td>
                      <td className="text-right py-3 px-4">{day.waterMl}ml</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
