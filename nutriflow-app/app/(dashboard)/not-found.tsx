import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
          404
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Página no encontrada
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Volver al Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
