'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="h-20 w-20 mx-auto rounded-3xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
          <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Algo salió mal
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Ha ocurrido un error inesperado. Por favor intenta de nuevo.
          </p>
        </div>
        <Button
          onClick={reset}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}
