'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
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

const navItems = [
  { href: '/dashboard', labelKey: 'nav_dashboard' as const, icon: Home, color: 'text-indigo-500' },
  { href: '/food-log', labelKey: 'nav_food' as const, icon: Utensils, color: 'text-blue-500' },
  { href: '/exercise', labelKey: 'nav_exercise' as const, icon: Dumbbell, color: 'text-purple-500' },
  { href: '/chat', labelKey: 'nav_chat' as const, icon: MessageCircle, color: 'text-pink-500', badge: 'IA' },
  { href: '/articles', labelKey: 'nav_articles' as const, icon: FileText, color: 'text-amber-500' },
  { href: '/history', labelKey: 'nav_history' as const, icon: BarChart3, color: 'text-violet-500' },
  { href: '/profile', labelKey: 'nav_profile' as const, icon: User, color: 'text-indigo-500' },
  { href: '/subscription', labelKey: 'nav_subscription' as const, icon: Crown, color: 'text-amber-500' },
  { href: '/settings', labelKey: 'nav_settings' as const, icon: Settings, color: 'text-slate-400' },
];

interface SidebarProps {
  isCollapsed?: boolean;
  isMobile?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isCollapsed = false, isMobile = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, isPremium, isPro, logout } = useAuth();
  const { tr } = useLang();
  const [showTooltip, setShowTooltip] = React.useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 transition-all duration-300 ease-in-out shadow-2xl',
        isMobile
          ? (isCollapsed ? '-translate-x-full w-72' : 'translate-x-0 w-72')
          : (isCollapsed ? 'w-20' : 'w-72')
      )}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Header con Logo */}
      <div className="flex h-20 items-center justify-between border-b border-slate-200 dark:border-slate-700/60 px-6 backdrop-blur-sm shrink-0">
        <div className={cn('flex items-center gap-3 transition-opacity duration-300', isCollapsed && 'opacity-0 hidden')}>
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden shrink-0">
            <img src="/logos/isotipo.png" alt="NutriFlow" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              NutriFlow
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{tr('sidebar_tagline')}</p>
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

      {/* Single Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
        <div className="space-y-1">
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
                      ? 'bg-slate-100 text-slate-900 shadow-sm font-semibold dark:bg-slate-800 dark:text-slate-100'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800/50 dark:hover:text-slate-100'
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
                      : 'bg-transparent group-hover:bg-slate-100 dark:group-hover:bg-slate-700'
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
                        <span className="transition-colors whitespace-nowrap">{tr(item.labelKey)}</span>
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

                  {/* Tooltip para collapsed */}
                  <AnimatePresence>
                    {isCollapsed && !isMobile && showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.9 }}
                        className="absolute left-[85px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-xl z-50 pointer-events-none"
                      >
                        {tr(item.labelKey)}
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

          {/* Separator */}
          <div className="my-3 border-t border-slate-200 dark:border-slate-700/60" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 transition-all duration-200 group-hover:bg-red-100 dark:group-hover:bg-red-900/30">
              <LogOut className="h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors group-hover:text-red-600 dark:group-hover:text-red-400" />
            </div>

            {(!isCollapsed || isMobile) && <span className="transition-colors">{tr('nav_logout')}</span>}

            {isCollapsed && !isMobile && showTooltip && (
              <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                {tr('nav_logout')}
              </div>
            )}
          </button>

          {/* User Info */}
          {user && (!isCollapsed || isMobile) && (
            <div className="mx-1 mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20 overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-xs font-semibold">
                  {user?.avatarType === 'custom' && user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Usuario'}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] border-0 px-1.5 py-0.5">
                        {isPro ? 'Máximo' : 'Elite'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
