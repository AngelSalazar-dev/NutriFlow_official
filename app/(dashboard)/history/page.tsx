'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3, TrendingUp, TrendingDown, Minus,
  Flame, Droplets, Dumbbell, Calendar,
  ChevronDown, ChevronUp, Loader2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend,
} from 'recharts';

interface DailyStats {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
  exerciseCount: number;
  exerciseNames: string;
}

const DAY_OPTIONS = [
  { value: 7, label: '7 días' },
  { value: 14, label: '2 semanas' },
  { value: 30, label: '30 días' },
];

export default function HistoryPage() {
  const { user } = useAuth();
  const [stats, setStats] = React.useState<DailyStats[]>([]);
  const [days, setDays] = React.useState(7);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showDetails, setShowDetails] = React.useState(false);

  React.useEffect(() => {
    loadHistory();
  }, [days]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/stats/history?days=${days}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || []);
      }
    } catch (error) {
      console.error('[HISTORY] Error loading:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAverage = (key: keyof DailyStats) => {
    const activeDays = stats.filter(s => s.caloriesConsumed > 0 || s.exerciseCount > 0);
    if (activeDays.length === 0) return 0;
    const sum = activeDays.reduce((acc, stat) => acc + (stat[key] as number), 0);
    return Math.round(sum / activeDays.length);
  };

  const getTrend = (key: keyof DailyStats) => {
    const active = stats.filter(s => s.caloriesConsumed > 0 || s.exerciseCount > 0);
    if (active.length < 2) return 'stable' as const;
    const recent = active.slice(-3);
    const older = active.slice(0, -3);
    if (older.length === 0) return 'stable' as const;
    const recentAvg = recent.reduce((a, s) => a + (s[key] as number), 0) / recent.length;
    const olderAvg = older.reduce((a, s) => a + (s[key] as number), 0) / older.length;
    if (recentAvg > olderAvg * 1.1) return 'up' as const;
    if (recentAvg < olderAvg * 0.9) return 'down' as const;
    return 'stable' as const;
  };

  const TrendIcon = ({ type, label }: { type: 'up' | 'down' | 'stable', label: string }) => {
    if (type === 'up') return <span className="flex items-center gap-1 text-orange-500 text-xs font-bold"><TrendingUp className="h-3 w-3" />{label}</span>;
    if (type === 'down') return <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold"><TrendingDown className="h-3 w-3" />{label}</span>;
    return <span className="flex items-center gap-1 text-slate-400 text-xs font-bold"><Minus className="h-3 w-3" />{label}</span>;
  };

  const chartData = stats
    .filter(s => s.caloriesConsumed > 0 || s.caloriesBurned > 0)
    .map(s => ({
      ...s,
      day: new Date(s.date).toLocaleDateString('es', { weekday: 'short', day: 'numeric' }),
    }));

  const calorieGoal = user?.calorieGoal || 2000;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
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
            <h1 className="text-5xl font-heading font-extrabold tracking-tighter text-slate-900">Historial</h1>
            <p className="text-lg text-slate-500 font-medium">Tu progreso y tendencias</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            {DAY_OPTIONS.map(opt => (
              <Button
                key={opt.value}
                variant={days === opt.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDays(opt.value)}
                className={`text-xs font-bold ${days === opt.value ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardDescription className="text-xs font-bold text-slate-500 uppercase">Calorías</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-heading font-extrabold text-slate-900">{getAverage('caloriesConsumed')}</div>
              <div className="mt-2">
                <TrendIcon type={getTrend('caloriesConsumed')} label="promedio" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardDescription className="text-xs font-bold text-slate-500 uppercase">Proteína</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-heading font-extrabold text-slate-900">{getAverage('protein')}g</div>
              <div className="mt-2">
                <TrendIcon type={getTrend('protein')} label="promedio" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardDescription className="text-xs font-bold text-slate-500 uppercase">Carbs</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-heading font-extrabold text-slate-900">{getAverage('carbs')}g</div>
              <div className="mt-2">
                <TrendIcon type={getTrend('carbs')} label="promedio" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardDescription className="text-xs font-bold text-slate-500 uppercase">Grasas</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-heading font-extrabold text-slate-900">{getAverage('fat')}g</div>
              <div className="mt-2">
                <TrendIcon type={getTrend('fat')} label="promedio" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 col-span-2 md:col-span-1">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardDescription className="text-xs font-bold text-slate-500 uppercase">Agua</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-heading font-extrabold text-slate-900">{getAverage('waterMl')}ml</div>
              <div className="mt-2">
                <TrendIcon type={getTrend('waterMl')} label="promedio" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calorie Chart */}
        <Card className="card-nutriflow shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Balance Calórico
            </CardTitle>
            <CardDescription>
              Consumidas vs quemadas • Meta: {calorieGoal} kcal/día
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <BarChart3 className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Sin datos aún</p>
                <p className="text-xs mt-1">Registra comidas y ejercicios para ver tu progreso</p>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      labelStyle={{ fontWeight: 700 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Bar name="Consumidas" dataKey="caloriesConsumed" fill="#f97316" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    <Bar name="Quemadas" dataKey="caloriesBurned" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Water + Exercise Mini Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-nutriflow shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                Hidratación
              </CardTitle>
              <CardDescription>Agua diaria (ml)</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.filter(d => d.waterMl > 0).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">Sin registros de agua</div>
              ) : (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.filter(d => d.waterMl > 0)}>
                      <defs>
                        <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                      <Area type="monotone" dataKey="waterMl" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-nutriflow shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-purple-500" />
                Ejercicios
              </CardTitle>
              <CardDescription>Sesiones por día</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.filter(d => d.exerciseCount > 0).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">Sin registros de ejercicio</div>
              ) : (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.filter(d => d.exerciseCount > 0)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                      <Bar name="Sesiones" dataKey="exerciseCount" fill="#a855f7" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Daily Breakdown Table */}
        <Card className="card-nutriflow shadow-lg border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-600" />
                Desglose Diario
              </CardTitle>
              <CardDescription>Detalle de cada día registrado</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)} className="gap-1">
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showDetails ? 'Ocultar' : 'Ver detalle'}
            </Button>
          </CardHeader>
          <CardContent>
            {showDetails && stats.filter(s => s.caloriesConsumed > 0 || s.exerciseCount > 0).length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">Sin datos en este período</div>
            ) : showDetails ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-3 font-bold text-slate-500 text-xs uppercase tracking-wider">Fecha</th>
                      <th className="text-right py-3 px-3 font-bold text-slate-500 text-xs uppercase tracking-wider">Calorías</th>
                      <th className="text-right py-3 px-3 font-bold text-slate-500 text-xs uppercase tracking-wider">Proteína</th>
                      <th className="text-right py-3 px-3 font-bold text-slate-500 text-xs uppercase tracking-wider">Carbs</th>
                      <th className="text-right py-3 px-3 font-bold text-slate-500 text-xs uppercase tracking-wider">Grasas</th>
                      <th className="text-right py-3 px-3 font-bold text-slate-500 text-xs uppercase tracking-wider">Agua</th>
                      <th className="text-right py-3 px-3 font-bold text-slate-500 text-xs uppercase tracking-wider">Ejercicios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.filter(s => s.caloriesConsumed > 0 || s.exerciseCount > 0).map((day, index) => (
                      <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-700">
                          {new Date(day.date).toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </td>
                        <td className="text-right py-3 px-3">
                          <span className={`font-bold ${day.caloriesConsumed > calorieGoal ? 'text-orange-500' : 'text-slate-900'}`}>
                            {day.caloriesConsumed}
                          </span>
                        </td>
                        <td className="text-right py-3 px-3 text-slate-600">{day.protein}g</td>
                        <td className="text-right py-3 px-3 text-slate-600">{day.carbs}g</td>
                        <td className="text-right py-3 px-3 text-slate-600">{day.fat}g</td>
                        <td className="text-right py-3 px-3">
                          <span className="text-blue-600 font-medium">{day.waterMl}ml</span>
                        </td>
                        <td className="text-right py-3 px-3">
                          {day.exerciseCount > 0 ? (
                            <div className="flex flex-col items-end gap-1">
                              <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-[10px]">
                                {day.exerciseCount} sesión{day.exerciseCount > 1 ? 'es' : ''}
                              </Badge>
                              {day.exerciseNames && (
                                <span className="text-[9px] text-slate-400 max-w-[150px] truncate" title={day.exerciseNames}>
                                  {day.exerciseNames}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-sm">
                Haz clic en "Ver detalle" para ver el desglose diario
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
