'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Flame, Droplets, Utensils, Dumbbell, Activity, TrendingUp, Zap, ChevronRight, Crown } from 'lucide-react';
import dynamic from 'next/dynamic';

const MotionDiv = dynamic(() => import('@/components/ui/Motion').then(mod => ({ default: mod.MotionDiv })), { ssr: false });
const MotionButton = dynamic(() => import('@/components/ui/Motion').then(mod => ({ default: mod.MotionButton })), { ssr: false });
const WeeklyChart = dynamic(() => import('@/components/features/WeeklyChart'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
});

interface TodayStats {
  caloriesConsumed: number;
  caloriesBurned: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
}

interface MacroData {
  current: number;
  target: number;
  label: string;
}

interface DashboardData {
  stats: TodayStats | null;
  mealCount: number;
  exerciseSessions: number;
  macros: {
    protein: MacroData;
    carbs: MacroData;
    fat: MacroData;
  };
  weeklyChart: { name: string; consumed: number; burned: number }[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
} as const;

function DashboardSkeleton() {
  return (
          <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-12 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-6 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 h-40" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 h-40" />
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-96" />
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-96" />
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-28" />
          ))}
        </div>
      </div>
  );
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { tr, lang } = useLang();
  const router = useRouter();
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
  const [isStatsLoading, setIsStatsLoading] = React.useState(true);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Refresh dashboard when user navigates back (visibility change)
  React.useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible') {
        setRefreshKey(k => k + 1);
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  React.useEffect(() => {
    if (!user) return;

    async function loadDashboardData() {
      setIsStatsLoading(true);
      try {
        const [statsRes, foodRes, hydrationRes, exerciseRes, weeklyRes] = await Promise.all([
          fetch('/api/stats/today', { credentials: 'include' }),
          fetch('/api/food/today', { credentials: 'include' }),
          fetch('/api/hydration/today', { credentials: 'include' }),
          fetch('/api/exercise/log', { credentials: 'include' }),
          fetch('/api/stats/weekly', { credentials: 'include' }),
        ]);

        const statsOk = statsRes.ok;
        const foodOk = foodRes.ok;
        const hydrationOk = hydrationRes.ok;
        const exerciseOk = exerciseRes.ok;
        const weeklyOk = weeklyRes.ok;

        const stats = statsOk ? await statsRes.json() : null;
        const foodData = foodOk ? await foodRes.json() : null;
        const hydrationData = hydrationOk ? await hydrationRes.json() : null;
        const exerciseData = exerciseOk ? await exerciseRes.json() : null;
        const weeklyData = weeklyOk ? await weeklyRes.json() : null;

        const todayStats = stats?.stats || null;
        const mealCount = foodData?.count || 0;
        const exerciseSessions = exerciseData?.logs?.length || 0;

        // Calculate macro targets from user profile
        const calorieGoal = user?.calorieGoal || 2000;
        const macroTargets = {
          protein: { current: todayStats?.protein || 0, target: Math.round((calorieGoal * 0.3) / 4), label: tr('dash_protein') },
          carbs: { current: todayStats?.carbs || 0, target: Math.round((calorieGoal * 0.45) / 4), label: tr('dash_carbs') },
          fat: { current: todayStats?.fat || 0, target: Math.round((calorieGoal * 0.25) / 9), label: tr('dash_fat') },
        };

        setDashboardData({
          stats: todayStats,
          mealCount,
          exerciseSessions,
          macros: macroTargets,
          weeklyChart: weeklyData?.weekly || [],
        });
      } catch (err) {
        console.error('[DASHBOARD] Error loading dashboard data:', err);
        setDashboardData({
          stats: null,
          mealCount: 0,
          exerciseSessions: 0,
          macros: {
            protein: { current: 0, target: 0, label: tr('dash_protein') },
            carbs: { current: 0, target: 0, label: tr('dash_carbs') },
            fat: { current: 0, target: 0, label: tr('dash_fat') },
          },
          weeklyChart: [],
        });
      } finally {
        setIsStatsLoading(false);
      }
    }

    loadDashboardData();
  }, [user, refreshKey]);

  if (isLoading || !user) {
    return <DashboardSkeleton />;
  }

  const calorieGoal = user.calorieGoal || 2000;
  const caloriesConsumed = dashboardData?.stats?.caloriesConsumed || 0;
  const caloriesBurned = dashboardData?.stats?.caloriesBurned || 0;
  const waterMl = dashboardData?.stats?.waterMl || 0;
  const mealCount = dashboardData?.mealCount || 0;
  const exerciseSessions = dashboardData?.exerciseSessions || 0;
  const macros = dashboardData?.macros || {
    protein: { current: 0, target: 0, label: tr('dash_protein') },
    carbs: { current: 0, target: 0, label: tr('dash_carbs') },
    fat: { current: 0, target: 0, label: tr('dash_fat') },
  };
  const weeklyChart = dashboardData?.weeklyChart || [];

  const calorieProgress = calorieGoal > 0 ? Math.min(Math.round((caloriesConsumed / calorieGoal) * 100), 100) : 0;
  const waterProgress = Math.min(Math.round((waterMl / 2500) * 100), 100);
  const mealProgress = Math.min(Math.round((mealCount / 4) * 100), 100);
  const exerciseProgress = exerciseSessions > 0 ? 100 : 0;

  const handleRefresh = () => setRefreshKey(k => k + 1);

  return (
          <MotionDiv
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* High-Impact Premium Header */}
        <MotionDiv variants={itemVariants} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-[0.8] animate-in slide-in-from-left duration-700">
                {tr('dash_greet')},<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500">
                  {user?.name ? user.name.split(' ')[0] : tr('common_user') || 'User'}
                </span> 👋
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium tracking-tight opacity-80">
                {tr('dash_progress_msg')}
              </p>
            </div>
            
            <MotionButton
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              onClick={handleRefresh}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all"
              title={tr('dash_update_data')}
            >
              <svg className={`h-6 w-6 text-slate-600 dark:text-slate-400 ${isStatsLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </MotionButton>
          </div>
        </MotionDiv>

        {/* Dynamic Status Banner (Juicy) */}
        <MotionDiv variants={itemVariants} className="relative overflow-hidden rounded-[3rem] border border-emerald-500/20 bg-slate-950 p-10 shadow-2xl group">
           {/* Background animated gradients */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/20 to-transparent skew-x-12 transform translate-x-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 blur-[80px] rounded-full" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                  <Activity className="h-4 w-4" /> {tr('dash_activity_level')}: {
                    user.activityLevel === 'sedentary' ? (lang === 'en' ? 'Sedentary' : 'Sedentario') :
                    user.activityLevel === 'light' ? (lang === 'en' ? 'Light' : 'Ligero') :
                    user.activityLevel === 'moderate' ? (lang === 'en' ? 'Moderate' : 'Moderado') :
                    user.activityLevel === 'active' ? (lang === 'en' ? 'Active' : 'Activo') :
                    user.activityLevel === 'very_active' ? (lang === 'en' ? 'Very Active' : 'Muy Activo') :
                    (lang === 'en' ? 'Unknown' : 'Desconocido')
                  }
                </div>
                {user.subscriptionPlan !== 'free' && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-widest border border-amber-500/20">
                    <Crown className="h-4 w-4" /> ELITE MEMBER
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  {user.subscriptionPlan === 'free' ? (
                    <span className="opacity-90">{tr('sub_title')} {tr('sub_plan_free_name')}</span>
                  ) : (
                    <span className="flex items-center gap-4">
                      {lang === 'en' ? 'Welcome to' : 'Bienvenido a'} {
                        user.subscriptionPlan === 'pro' ? tr('sub_plan_pro_name') :
                        user.subscriptionPlan === 'premium' ? tr('sub_plan_premium_name') :
                        tr('sub_plan_free_name')
                      }
                      <MotionDiv
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ✨
                      </MotionDiv>
                    </span>
                  )}
                </h2>
                <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
                  Your daily goal is <strong className="text-emerald-400 text-2xl font-black">{calorieGoal}</strong> kcal. 
                  Currently at <strong className="text-white text-2xl font-black">{caloriesConsumed}</strong> kcal.
                </p>
              </div>
            </div>
            
            {/* Massive Zap Icon */}
            <div className="hidden lg:block opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700">
               <Zap className="h-40 w-40 text-emerald-500 drop-shadow-[0_0_50px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </MotionDiv>

        {/* Stats Cards (4 grid) */}
        <MotionDiv variants={itemVariants} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Flame className="h-6 w-6 text-orange-500 drop-shadow-sm" />}
            title={tr('dash_calories')}
            value={caloriesConsumed.toLocaleString()}
            subtitle={`${tr('common_next')} ${calorieGoal.toLocaleString()} kcal`}
            progress={calorieProgress}
            color="orange"
          />
          <StatCard
            icon={<Droplets className="h-6 w-6 text-blue-500 drop-shadow-sm" />}
            title={tr('dash_water')}
            value={`${(waterMl / 1000).toFixed(1)}L`}
            subtitle={`${tr('common_confirm')}: 2.5L`}
            progress={waterProgress}
            color="blue"
          />
          <StatCard
            icon={<Utensils className="h-6 w-6 text-emerald-500 drop-shadow-sm" />}
            title={tr('nav_food')}
            value={String(mealCount)}
            subtitle={tr('food_log')}
            progress={mealProgress}
            color="emerald"
          />
          <StatCard
            icon={<Dumbbell className="h-6 w-6 text-purple-500 drop-shadow-sm" />}
            title={tr('nav_exercise')}
            value={caloriesBurned > 0 ? caloriesBurned.toLocaleString() : String(exerciseSessions)}
            subtitle={caloriesBurned > 0 ? `kcal ${tr('ex_calories_burned')}` : tr('ex_log')}
            progress={exerciseProgress}
            color="purple"
          />
        </MotionDiv>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Gráfico Recharts */}
          <MotionDiv variants={itemVariants} className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  {tr('dash_weekly')}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{tr('dash_weekly_subtitle')}</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              {weeklyChart.length > 0 && weeklyChart.some(d => d.consumed > 0 || d.burned > 0) ? (
                <WeeklyChart data={weeklyChart} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-600">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">{tr('dash_no_weekly_data')}</p>
                    <p className="text-xs mt-1">{tr('dash_no_weekly_data_desc')}</p>
                  </div>
                </div>
              )}
            </div>
          </MotionDiv>

          {/* Macros Rings */}
          <MotionDiv variants={itemVariants} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {tr('dash_macros')}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">{tr('dash_macros_subtitle')}</p>
            
            <div className="flex-1 space-y-6 flex flex-col justify-center">
              {Object.entries(macros).map(([key, data]) => {
                const current = Math.round(data.current * 10) / 10;
                const target = Math.round(data.target);
                const percentage = data.target > 0 ? Math.min(100, Math.round((data.current / data.target) * 100)) : 0;
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{data.label}</span>
                      <span className="text-slate-500 dark:text-slate-400"><strong className="text-slate-900 dark:text-slate-100">{current}g</strong> / {target}g</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <MotionDiv
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          key === 'protein' ? 'bg-rose-500' : key === 'carbs' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.values(macros).every(m => m.target === 0) && (
                <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-600 text-sm">
                  {tr('dash_no_macro_data')}
                </div>
              )}
            </div>
            
            <button
              onClick={() => router.push('/food-log')} 
              className="mt-8 w-full group flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300"
            >
              {tr('dash_register_food')} <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </MotionDiv>
        </div>

        {/* Quick Actions Animadas */}
        <MotionDiv variants={itemVariants} className="grid md:grid-cols-3 gap-5">
          <ActionButton
            title={tr('dash_action_dietary')}
            description={tr('dash_action_dietary_desc')}
            icon="🍽️"
            href="/food-log"
            color="emerald"
          />
          <ActionButton
            title={tr('dash_action_exercise')}
            description={tr('dash_action_exercise_desc')}
            icon="🏋️"
            href="/exercise"
            color="purple"
          />
          <ActionButton
            title={tr('dash_action_analytics')}
            description={tr('dash_action_analytics_desc')}
            icon="📊"
            href="/history"
            color="blue"
          />
        </MotionDiv>

      </MotionDiv>
  );
}

function StatCard({ icon, title, value, subtitle, progress, color }: any) {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
  };
  
  const bgMap: Record<string, string> = {
    orange: 'bg-orange-50 dark:bg-orange-950/20',
    blue: 'bg-blue-50 dark:bg-blue-950/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/20',
    purple: 'bg-purple-50 dark:bg-purple-950/20',
  };
  
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-20 transition-opacity duration-500 scale-[2]">
        {icon}
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">{title}</div>
        <div className={`p-4 rounded-2xl ${bgMap[color]} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="text-6xl font-heading font-black tracking-tighter text-slate-900 dark:text-slate-100 mb-2 leading-none">{value}</div>
      <div className="text-xs font-black text-slate-400 dark:text-slate-500 mb-8 uppercase tracking-widest">{subtitle}</div>
      
      {/* Mini Progress bar (Juicy) */}
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
         <MotionDiv 
           initial={{ width: 0 }}
           animate={{ width: `${progress}%` }}
           transition={{ duration: 1.5, delay: 0.2, type: "spring" }}
           className={`h-full ${colorMap[color]} rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] relative`}
         >
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20" />
         </MotionDiv>
      </div>
    </div>
  );
}

function ActionButton({ title, description, icon, href, color }: any) {
  const router = useRouter();
  
  const bgGradientMap: Record<string, string> = {
    emerald: 'from-transparent to-emerald-500/5',
    purple: 'from-transparent to-purple-500/5',
    blue: 'from-transparent to-blue-500/5',
  };
  
  return (
    <MotionButton
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-left group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradientMap[color]} opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex items-start gap-4">
        <div className="text-4xl p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform shadow-sm">
          {icon}
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
            {title}
            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pr-4">{description}</div>
        </div>
      </div>
    </MotionButton>
  );
}
