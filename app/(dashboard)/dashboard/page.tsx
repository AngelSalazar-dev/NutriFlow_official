'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/loading';
import { Flame, Droplets, Utensils, Dumbbell, Activity, TrendingUp, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Datos visuales temporales para el gráfico de progreso calórico
const weeklyData = [
  { name: 'Lun', consumidas: 1800, quemadas: 2100 },
  { name: 'Mar', consumidas: 2200, quemadas: 2400 },
  { name: 'Mie', consumidas: 1950, quemadas: 2000 },
  { name: 'Jue', consumidas: 2100, quemadas: 2300 },
  { name: 'Vie', consumidas: 2400, quemadas: 2800 },
  { name: 'Sab', consumidas: 1700, quemadas: 1900 },
  { name: 'Dom', consumidas: 2000, quemadas: 2200 },
];

// Variantes de animación para framer-motion
const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Preparando tu espacio..." />
        </div>
      </DashboardLayout>
    );
  }

  // Cálculos iniciales
  const calorieGoal = user.calorieGoal || 2000;
  // Valores calculados temporalmente para simular el dashboard vivo
  const macros = {
    protein: { current: 45, target: 120, label: 'Proteínas' },
    carbs: { current: 180, target: 250, label: 'Carbos' },
    fat: { current: 30, target: 65, label: 'Grasas' }
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Animado */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <h1 className="text-5xl font-heading font-extrabold text-slate-900 tracking-tighter">
            Hola, {user?.name ? user.name.split(' ')[0] : 'Usuario'} 👋
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Tu progreso de hoy está luciendo excelente. Sigue así.
          </p>
        </motion.div>

        {/* Info Card Premium (Welcome / Status) */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 p-8 shadow-sm">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-20 pointer-events-none">
            <Zap className="h-64 w-64 text-emerald-500" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-200/50 text-emerald-700 text-sm font-semibold">
                <Activity className="h-4 w-4" /> Actividad Nivel: {user.activityLevel || 'Desconocido'}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-950">
                Plan {String(user.subscriptionPlan).toUpperCase()} Activado
              </h2>
              <p className="text-emerald-800 max-w-md leading-relaxed">
                Tu objetivo diario está fijado en <strong className="font-bold">{calorieGoal} kcal</strong>. 
                Estás en camino a dominar tus metas esta semana.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards (4 grid) */}
        <motion.div variants={itemVariants} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Flame className="h-6 w-6 text-orange-500 drop-shadow-sm" />}
            title="Calorías"
            value="1,240"
            subtitle={`de ${calorieGoal} kcal`}
            progress={62}
            color="orange"
          />
          <StatCard
            icon={<Droplets className="h-6 w-6 text-blue-500 drop-shadow-sm" />}
            title="Hidratación"
            value="1.2L"
            subtitle="objetivo: 2.5L"
            progress={48}
            color="blue"
          />
          <StatCard
            icon={<Utensils className="h-6 w-6 text-emerald-500 drop-shadow-sm" />}
            title="Comidas"
            value="3"
            subtitle="registradas hoy"
            progress={75}
            color="emerald"
          />
          <StatCard
            icon={<Dumbbell className="h-6 w-6 text-purple-500 drop-shadow-sm" />}
            title="Actividad"
            value="450"
            subtitle="kcal quemadas hoy"
            progress={100}
            color="purple"
          />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Gráfico Recharts */}
          <motion.div variants={itemVariants} className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Balance Semanal
                </h3>
                <p className="text-sm text-slate-500 mt-1">Calorías consumidas vs quemadas (estimación)</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConsumidas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorQuemadas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="consumidas" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorConsumidas)" />
                  <Area type="monotone" dataKey="quemadas" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorQuemadas)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Macros Rings */}
          <motion.div variants={itemVariants} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Macronutrientes
            </h3>
            <p className="text-sm text-slate-500 mb-8">Desglose de tu ingesta actual</p>
            
            <div className="flex-1 space-y-6 flex flex-col justify-center">
              {Object.entries(macros).map(([key, data]) => {
                const percentage = Math.min(100, Math.round((data.current / data.target) * 100));
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-semibold text-slate-700">{data.label}</span>
                      <span className="text-slate-500"><strong className="text-slate-900">{data.current}g</strong> / {data.target}g</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
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
            </div>
            
            <button
              onClick={() => router.push('/food-log')} 
              className="mt-8 w-full group flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all font-medium text-slate-600 hover:text-emerald-600"
            >
              Registrar nuevo alimento <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Quick Actions Animadas */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-5">
          <ActionButton
            title="Dietario"
            description="Registra tus próximas comidas y snacks"
            icon="🍽️"
            href="/food-log"
            color="emerald"
          />
          <ActionButton
            title="Entrenamiento"
            description="Añade tu progreso en el gimnasio"
            icon="🏋️"
            href="/exercise"
            color="purple"
          />
          <ActionButton
            title="Analítica Avanzada"
            description="Explora tu historia mes a mes"
            icon="📊"
            href="/history"
            color="blue"
          />
        </motion.div>

      </motion.div>
    </DashboardLayout>
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
    orange: 'bg-orange-50',
    blue: 'bg-blue-50',
    emerald: 'bg-emerald-50',
    purple: 'bg-purple-50',
  };
  
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity duration-300 scale-150">
        {icon}
      </div>
      <div className="flex items-center justify-between mb-4 mt-2">
        <div className="text-slate-500 text-xs font-bold tracking-widest uppercase">{title}</div>
        <div className={`p-2.5 rounded-2xl ${bgMap[color]} shadow-inner group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="text-5xl font-heading font-extrabold tracking-tighter text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-400 mb-6">{subtitle}</div>
      
      {/* Mini Progress bar */}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${progress}%` }}
           transition={{ duration: 1, delay: 0.2 }}
           className={`h-full ${colorMap[color]} rounded-full`}
         />
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
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradientMap[color]} opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex items-start gap-4">
        <div className="text-4xl p-2 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform shadow-sm">
          {icon}
        </div>
        <div>
          <div className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
            {title}
            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="text-sm text-slate-500 leading-relaxed pr-4">{description}</div>
        </div>
      </div>
    </motion.button>
  );
}
