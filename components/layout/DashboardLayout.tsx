'use client';

import * as React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AVATAR_PRESETS } from '@/components/ui/AvatarSelector';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [notifications, setNotifications] = React.useState(3);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (mobile) {
          setIsSidebarCollapsed(true);
        }
      }, 50);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  // Close user menu on outside click
  React.useEffect(() => {
    if (!showUserMenu) return;
    const handler = () => setShowUserMenu(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [showUserMenu]);

  const handleLogout = async () => {
    await logout();
  };

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {isMobile && !isSidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobile={isMobile}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isMobile ? 'ml-0 w-full' : (isSidebarCollapsed ? 'ml-20' : 'ml-72')
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-white/80 backdrop-blur-3xl border-b border-slate-200/60 shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
          <div className="flex items-center gap-4 px-4 sm:px-8">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="h-10 w-10 text-slate-600 hover:bg-slate-100"
              >
                {isSidebarCollapsed ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </Button>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Bienvenido
              </h1>
              <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 sm:px-8">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setNotifications(0)}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 min-w-0 p-0 bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] flex items-center justify-center border-0 shadow-lg shadow-red-500/30">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Avatar + Dropdown Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-all"
              >
                <Avatar className="h-9 w-9 border-2 border-emerald-500/50 shadow-md">
                  {user?.avatarType === 'custom' && user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="h-full w-full object-cover rounded-full" />
                  ) : user?.avatarType === 'preset' && user?.avatarUrl ? (
                    <div className="h-full w-full rounded-full overflow-hidden bg-emerald-50 flex items-center justify-center">
                      {AVATAR_PRESETS.find(p => p.id === user.avatarUrl)?.render(36)}
                    </div>
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-700 leading-tight">
                    {user?.name?.split(' ')[0] || 'Usuario'}
                  </p>
                  <p className="text-xs text-slate-400 leading-tight truncate max-w-32">
                    {user?.email || ''}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    {user?.subscriptionPlan === 'pro' && (
                      <Badge className="mt-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] border-0">PRO</Badge>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserMenu(false);
                        router.push('/profile');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-emerald-600" />
                      Mi Perfil
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserMenu(false);
                        router.push('/settings');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-slate-500" />
                      Ajustes
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 py-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-8">
          {children}
        </div>

        {/* Footer */}
        <footer className="pt-2 pb-8 px-4 sm:px-8 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-200/50 pt-8 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                NutriFlow
              </span>
              <span className="text-sm text-slate-500">© 2026</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="/terms" className="hover:text-emerald-600 transition-colors">Términos</a>
              <a href="/privacy" className="hover:text-emerald-600 transition-colors">Privacidad</a>
              <a href="/contact" className="hover:text-emerald-600 transition-colors">Contacto</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default DashboardLayout;
