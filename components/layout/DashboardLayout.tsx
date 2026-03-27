'use client';

import * as React from 'react';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-nutriflow py-6">
          {children}
        </div>
      </main>
      <footer className="border-t border-stone-200 bg-white py-6">
        <div className="container-nutriflow">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-emerald-900">NutriFlow</span>
              <span className="text-sm text-stone-500">© 2026</span>
            </div>
            <div className="flex gap-6 text-sm text-stone-500">
              <a href="/terms" className="hover:text-emerald-700">Términos</a>
              <a href="/privacy" className="hover:text-emerald-700">Privacidad</a>
              <a href="/contact" className="hover:text-emerald-700">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
