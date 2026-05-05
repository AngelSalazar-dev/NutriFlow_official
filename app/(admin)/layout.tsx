import Link from 'next/link';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  try {
    const [rows]: any = await query('SELECT role FROM users WHERE id = ?', [user._id]);
    const dbUser = Array.isArray(rows) ? rows[0] : rows;
    
    if (!dbUser || dbUser.role !== 'admin') {
      console.warn('[ADMIN_AUTH] Unauthorized access attempt by:', user.email);
      redirect('/dashboard');
    }
  } catch (error) {
    console.error('[ADMIN_AUTH] DB Error:', error);
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b,transparent)] pointer-events-none" />
      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl p-6 hidden md:flex flex-col">
          <div className="mb-10">
            <h1 className="text-xl font-black tracking-tighter text-indigo-400">NUTRIFLOW<span className="text-white">ADMIN</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Elite Portal v2.0</p>
          </div>
          
          <nav className="flex-1 space-y-2">
            <AdminNavLink href="/admin-elite-secure-portal" icon="📊">Dashboard</AdminNavLink>
            <AdminNavLink href="/admin-elite-secure-portal/users" icon="👥">Users</AdminNavLink>
            <AdminNavLink href="/admin-elite-secure-portal/payments" icon="💰">Payments</AdminNavLink>
            <AdminNavLink href="/admin-elite-secure-portal/tickets" icon="🎫">Support Tickets</AdminNavLink>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">A</div>
              <div>
                <p className="text-xs font-bold text-white">Administrator</p>
                <p className="text-[10px] text-indigo-400 font-medium">Founder Mode</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminNavLink({ href, icon, children }: { href: string; icon: string; children: ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all group">
      <span className="text-lg group-hover:scale-125 transition-transform">{icon}</span>
      {children}
    </Link>
  );
}
