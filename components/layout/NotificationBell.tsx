'use client';

import * as React from 'react';
import ReactDOM from 'react-dom';
import { Bell, CheckCheck, Trash2, Bot, X } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
}

const DAILY_TIPS = [
  { title: '💧 Hidratación', message: 'Recuerda beber al menos 2 litros de agua hoy. La deshidratación puede causar fatiga.' },
  { title: '🥩 Proteínas', message: 'Intenta consumir 1.6-2.2g de proteína por kg de peso corporal.' },
  { title: '😴 Descanso', message: 'Dormir 7-9 horas es fundamental para la recuperación muscular.' },
  { title: '🚶 Actividad', message: 'Caminar 30 minutos al día puede aumentar tu gasto calórico.' },
  { title: '🥦 Fibra', message: 'Incluye verduras en cada comida. La fibra te mantiene saciado.' },
  { title: '⏰ Horarios', message: 'Comer a horas regulares ayuda a tu metabolismo.' },
  { title: '🧘 Estrés', message: 'El estrés crónico eleva el cortisol. Toma 5 min para respirar.' },
  { title: '🍎 Frutas', message: 'Las frutas son ricas en vitaminas. Intenta comer 2-3 porciones al día.' },
  { title: '🏋️ Fuerza', message: 'El entrenamiento de fuerza 3 veces por semana mantiene tu masa muscular.' },
  { title: '📊 Seguimiento', message: 'Registrar lo que comes te hace más consciente de tus hábitos.' },
  { title: '🥑 Grasas saludables', message: 'Aguacate, frutos secos y aceite de oliva son esenciales para tus hormonas.' },
  { title: '🍳 Desayuno', message: 'Un desayuno rico en proteína te mantiene saciado hasta el almuerzo.' },
  { title: '🧠 Mente', message: 'La alimentación consciente te ayuda a disfrutar más y comer menos.' },
  { title: '💪 Progreso', message: 'No te obsesiones con la báscula. Mide tu progreso con fotos y medidas.' },
  { title: '🥤 Evita calorías líquidas', message: 'Refrescos y jugos suman calorías sin saciarte. Prefiere agua o té.' },
  { title: '🔄 Variedad', message: 'Rotar tus alimentos evita deficiencias nutricionales.' },
  { title: '🏃 Cardio', message: '150 min de cardio moderado por semana mejora tu salud cardiovascular.' },
  { title: '📏 Porciones', message: 'Usa platos más pequeños. Tu cerebro percibe el mismo volumen con menos comida.' },
  { title: '🌙 Cena ligera', message: 'Una cena ligera 2-3 horas antes de dormir mejora tu sueño.' },
  { title: '🎯 Metas', message: 'Establece metas semanales pequeñas. Son más alcanzables y motivadoras.' },
  { title: '🥜 Snacks inteligentes', message: 'Ten a mano snacks saludables: nueces, yogur, frutas.' },
  { title: '🧂 Sal', message: 'Reduce el sodio para evitar retención de líquidos.' },
  { title: '🍽️ Mastica bien', message: 'Comer despacio mejora la digestión y te hace sentir lleno antes.' },
  { title: '🌈 Colores', message: 'Un plato colorido significa variedad de nutrientes.' },
  { title: '📱 Registra', message: 'Tomar foto de tus comidas te hace más consciente de lo que consumes.' },
  { title: '🤝 Social', message: 'Compartir metas de salud con amigos te mantiene motivado.' },
  { title: '🧊 Agua fría', message: 'Beber agua fría puede aumentar ligeramente tu metabolismo.' },
  { title: '🏆 Recompensas', message: 'Celebra tus logros (no con comida). Una película, un baño relajante.' },
  { title: '📈 Consistencia', message: 'No busques perfección, busca consistencia. Un 80% bien hecho es suficiente.' },
  { title: '🌟 Motivación', message: 'Recuerda POR QUÉ empezaste. Tu salud es la mejor inversión.' },
  { title: '💡 Consejo extra', message: 'Prepara tu comida del día siguiente la noche anterior.' },
];

function getDailyTip() {
  const dayOfMonth = new Date().getDate();
  return DAILY_TIPS[(dayOfMonth - 1) % DAILY_TIPS.length];
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const { info } = useToast();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const portalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 60 seconds
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDropdown = dropdownRef.current && dropdownRef.current.contains(target);
      const insidePortal = portalRef.current && portalRef.current.contains(target);
      if (!insideDropdown && !insidePortal) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const openDropdown = async () => {
    setIsOpen(true);
    await loadNotifications();
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const loadNotifications = async () => {
    try {
      // First, ensure daily notification exists
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ createDaily: true }),
      });
      // Check for water reminder (smart, won't spam)
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ createWaterReminder: true }),
      });
      // Then fetch unread notifications
      const res = await fetch('/api/notifications', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      // Silently fail
    }
  };

  const deleteNotificationInner = async (notificationId: string) => {
    console.log('[NotificationBell] Deleting:', notificationId);
    try {
      const res = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notificationId }),
      });
      const data = await res.json();
      console.log('[NotificationBell] Response:', res.status, data);
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('[NotificationBell] Delete error:', error);
    }
  };

  const deleteNotification = async (e: React.MouseEvent, notificationId: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNotificationInner(notificationId);
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
        onClick={() => { isOpen ? closeDropdown() : openDropdown(); }}
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
        <div ref={portalRef} className="fixed left-[296px] top-16 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[9999] overflow-hidden" style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}>
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
                <div
                  key={notif.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-purple-50/30 transition-colors"
                >
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
                  <button
                    onClick={() => deleteNotificationInner(notif.id)}
                    className="flex-shrink-0 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
                    title="Eliminar"
                    type="button"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer — Daily Tip */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100">
            <div className="flex items-start gap-2">
              <span className="text-sm flex-shrink-0">💡</span>
              <div>
                <p className="text-[10px] font-bold text-slate-700">Tip del día</p>
                <p className="text-[10px] text-slate-500 leading-tight">{getDailyTip().message}</p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
