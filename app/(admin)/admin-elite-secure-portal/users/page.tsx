'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Shield, User, Crown, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminUsers() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const updateUser = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white">User Management</h2>
          <p className="text-slate-400 font-medium">Control accounts, roles, and subscriptions.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..." 
            className="pl-11 rounded-2xl bg-slate-900 border-slate-800 w-full md:w-80 h-12" 
          />
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-widest font-black text-slate-500">
                <tr>
                  <th className="px-6 py-5">User</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Plan</th>
                  <th className="px-6 py-5">Joined</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.role || 'user'}
                        onChange={(e) => updateUser(user.id, { role: e.target.value })}
                        className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border appearance-none cursor-pointer outline-none ${
                          user.role === 'admin' 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                            : 'bg-slate-800/50 text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="user">USER</option>
                        <option value="admin">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.subscription_plan || 'free'}
                        onChange={(e) => updateUser(user.id, { subscription_plan: e.target.value })}
                        className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border appearance-none cursor-pointer outline-none ${
                          user.subscription_plan === 'pro' || user.subscription_plan === 'premium'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-slate-800/50 text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="free">FREE</option>
                        <option value="premium">PREMIUM</option>
                        <option value="pro">PRO</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Placeholders for future actions like ban/delete */}
                      <span className="text-slate-600 text-xs italic">Auto-saved</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                No users found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
