'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Flame,
  Droplets,
  Utensils,
  TrendingUp,
  TrendingDown,
  Minus,
  Dumbbell,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

interface DailyStats {
  caloriesConsumed: number;
  caloriesBurned: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
}

export default function DashboardPage() {
  const { user, isPremium } = useAuth();
  const [stats, setStats] = React.useState<DailyStats>({
    caloriesConsumed: 0,
    caloriesBurned: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    waterMl: 0,
  });

  React.useEffect(() => {
    // Load today's stats
    loadTodayStats();
  }, []);

  const loadTodayStats = async () => {
    try {
      const response = await fetch('/api/stats/today');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const netCalories = stats.caloriesConsumed - stats.caloriesBurned;
  const calorieRemaining = (user?.calorieGoal || 2000) - netCalories;
  const calorieProgress = Math.min((netCalories / (user?.calorieGoal || 2000)) * 100, 100);

  const proteinProgress = (stats.protein / (user?.proteinGoal || 150)) * 100;
  const carbsProgress = (stats.carbs / (user?.carbGoal || 250)) * 100;
  const fatProgress = (stats.fat / (user?.fatGoal || 65)) * 100;

  const waterGlasses = Math.floor(stats.waterMl / 250);
  const waterGoal = 8; // 8 glasses = 2L

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Hola, {user?.name}</h1>
          <p className="text-stone-500">Aquí está tu resumen de hoy</p>
        </div>

        {/* Calorie Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Calorías
              </CardTitle>
              <CardDescription>
                {user?.calorieGoal || 2000} kcal objetivo diario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-center py-4">
                {Math.round(calorieRemaining)} kcal restantes
              </div>
              <Progress value={calorieProgress} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-stone-500">Comidas</div>
                  <div className="font-semibold text-emerald-700">{stats.caloriesConsumed}</div>
                </div>
                <div>
                  <div className="text-stone-500">Ejercicio</div>
                  <div className="font-semibold text-orange-500">{stats.caloriesBurned}</div>
                </div>
                <div>
                  <div className="text-stone-500">Neto</div>
                  <div className="font-semibold">{netCalories}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                Hidratación
              </CardTitle>
              <CardDescription>
                {waterGlasses} de {waterGoal} vasos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-center py-4">
                {stats.waterMl} ml
              </div>
              <Progress value={(waterGlasses / waterGoal) * 100} className="h-3" />
              <Button className="w-full gap-2" onClick={async () => {
                await fetch('/api/hydration', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ amountMl: 250 }),
                });
                setStats(prev => ({ ...prev, waterMl: prev.waterMl + 250 }));
              }}>
                <Plus className="h-4 w-4" />
                Agregar vaso (250ml)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Macros */}
        <Card>
          <CardHeader>
            <CardTitle>Macronutrientes</CardTitle>
            <CardDescription>Progreso diario de macros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Proteínas</span>
                  <span className="text-stone-500">
                    {Math.round(stats.protein)} / {user?.proteinGoal || 150}g
                  </span>
                </div>
                <Progress value={proteinProgress} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Carbohidratos</span>
                  <span className="text-stone-500">
                    {Math.round(stats.carbs)} / {user?.carbGoal || 250}g
                  </span>
                </div>
                <Progress value={carbsProgress} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Grasas</span>
                  <span className="text-stone-500">
                    {Math.round(stats.fat)} / {user?.fatGoal || 65}g
                  </span>
                </div>
                <Progress value={fatProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/food-log">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <Utensils className="h-8 w-8 text-emerald-700 mb-2" />
                <CardTitle>Registrar Comida</CardTitle>
                <CardDescription>
                  Agrega alimentos a tu registro diario
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/exercise">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <Dumbbell className="h-8 w-8 text-emerald-700 mb-2" />
                <CardTitle>Registrar Ejercicio</CardTitle>
                <CardDescription>
                  Registra tu entrenamiento de hoy
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-emerald-700 mb-2" />
                <CardTitle>Ver Historial</CardTitle>
                <CardDescription>
                  Revisa tu progreso semanal
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
