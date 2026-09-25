'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyChartProps {
  data: { name: string; consumed: number; burned: number }[];
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  if (!data || data.length === 0 || !data.some(d => d.consumed > 0 || d.burned > 0)) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
        <Area type="monotone" dataKey="consumed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorConsumidas)" />
        <Area type="monotone" dataKey="burned" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorQuemadas)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
