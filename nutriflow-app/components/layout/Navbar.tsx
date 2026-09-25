'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
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
import { ThemeLangToggle } from '@/components/ui/ThemeLangToggle';

const navItems = [
  { href: '/dashboard', labelKey: 'nav_dashboard' as const, icon: Home },
  { href: '/food-log', labelKey: 'nav_food' as const, icon: Utensils },
  { href: '/exercise', labelKey: 'nav_exercise' as const, icon: Dumbbell },
  { href: '/history', labelKey: 'nav_history' as const, icon: BarChart3 },
  { href: '/articles', labelKey: 'nav_articles' as const, icon: FileText },
  { href: '/chat', labelKey: 'nav_chat' as const, icon: MessageCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isPremium, isPro, logout } = useAuth();
  const { tr } = useLang();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
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
            <Link href="/#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors">
              {tr('landing_features')}
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors">
              {tr('landing_pricing')}
            </Link>
            <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors">
              {tr('auth_login')}
            </Link>
            <Link href="/register">
              <Button>{tr('auth_free_start')}</Button>
            </Link>
            <ThemeLangToggle />
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
          <div className="md:hidden border-t border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
            <nav className="container-nutriflow py-4 flex flex-col gap-4">
              <Link href="/#features" className="text-sm text-stone-600 dark:text-slate-400">
                {tr('landing_features')}
              </Link>
              <Link href="/#pricing" className="text-sm text-stone-600 dark:text-slate-400">
                {tr('landing_pricing')}
              </Link>
              <Link href="/login" className="text-sm text-stone-600 dark:text-slate-400">
                {tr('auth_login')}
              </Link>
              <Link href="/register">
                <Button className="w-full">{tr('auth_free_start')}</Button>
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
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
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
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-4 w-4" />
                {tr(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeLangToggle />

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
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-stone-500 dark:text-slate-400">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4" />
                  {tr('nav_profile')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/subscription" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Crown className="h-4 w-4" />
                  {tr('nav_subscription')}
                  <span className="ml-auto text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full capitalize">
                    {user.subscriptionPlan}
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30">
                <LogOut className="h-4 w-4 mr-2" />
                {tr('nav_logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-x-auto">
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
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium whitespace-nowrap">
                  {tr(item.labelKey)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
