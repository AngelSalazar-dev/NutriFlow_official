'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Mail, Tag, ChevronDown, CheckCircle, Clock, XCircle, Search, Filter, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminTickets() {
  const [tickets, setTickets] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/support/tickets');
      const data = await res.json();
      if (data.tickets) setTickets(data.tickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = (t.subject || '').toLowerCase().includes(search.toLowerCase()) || 
                          (t.user_email || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Elite Support Center</h2>
          <p className="text-slate-400 font-medium">Manage and resolve user issues.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject or email..." 
              className="pl-11 rounded-2xl bg-slate-900 border-slate-800 w-64 h-12" 
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-2xl bg-slate-900 border-slate-800 text-slate-300 text-sm h-12 px-4 focus:ring-2 ring-indigo-500 outline-none"
          >
            <option value="all">All Tickets</option>
            <option value="open">Open Only</option>
            <option value="closed">Closed Only</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTickets.map((t) => (
              <TicketCard key={t.id} ticket={t} onUpdate={fetchTickets} />
            ))}
          </AnimatePresence>
          {filteredTickets.length === 0 && (
            <div className="p-20 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-800">
              <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-6 text-3xl">📭</div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No tickets found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TicketCard({ ticket, onUpdate }: { ticket: any, onUpdate: () => void }) {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        onUpdate();
      } else {
        console.error('Failed to update ticket');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 group hover:border-slate-700 transition-all"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
               ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
             }`}>
               {ticket.status}
             </div>
             <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
               <Clock className="h-3 w-3" />
               {new Date(ticket.created_at).toLocaleString()}
             </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-2">{ticket.subject}</h3>
            <p className="text-slate-400 leading-relaxed bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">{ticket.message}</p>
          </div>

          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">User</p>
                <p className="text-sm font-bold text-slate-200">{ticket.user_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</p>
                <p className="text-sm font-bold text-slate-200">{ticket.user_email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-64 flex flex-col gap-3 justify-center">
           <a href={`mailto:${ticket.user_email}?subject=Re: ${ticket.subject}&body=Hola ${ticket.user_name},%0D%0A%0D%0AEn respuesta a tu mensaje:%0D%0A> ${ticket.message}%0D%0A%0D%0A`} className="w-full">
             <Button className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px]">
               Reply via Email <ArrowRight className="ml-2 h-3 w-3" />
             </Button>
           </a>
           {ticket.status !== 'closed' && (
             <Button 
               variant="outline" 
               className="h-14 rounded-2xl border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-black uppercase tracking-widest text-[10px]"
               onClick={() => updateStatus('closed')}
               disabled={isUpdating}
             >
               {isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : 'Close Ticket'}
             </Button>
           )}
           {ticket.status === 'closed' && (
             <Button 
               variant="outline" 
               className="h-14 rounded-2xl border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-black uppercase tracking-widest text-[10px]"
               onClick={() => updateStatus('open')}
               disabled={isUpdating}
             >
               {isUpdating ? <Loader2 className="animate-spin h-4 w-4" /> : 'Reopen Ticket'}
             </Button>
           )}
        </div>
      </div>
    </motion.div>
  );
}
