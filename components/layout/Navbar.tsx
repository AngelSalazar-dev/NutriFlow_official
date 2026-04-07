'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  Utensils,
  Dumbbell,
  FileText,
  MessageCircle,
  BarChart3,
  User,
  Crown,
  LogOut,
  Menu,
  X,
  Leaf,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/food-log', label: 'Alimentos', icon: Utensils },
  { href: '/exercise', label: 'Ejercicio', icon: Dumbbell },
  { href: '/history', label: 'Historial', icon: BarChart3 },
  { href: '/articles', label: 'Artículos', icon: FileText },
  { href: '/chat', label: 'Chat IA', icon: MessageCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isPremium, isPro, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-3xl shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
        <div className="container-nutriflow flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NutriFlow
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              Características
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              Precios
            </Link>
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/register">
              <Button>Comenzar gratis</Button>
            </Link>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white">
            <nav className="container-nutriflow py-4 flex flex-col gap-4">
              <Link href="/#features" className="text-sm text-stone-600">
                Características
              </Link>
              <Link href="/#pricing" className="text-sm text-stone-600">
                Precios
              </Link>
              <Link href="/login" className="text-sm text-stone-600">
                Iniciar sesión
              </Link>
              <Link href="/register">
                <Button className="w-full">Comenzar gratis</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>
    );
  }

  if (!user) {
    return null;
  }

  return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-3xl shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
      <div className="container-nutriflow flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hidden sm:inline">
            NutriFlow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">

          {!isPremium && (
            <Link href="/subscription">
              <Button variant="default" size="sm" className="hidden sm:inline-flex gap-2">
                <Crown className="h-4 w-4" />
                Premium
              </Button>
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-stone-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/subscription" className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Suscripción
                  <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full capitalize">
                    {user.subscriptionPlan}
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-t border-stone-200 bg-white overflow-x-auto">
        <div className="flex px-4 py-2 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 min-w-[64px] transition-colors',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-emerald-600'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
