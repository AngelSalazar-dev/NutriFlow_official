'use client';

import { useState } from 'react';
import { Check, Camera, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export type AvatarPreset = {
  id: string;
  name: string;
  personality: string;
  render: (size?: number) => React.ReactNode;
};

const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'wolf',
    name: 'Lobo',
    personality: 'Fuerte y líder',
    render: (size = 80) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#1e293b" />
        <path d="M25 35L35 20L45 35" fill="#64748b" />
        <path d="M55 35L65 20L75 35" fill="#64748b" />
        <ellipse cx="50" cy="55" rx="22" ry="25" fill="#64748b" />
        <circle cx="42" cy="50" r="3" fill="#fbbf24" />
        <circle cx="58" cy="50" r="3" fill="#fbbf24" />
        <ellipse cx="50" cy="60" rx="4" ry="3" fill="#1e293b" />
        <path d="M44 65Q50 70 56 65" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'fox',
    name: 'Zorro',
    personality: 'Astuto y ágil',
    render: (size = 80) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#fef3c7" />
        <path d="M20 30L30 15L42 30" fill="#ea580c" />
        <path d="M58 30L70 15L80 30" fill="#ea580c" />
        <ellipse cx="50" cy="55" rx="24" ry="22" fill="#ea580c" />
        <ellipse cx="50" cy="62" rx="12" ry="10" fill="#fef3c7" />
        <circle cx="42" cy="48" r="3" fill="#1e293b" />
        <circle cx="58" cy="48" r="3" fill="#1e293b" />
        <ellipse cx="50" cy="58" rx="2" ry="2" fill="#1e293b" />
      </svg>
    ),
  },
  {
    id: 'phoenix',
    name: 'Fénix',
    personality: 'Renacimiento y poder',
    render: (size = 80) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#fef2f2" />
        <path d="M30 70Q35 40 50 25Q65 40 70 70" fill="#ef4444" />
        <path d="M35 65Q40 45 50 35Q60 45 65 65" fill="#f97316" />
        <path d="M40 60Q45 50 50 42Q55 50 60 60" fill="#fbbf24" />
        <circle cx="45" cy="45" r="2" fill="#1e293b" />
        <circle cx="55" cy="45" r="2" fill="#1e293b" />
        <path d="M30 70L25 80L35 75" fill="#ef4444" />
        <path d="M70 70L75 80L65 75" fill="#ef4444" />
      </svg>
    ),
  },
  {
    id: 'dragon',
    name: 'Dragón',
    personality: 'Fuerza absoluta',
    render: (size = 80) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#022c22" />
        <path d="M25 35L20 15L35 30" fill="#059669" />
        <path d="M75 35L80 15L65 30" fill="#059669" />
        <ellipse cx="50" cy="52" rx="22" ry="20" fill="#059669" />
        <circle cx="43" cy="48" r="3" fill="#fbbf24" />
        <circle cx="57" cy="48" r="3" fill="#fbbf24" />
        <circle cx="43" cy="48" r="1.5" fill="#1e293b" />
        <circle cx="57" cy="48" r="1.5" fill="#1e293b" />
        <path d="M42 60L46 58L50 60L54 58L58 60" stroke="#022c22" strokeWidth="2" strokeLinecap="round" />
        <path d="M35 40L28 35" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
        <path d="M65 40L72 35" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'eagle',
    name: 'Águila',
    personality: 'Visión y libertad',
    render: (size = 80) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#fefce8" />
        <ellipse cx="50" cy="50" rx="20" ry="18" fill="#92400e" />
        <ellipse cx="50" cy="42" rx="14" ry="12" fill="#fefce8" />
        <circle cx="44" cy="40" r="2.5" fill="#1e293b" />
        <circle cx="56" cy="40" r="2.5" fill="#1e293b" />
        <path d="M46 46L50 50L54 46" fill="#f59e0b" />
        <path d="M30 50L15 40L25 55" fill="#92400e" />
        <path d="M70 50L85 40L75 55" fill="#92400e" />
      </svg>
    ),
  },
  {
    id: 'tiger',
    name: 'Tigre',
    personality: 'Agresivo y elegante',
    render: (size = 80) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#fff7ed" />
        <ellipse cx="50" cy="52" rx="24" ry="22" fill="#f97316" />
        <ellipse cx="50" cy="58" rx="14" ry="10" fill="#fff7ed" />
        <path d="M30 38L35 48L28 42" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M42 32L44 44L40 36" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M58 32L56 44L60 36" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M70 38L65 48L72 42" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="42" cy="46" r="3" fill="#1e293b" />
        <circle cx="58" cy="46" r="3" fill="#1e293b" />
        <ellipse cx="50" cy="54" rx="3" ry="2" fill="#1e293b" />
      </svg>
    ),
  },
  {
    id: 'owl',
    name: 'Búho',
    personality: 'Sabiduría y calma',
    render: (size = 80) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#ede9fe" />
        <circle cx="50" cy="50" r="24" fill="#7c3aed" />
        <circle cx="38" cy="44" r="10" fill="#ede9fe" />
        <circle cx="62" cy="44" r="10" fill="#ede9fe" />
        <circle cx="38" cy="44" r="5" fill="#1e293b" />
        <circle cx="62" cy="44" r="5" fill="#1e293b" />
        <circle cx="39" cy="43" r="1.5" fill="#fff" />
        <circle cx="63" cy="43" r="1.5" fill="#fff" />
        <path d="M46 54L50 58L54 54" fill="#f59e0b" />
        <path d="M30 30L25 20L35 28" fill="#7c3aed" />
        <path d="M70 30L75 20L65 28" fill="#7c3aed" />
      </svg>
    ),
  },
  {
    id: 'shark',
    name: 'Tiburón',
    personality: 'Implacable y frío',
    render: (size = 80) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#0c4a6e" />
        <path d="M20 55L10 50L22 48" fill="#38bdf8" />
        <path d="M80 55L90 50L78 48" fill="#38bdf8" />
        <ellipse cx="50" cy="52" rx="25" ry="18" fill="#475569" />
        <ellipse cx="50" cy="58" rx="18" ry="10" fill="#cbd5e1" />
        <circle cx="40" cy="48" r="3" fill="#fff" />
        <circle cx="60" cy="48" r="3" fill="#fff" />
        <circle cx="40" cy="48" r="1.5" fill="#0c4a6e" />
        <circle cx="60" cy="48" r="1.5" fill="#0c4a6e" />
        <path d="M42 62L46 60L50 62L54 60L58 62" stroke="#0c4a6e" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'lion',
    name: 'León',
    personality: 'Rey indiscutible',
    render: (size = 80) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#fef3c7" />
        <circle cx="50" cy="50" r="28" fill="#d97706" />
        <circle cx="50" cy="52" r="20" fill="#fbbf24" />
        <circle cx="43" cy="48" r="3" fill="#1e293b" />
        <circle cx="57" cy="48" r="3" fill="#1e293b" />
        <ellipse cx="50" cy="56" rx="3" ry="2.5" fill="#92400e" />
        <path d="M44 62Q50 67 56 62" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <line
            key={i}
            x1={50 + 24 * Math.cos((angle * Math.PI) / 180)}
            y1={50 + 24 * Math.sin((angle * Math.PI) / 180)}
            x2={50 + 30 * Math.cos((angle * Math.PI) / 180)}
            y2={50 + 30 * Math.sin((angle * Math.PI) / 180)}
            stroke="#d97706"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </svg>
    ),
  },
  {
    id: 'panda',
    name: 'Panda',
    personality: 'Tranquilo y fuerte',
    render: (size = 80) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#f0fdf4" />
        <circle cx="50" cy="52" r="24" fill="#fff" />
        <circle cx="36" cy="42" r="8" fill="#1e293b" />
        <circle cx="64" cy="42" r="8" fill="#1e293b" />
        <circle cx="36" cy="42" r="3" fill="#fff" />
        <circle cx="64" cy="42" r="3" fill="#fff" />
        <ellipse cx="50" cy="56" rx="3" ry="2" fill="#1e293b" />
        <path d="M44 62Q50 66 56 62" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        <circle cx="30" cy="30" r="7" fill="#1e293b" />
        <circle cx="70" cy="30" r="7" fill="#1e293b" />
      </svg>
    ),
  },
  {
    id: 'cobra',
    name: 'Cobra',
    personality: 'Letal y preciso',
    render: (size = 80) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#1c1917" />
        <ellipse cx="50" cy="55" rx="20" ry="25" fill="#292524" />
        <path d="M30 55Q25 40 35 30Q45 20 50 35Q55 20 65 30Q75 40 70 55" fill="#44403c" />
        <circle cx="43" cy="42" r="2.5" fill="#ef4444" />
        <circle cx="57" cy="42" r="2.5" fill="#ef4444" />
        <circle cx="43" cy="42" r="1" fill="#1c1917" />
        <circle cx="57" cy="42" r="1" fill="#1c1917" />
        <path d="M47 55L50 58L53 55" stroke="#ef4444" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'bear',
    name: 'Oso',
    personality: 'Poder y protección',
    render: (size = 80) => (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#fef2f2" />
        <circle cx="32" cy="30" r="8" fill="#78350f" />
        <circle cx="68" cy="30" r="8" fill="#78350f" />
        <circle cx="32" cy="30" r="4" fill="#b45309" />
        <circle cx="68" cy="30" r="4" fill="#b45309" />
        <ellipse cx="50" cy="52" rx="24" ry="22" fill="#78350f" />
        <ellipse cx="50" cy="58" rx="14" ry="10" fill="#b45309" />
        <circle cx="42" cy="46" r="3" fill="#1e293b" />
        <circle cx="58" cy="46" r="3" fill="#1e293b" />
        <ellipse cx="50" cy="54" rx="4" ry="3" fill="#1e293b" />
        <path d="M45 62Q50 65 55 62" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface AvatarSelectorProps {
  currentAvatar?: string | null;
  currentType?: string | null;
  onSelectPreset: (presetId: string) => void;
  onUploadImage: (dataUrl: string) => void;
  onUseInitials: () => void;
}

export function AvatarSelector({ currentAvatar, currentType, onSelectPreset, onUploadImage, onUseInitials }: AvatarSelectorProps) {
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
        const MAX_WIDTH = 256;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
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
            'flex-1 py-3 rounded-xl text-sm font-semibold transition-all',
            mode === 'presets'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          Avatares
        </button>
        <button
          onClick={() => setMode('upload')}
          className={cn(
            'flex-1 py-3 rounded-xl text-sm font-semibold transition-all',
            mode === 'upload'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          Subir imagen
        </button>
      </div>

      {mode === 'presets' ? (
        <>
          {/* Initials Option */}
          <button
            onClick={onUseInitials}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all',
              currentType === 'initials' || !currentType
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300'
            )}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold text-lg">
              AB
            </div>
            <div className="text-left flex-1">
              <p className="font-semibold text-slate-900">Tus iniciales</p>
              <p className="text-xs text-slate-500">Avatar por defecto con iniciales</p>
            </div>
            {(currentType === 'initials' || !currentType) && (
              <Check className="h-5 w-5 text-emerald-600" />
            )}
          </button>

          {/* Preset Avatars Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {AVATAR_PRESETS.map((preset) => {
              const isSelected = currentAvatar === preset.id && currentType === 'preset';
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  className={cn(
                    'group relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all hover:scale-105',
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <div className="relative">
                    {preset.render(64)}
                    {isSelected && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-900">{preset.name}</p>
                    <p className="text-[10px] text-slate-400">{preset.personality}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        /* Upload Section */
        <div className="space-y-4">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-emerald-400 transition-colors"
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-2xl object-cover shadow-lg" />
                  <p className="text-sm text-slate-600">Click para cambiar</p>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-slate-100">
                    <Camera className="h-8 w-8 text-slate-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700">Sube tu imagen</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG hasta 2MB</p>
                  </div>
                </>
              )}
            </label>
          </div>

          {previewUrl && (
            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-700">Imagen seleccionada</p>
                  <p className="text-xs text-emerald-500">Se guardará al guardar el perfil</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  onUseInitials();
                }}
                className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
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

export { AVATAR_PRESETS };
