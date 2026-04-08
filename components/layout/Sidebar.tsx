'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/cn';
import {
  Home,
  Utensils,
  Dumbbell,
  MessageCircle,
  FileText,
  BarChart3,
  User,
  Crown,
  Settings,
  LogOut,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationBell } from './NotificationBell';
// import { AVATAR_PRESETS } from '@/components/ui/AvatarSelector';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'text-indigo-500' },
  { href: '/food-log', label: 'Alimentos', icon: Utensils, color: 'text-blue-500' },
  { href: '/exercise', label: 'Ejercicio', icon: Dumbbell, color: 'text-purple-500' },
  { href: '/chat', label: 'Chat IA', icon: MessageCircle, color: 'text-pink-500', badge: 'IA' },
  { href: '/articles', label: 'Artículos', icon: FileText, color: 'text-amber-500' },
  { href: '/history', label: 'Historial', icon: BarChart3, color: 'text-violet-500' },
];

const bottomNavItems = [
  { href: '/profile', label: 'Perfil', icon: User, color: 'text-indigo-500' },
  { href: '/subscription', label: 'Premium', icon: Crown, color: 'text-amber-500' },
  { href: '/settings', label: 'Ajustes', icon: Settings, color: 'text-slate-400' },
];

interface SidebarProps {
  isCollapsed?: boolean;
  isMobile?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isCollapsed = false, isMobile = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, isPremium, isPro, logout } = useAuth();
  const [showTooltip, setShowTooltip] = React.useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 h-screen bg-white border-r border-slate-200 text-slate-700 transition-all duration-300 ease-in-out shadow-2xl',
        isMobile 
          ? (isCollapsed ? '-translate-x-full w-72' : 'translate-x-0 w-72') 
          : (isCollapsed ? 'w-20' : 'w-72')
      )}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Header con Logo */}
      <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6 backdrop-blur-sm">
        <div className={cn('flex items-center gap-3 transition-opacity duration-300', isCollapsed && 'opacity-0 hidden')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              NutriFlow
            </h1>
            <p className="text-[10px] text-slate-500">Tu salud, simplificada</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!isCollapsed && <NotificationBell />}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 rounded-lg hover:bg-slate-100 hover:text-emerald-600 transition-colors text-slate-500"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 space-y-2 px-3 py-6 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-slate-100 text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {/* Indicador activo animado */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  />
                )}

                <div className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-[10px] transition-transform duration-300 transform group-hover:scale-105',
                  isActive
                    ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-transparent group-hover:bg-slate-100'
                )}>
                  <Icon className={cn('h-5 w-5 transition-colors', isActive ? 'text-white' : item.color)} />
                </div>
                
                <AnimatePresence>
                  {(!isCollapsed || isMobile) && (
                    <motion.div 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex flex-1 items-center justify-between ml-1 overflow-hidden"
                    >
                      <span className="transition-colors whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[10px] border-0 shadow-lg ml-2">
                          {item.badge}
                        </Badge>
                      )}
                      {isPremium && !isPro && item.href === '/subscription' && (
                        <Sparkles className="h-4 w-4 text-amber-400 ml-2" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Tooltip ultra suave para collapsed */}
                <AnimatePresence>
                  {isCollapsed && !isMobile && showTooltip && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.9 }}
                      className="absolute left-[85px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 shadow-xl z-50 pointer-events-none"
                    >
                      {item.label}
                      {item.badge && (
                        <Badge className="ml-2 bg-gradient-to-r from-pink-600 to-purple-600 border-0 text-white text-[10px]">
                          {item.badge}
                        </Badge>
                      )}
                      <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-white border-l border-b border-slate-200 transform rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Navegación Inferior */}
      <div className="border-t border-slate-200 px-3 py-6 space-y-2">
        
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-amber-50 text-amber-900'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200',
                isActive 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30' 
                  : 'bg-slate-100 group-hover:bg-slate-200'
              )}>
                <Icon className={cn('h-5 w-5 transition-colors', isActive ? 'text-white' : item.color)} />
              </div>
              
              {(!isCollapsed || isMobile) && <span className="transition-colors">{item.label}</span>}
              
              {isCollapsed && !isMobile && showTooltip && (
                <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-xl border border-slate-200 z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 transition-all duration-200 group-hover:bg-red-100">
            <LogOut className="h-5 w-5 text-slate-500 transition-colors group-hover:text-red-600" />
          </div>
          
          {(!isCollapsed || isMobile) && <span className="transition-colors">Cerrar sesión</span>}
          
          {isCollapsed && !isMobile && showTooltip && (
             <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-xl border border-slate-200 z-50">
              Cerrar sesión
            </div>
          )}
        </button>
      </div>

      {/* User Info Footer */}
      {(!isCollapsed || isMobile) && user && (
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20 overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-xs font-semibold">
              {user?.avatarType === 'custom' && user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Usuario'}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] border-0 shadow-lg shadow-amber-500/30">
                    {isPro ? 'PRO' : 'PREMIUM'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
