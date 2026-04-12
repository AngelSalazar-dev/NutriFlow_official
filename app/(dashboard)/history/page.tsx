'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3, TrendingUp, TrendingDown, Minus,
  Flame, Droplets, Dumbbell, Calendar, Download,
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

export default function HistoryPage() {
  const { user } = useAuth();
  const { tr, lang } = useLang();
  const [stats, setStats] = React.useState<DailyStats[]>([]);
  const [days, setDays] = React.useState(7);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showDetails, setShowDetails] = React.useState(false);

  const DAY_OPTIONS = [
    { value: 7, label: `7 ${tr('common_days') || (lang === 'en' ? 'days' : 'días')}` },
    { value: 14, label: `14 ${tr('common_days') || (lang === 'en' ? 'days' : 'días')}` },
    { value: 30, label: `30 ${tr('common_days') || (lang === 'en' ? 'days' : 'días')}` },
  ];

  React.useEffect(() => {
    loadHistory();
  }, [days]);

  const exportToCSV = () => {
    const activeStats = stats.filter(s => s.caloriesConsumed > 0 || s.exerciseCount > 0);
    if (activeStats.length === 0) return;

    const headers = [tr('common_date') || 'Date', tr('food_kcal') || 'Calories', tr('food_nutrient_density') || 'Protein', 'Carbs', tr('dash_fat') || 'Fat', tr('dash_water') || 'Water', tr('nav_exercise') || 'Exercises'];
    const rows = activeStats.map(s => [
      new Date(s.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      s.caloriesConsumed,
      s.protein,
      s.carbs,
      s.fat,
      s.waterMl,
      s.exerciseCount,
      s.exerciseNames || '',
    ]);

    let csv = '\uFEFF'; // BOM for Excel UTF-8
    csv += headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nutriflow-historial-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
    if (type === 'up') return <span className="flex items-center gap-1.5 text-orange-500 dark:text-orange-400 text-[10px] font-black uppercase tracking-tighter"><TrendingUp className="h-3 w-3" />{label}</span>;
    if (type === 'down') return <span className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 text-[10px] font-black uppercase tracking-tighter"><TrendingDown className="h-3 w-3" />{label}</span>;
    return <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-tighter"><Minus className="h-3 w-3" />{label}</span>;
  };

  const chartData = stats
    .filter(s => s.caloriesConsumed > 0 || s.caloriesBurned > 0)
    .map(s => ({
      ...s,
      day: new Date(s.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { weekday: 'short', day: 'numeric' }),
    }));

  const calorieGoal = user?.calorieGoal || 2000;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 dark:text-emerald-500" />
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tighter text-slate-900 dark:text-slate-100">{tr('nav_history')}</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{tr('profile_activity')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="gap-2 text-xs font-bold border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-300 dark:text-slate-300"
              disabled={stats.filter(s => s.caloriesConsumed > 0 || s.exerciseCount > 0).length === 0}
            >
              <Download className="h-3.5 w-3.5" />
              {tr('dash_no_weekly_data')} CSV
            </Button>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
              {DAY_OPTIONS.map(opt => (
                <Button
                  key={opt.value}
                  variant={days === opt.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDays(opt.value)}
                  className={`text-xs font-bold ${days === opt.value ? 'bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-600' : 'dark:text-slate-400'}`}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardDescription className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{tr('food_kcal')}</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{getAverage('caloriesConsumed')}</div>
              <div className="mt-1">
                <TrendIcon type={getTrend('caloriesConsumed')} label={tr('dash_avg') || 'PROMEDIO'} />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardDescription className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{tr('food_nutrient_density')}</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{getAverage('protein')}g</div>
              <div className="mt-1">
                <TrendIcon type={getTrend('protein')} label={tr('dash_avg') || 'PROMEDIO'} />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardDescription className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{tr('dash_carbs')}</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{getAverage('carbs')}g</div>
              <div className="mt-1">
                <TrendIcon type={getTrend('carbs')} label={tr('dash_avg') || 'PROMEDIO'} />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardDescription className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{tr('dash_fat')}</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{getAverage('fat')}g</div>
              <div className="mt-1">
                <TrendIcon type={getTrend('fat')} label={tr('dash_avg') || 'PROMEDIO'} />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm col-span-2 md:col-span-1">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardDescription className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{tr('dash_water')}</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">{getAverage('waterMl')}ml</div>
              <div className="mt-1">
                <TrendIcon type={getTrend('waterMl')} label={tr('dash_avg') || 'PROMEDIO'} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calorie Chart */}
        <Card className="card-nutriflow shadow-lg border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-slate-100">
              <Flame className="h-5 w-5 text-orange-500" />
              {tr('dash_no_weekly_data')}
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              {tr('landing_hero_subtitle')} • {tr('common_confirm')}: {calorieGoal} kcal/{tr('common_back')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                <BarChart3 className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">{tr('dash_no_weekly_data')}</p>
                <p className="text-xs mt-1">{tr('landing_start_button')}</p>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={lang === 'en' ? '#334155' : '#e2e8f0'} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                      labelStyle={{ fontWeight: 700, color: '#f1f5f9' }}
                      itemStyle={{ fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Bar name={tr('food_nutrient_density')} dataKey="caloriesConsumed" fill="#f97316" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    <Bar name={tr('ex_add_success')} dataKey="caloriesBurned" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Water + Exercise Mini Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-nutriflow shadow-lg border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                <Droplets className="h-5 w-5 text-blue-500" />
                {tr('common_confirm')}
              </CardTitle>
              <CardDescription className="dark:text-slate-400">{tr('dash_no_weekly_data')} (ml)</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.filter(d => d.waterMl > 0).length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-sm">{tr('dash_no_weekly_data')}</div>
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
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={lang === 'en' ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: 12, border: 'none', color: '#f1f5f9' }} />
                      <Area type="monotone" dataKey="waterMl" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-nutriflow shadow-lg border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                <Dumbbell className="h-5 w-5 text-purple-500" />
                {tr('nav_exercise')}
              </CardTitle>
              <CardDescription className="dark:text-slate-400">{tr('comming_soon')}</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.filter(d => d.exerciseCount > 0).length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-sm">{tr('dash_no_weekly_data')}</div>
              ) : (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.filter(d => d.exerciseCount > 0)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={lang === 'en' ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: 12, border: 'none', color: '#f1f5f9' }} />
                      <Bar name={tr('ex_add_success')} dataKey="exerciseCount" fill="#a855f7" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Daily Breakdown Table */}
        <Card className="card-nutriflow shadow-lg border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                {tr('comming_soon')}
              </CardTitle>
              <CardDescription className="dark:text-slate-400">{tr('landing_hero_subtitle')}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)} className="gap-1 dark:text-slate-300 dark:border-slate-700">
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showDetails ? tr('common_back') : tr('comming_soon')}
            </Button>
          </CardHeader>
          <CardContent>
            {showDetails && stats.filter(s => s.caloriesConsumed > 0 || s.exerciseCount > 0).length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-sm">{tr('dash_no_weekly_data')}</div>
            ) : showDetails ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <th className="text-left py-4 px-4 font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">{tr('common_date') || 'Fecha'}</th>
                      <th className="text-right py-4 px-4 font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">{tr('food_kcal') || 'Calorías'}</th>
                      <th className="text-right py-4 px-4 font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">{tr('food_nutrient_density') || 'Proteína'}</th>
                      <th className="text-right py-4 px-4 font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">{tr('dash_carbs') || 'Carbs'}</th>
                      <th className="text-right py-4 px-4 font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">{tr('dash_fat') || 'Grasas'}</th>
                      <th className="text-right py-4 px-4 font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">{tr('dash_water') || 'Agua'}</th>
                      <th className="text-right py-4 px-4 font-black text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">{tr('nav_exercise') || 'Ejercicios'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.filter(s => s.caloriesConsumed > 0 || s.exerciseCount > 0).map((day, index) => (
                      <tr key={index} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                          {new Date(day.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </td>
                        <td className="text-right py-3 px-3">
                          <span className={`font-bold ${day.caloriesConsumed > calorieGoal ? 'text-orange-500' : 'text-slate-900 dark:text-slate-100'}`}>
                            {day.caloriesConsumed}
                          </span>
                        </td>
                        <td className="text-right py-3 px-3 text-slate-600 dark:text-slate-400">{day.protein}g</td>
                        <td className="text-right py-3 px-3 text-slate-600 dark:text-slate-400">{day.carbs}g</td>
                        <td className="text-right py-3 px-3 text-slate-600 dark:text-slate-400">{day.fat}g</td>
                        <td className="text-right py-3 px-3">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">{day.waterMl}ml</span>
                        </td>
                        <td className="text-right py-3 px-3">
                          {day.exerciseCount > 0 ? (
                            <div className="flex flex-col items-end gap-1">
                              <Badge variant="secondary" className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px]">
                                {day.exerciseCount} {tr('nav_exercise')}
                              </Badge>
                              {day.exerciseNames && (
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 max-w-[150px] truncate" title={day.exerciseNames}>
                                  {day.exerciseNames}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 dark:text-slate-600 text-sm">
                {tr('landing_hero_subtitle')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
