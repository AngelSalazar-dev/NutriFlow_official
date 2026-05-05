'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, CreditCard, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPayments() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-black tracking-tighter text-white">Financial Hub</h2>
        <p className="text-slate-400 font-medium">Revenue, subscriptions, and payouts.</p>
      </header>

      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-6 rounded-[2rem] flex items-center gap-4">
        <div className="p-3 bg-amber-500/20 rounded-xl">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold">Module Under Construction</h3>
          <p className="text-sm opacity-80">Full Stripe/PayPal transaction history is being integrated into the backend. Currently showing estimated projections based on active subscriptions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Monthly Recurring Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">$0.00</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Estimated from active Pro/Premium</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800 rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">0</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">+0% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">0%</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Free to Paid users</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 mt-8">
        <h3 className="text-xl font-bold mb-6 text-white">Recent Transactions</h3>
        <div className="p-10 text-center text-slate-500 border border-dashed border-slate-800 rounded-[2rem]">
          <DollarSign className="h-10 w-10 mx-auto mb-4 opacity-20" />
          <p className="font-bold tracking-widest uppercase text-xs">No transactions recorded yet</p>
        </div>
      </div>
    </div>
  );
}
