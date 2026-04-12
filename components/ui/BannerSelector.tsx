'use client';

import { useState } from 'react';
import { Check, Camera, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export type BannerPreset = {
  id: string;
  name: string;
  description: string;
  className: string;
};

export const BANNER_PRESETS: BannerPreset[] = [
  {
    id: 'emerald',
    name: 'Esmeralda',
    description: 'Fresco y natural',
    className: 'from-emerald-600 via-teal-600 to-emerald-700',
  },
  {
    id: 'ocean',
    name: 'Océano',
    description: 'Profundo y sereno',
    className: 'from-blue-600 via-cyan-600 to-blue-700',
  },
  {
    id: 'sunset',
    name: 'Atardecer',
    description: 'Cálido y vibrante',
    className: 'from-orange-500 via-pink-500 to-purple-600',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Mágico y etéreo',
    className: 'from-violet-600 via-fuchsia-500 to-emerald-400',
  },
  {
    id: 'midnight',
    name: 'Medianoche',
    description: 'Elegante y oscuro',
    className: 'from-slate-800 via-slate-900 to-black',
  },
  {
    id: 'fire',
    name: 'Fuego',
    description: 'Intenso y poderoso',
    className: 'from-red-600 via-orange-500 to-yellow-500',
  },
  {
    id: 'galaxy',
    name: 'Galaxia',
    description: 'Misterioso y vasto',
    className: 'from-indigo-900 via-purple-800 to-pink-600',
  },
  {
    id: 'forest',
    name: 'Bosque',
    description: 'Verde y tranquilo',
    className: 'from-green-700 via-emerald-600 to-teal-700',
  },
  {
    id: 'neon',
    name: 'Neón',
    description: 'Futurista y brillante',
    className: 'from-cyan-500 via-blue-500 to-purple-600',
  },
  {
    id: 'rose',
    name: 'Rosa',
    description: 'Delicado y suave',
    className: 'from-rose-400 via-pink-400 to-rose-500',
  },
  {
    id: 'gold',
    name: 'Oro',
    description: 'Premium y exclusivo',
    className: 'from-amber-400 via-yellow-500 to-amber-600',
  },
  {
    id: 'ice',
    name: 'Hielo',
    description: 'Frío y limpio',
    className: 'from-sky-300 via-blue-300 to-indigo-400',
  },
];

interface BannerSelectorProps {
  currentBanner?: string | null;
  currentType?: string | null;
  onSelectPreset: (presetId: string) => void;
  onUploadImage: (dataUrl: string) => void;
}

export function BannerSelector({ currentBanner, currentType, onSelectPreset, onUploadImage }: BannerSelectorProps) {
  const [mode, setMode] = useState<'presets' | 'upload'>('presets');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPreviewUrl(dataUrl);
          onUploadImage(dataUrl);
        }
      };
      img.onerror = () => alert('Error procesando imagen');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('presets')}
          className={cn(
            'flex-1 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2',
            mode === 'presets'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
        >
          <ImageIcon className="h-4 w-4" />
          Fondos
        </button>
        <button
          onClick={() => setMode('upload')}
          className={cn(
            'flex-1 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2',
            mode === 'upload'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
        >
          <Camera className="h-4 w-4" />
          Subir imagen
        </button>
      </div>

      {mode === 'presets' ? (
        /* Preset Banners Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BANNER_PRESETS.map((preset) => {
            const isSelected = currentBanner === preset.id && (currentType === 'preset' || !currentType);
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                className={cn(
                  'group relative flex flex-col items-center gap-2 rounded-2xl border-2 overflow-hidden transition-all hover:scale-[1.02]',
                  isSelected
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                )}
              >
                {/* Banner Preview */}
                <div className={`w-full h-16 bg-gradient-to-br ${preset.className}`}>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0yMGgtNjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-30" />
                </div>
                {/* Info */}
                <div className="p-2 text-center w-full bg-white dark:bg-slate-900">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{preset.name}</p>
                  <p className="text-[10px] text-slate-400">{preset.description}</p>
                </div>
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Upload Section */
        <div className="space-y-4">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="banner-upload"
            />
            <label
              htmlFor="banner-upload"
              className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-emerald-400 transition-colors"
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full h-24 rounded-xl object-cover shadow-lg" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Click para cambiar</p>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <Camera className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Sube tu imagen de banner</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG hasta 5MB. Recomendado: 800x200px</p>
                  </div>
                </>
              )}
            </label>
          </div>

          {previewUrl && (
            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Imagen seleccionada</p>
                  <p className="text-xs text-emerald-500">Se guardará al guardar el perfil</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewUrl(null)}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
