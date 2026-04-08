'use client';

import * as React from 'react';
import ReactDOM from 'react-dom';
import { Bell, CheckCheck, Trash2, Bot, Info } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const { info } = useToast();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 60 seconds
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);

        // If there's a new daily tip, show a toast
        if (data.newTip) {
          info(data.newTip.title, data.newTip.message);
        }
      }
    } catch (error) {
      // Silently fail
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) { /* ignore */ }
  };

  const clearAll = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'DELETE',
        credentials: 'include',
      });
      setNotifications([]);
      setUnreadCount(0);
      setIsOpen(false);
    } catch (error) { /* ignore */ }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Ahora';
    if (mins < 60) return `Hace ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) loadNotifications(); }}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'text-purple-600' : 'text-slate-500'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && ReactDOM.createPortal(
        <div className="fixed left-[296px] top-16 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[9999] overflow-hidden" style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-bold text-slate-800">Notificaciones</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} nueva{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex gap-1">
              {notifications.length > 1 && (
                <button onClick={markAllRead} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="Marcar todo como leído">
                  <CheckCheck className="h-4 w-4 text-slate-400" />
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Limpiar todo">
                  <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications list */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Bell className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-xs font-medium">Sin notificaciones</p>
                <p className="text-[10px] text-slate-300 mt-0.5">NutriBot te enviará tips diarios</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="px-4 py-3 border-b border-slate-50 hover:bg-purple-50/30 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-800 truncate">{notif.title}</p>
                        <span className="text-[9px] text-slate-400 flex-shrink-0">{timeAgo(notif.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <Info className="h-3 w-3" />
              NutriBot te envía un tip diario sobre nutrición y salud
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
