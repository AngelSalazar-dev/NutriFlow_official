'use client';

import * as React from 'react';
import { Sun, Moon, Globe, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLang } from '@/context/LangContext';
import { cn } from '@/lib/cn';

export function ThemeLangToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, languages } = useLang();
  const [langOpen, setLangOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  // Solucionado el problema de SSR/Hydration para el ícono inicial
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLang = languages.find(l => l.code === lang);

  if (!mounted) return <div className="h-9 w-[120px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />;

  return (
    <div className={cn('flex items-center gap-1.5', collapsed ? 'flex-col' : 'flex-row')}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        className={cn(
          'relative flex items-center justify-center rounded-xl transition-all duration-300 border',
          'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700',
          'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200',
          collapsed ? 'h-10 w-10' : 'h-10 w-10 shrink-0'
        )}
      >
        <Sun
          className={cn(
            'absolute h-4 w-4 transition-all duration-500 text-amber-500',
            theme === 'dark' ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'
          )}
        />
        <Moon
          className={cn(
            'absolute h-4 w-4 transition-all duration-500 text-indigo-400',
            theme === 'dark' ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'
          )}
        />
      </button>

      {/* Language Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setLangOpen(p => !p)}
          title="Cambiar idioma"
          className={cn(
            'flex items-center justify-between gap-2 rounded-xl px-3 h-10 border transition-all duration-200',
             'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800',
             'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100',
            collapsed ? 'w-10 px-0 justify-center' : 'w-full min-w-[85px]'
          )}
        >
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-xs">
            <span className={cn("text-slate-400 dark:text-slate-500", !collapsed && "mr-0.5")}>
              <Globe className="h-3 w-3" />
            </span>
            <span>{currentLang?.flag}</span>
          </div>
          
          {!collapsed && (
            <ChevronDown
              className={cn(
                'h-3 w-3 opacity-60 transition-transform duration-200',
                langOpen ? 'rotate-180' : 'rotate-0'
              )}
            />
          )}
        </button>

        {langOpen && (
          <div className={cn(
            'absolute z-[200] mt-2 w-48 rounded-2xl border shadow-2xl overflow-hidden',
            'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700/60',
            'top-full mt-2 left-0', // Abriendo hacia abajo
            'animate-scale-in origin-top-left'
          )}>
            <div className="p-1.5 max-h-64 overflow-y-auto custom-scrollbar">
              {languages.map(l => {
                const isSelected = lang === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors duration-150',
                      isSelected
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    <div className="flex items-center gap-2">
                       <span className={cn("text-[10px] uppercase font-bold px-1.5 rounded", isSelected ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500")}>
                        {l.flag}
                       </span>
                       <span className="text-sm">{l.label}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
