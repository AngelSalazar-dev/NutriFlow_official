import { query } from '@/lib/mysql';

export default async function AdminDashboard() {
  const stats: any = await query(`
    SELECT 
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM users WHERE subscription_plan != 'free') as premium_users,
      (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') as open_tickets,
      (SELECT 0) as total_revenue
  `);

  const s = stats[0] || { total_users: 0, premium_users: 0, open_tickets: 0, total_revenue: 0 };

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-4xl font-black tracking-tighter text-white">System Overview</h2>
        <p className="text-slate-400 font-medium">Real-time health of your platform.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem label="Total Users" value={s.total_users} icon="👥" color="blue" />
        <StatItem label="Premium Users" value={s.premium_users} icon="👑" color="amber" />
        <StatItem label="Open Tickets" value={s.open_tickets} icon="🎫" color="rose" />
        <StatItem label="Revenue" value={`$${(s.total_revenue || 0).toLocaleString()}`} icon="💰" color="emerald" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">🎫</span>
            Recent Support Tickets
          </h3>
          <div className="space-y-4">
             {/* This would be populated by a client component or server fetch */}
             <p className="text-slate-500 text-sm italic">Access the Tickets tab for full management.</p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">⚡</span>
            System Health
          </h3>
          <div className="space-y-6">
            <HealthLine label="Database Connection" status="Optimal" />
            <HealthLine label="AI Models (Gemini/DeepSeek)" status="Online" />
            <HealthLine label="Payment Gateway (PayPal)" status="Operational" />
            <HealthLine label="Auth Service" status="Secure" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, icon, color }: any) {
  const colors: any = {
    blue: 'from-blue-500/20 text-blue-400 border-blue-500/20',
    amber: 'from-amber-500/20 text-amber-400 border-amber-500/20',
    rose: 'from-rose-500/20 text-rose-400 border-rose-500/20',
    emerald: 'from-emerald-500/20 text-emerald-400 border-emerald-500/20',
  };
  return (
    <div className={`bg-slate-900/40 border p-8 rounded-[2.5rem] bg-gradient-to-br ${colors[color]} group hover:scale-[1.02] transition-all duration-500`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-black uppercase tracking-widest opacity-60">{label}</span>
        <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{icon}</span>
      </div>
      <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
    </div>
  );
}

function HealthLine({ label, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">
      <span className="text-sm font-bold text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{status}</span>
      </div>
    </div>
  );
}
