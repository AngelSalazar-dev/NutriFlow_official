'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AvatarSelector } from '@/components/ui/AvatarSelector';
import { AVATAR_PRESETS } from '@/components/ui/AvatarSelector';
import { cn } from '@/lib/cn';
import {
  User,
  Save,
  Loader2,
  Crown,
  Zap,
  Target,
  Activity,
  Scale,
  Ruler,
  Calendar,
  Mail,
  Flame,
  TrendingUp,
  CheckCircle,
  LogOut,
  AlertTriangle,
  Shield,
  Clock,
  Award,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentario (poco o nada de ejercicio)', multiplier: 1.2 },
  { value: 'light', label: 'Ligero (ejercicio 1-3 días/semana)', multiplier: 1.375 },
  { value: 'moderate', label: 'Moderado (ejercicio 3-5 días/semana)', multiplier: 1.55 },
  { value: 'active', label: 'Activo (ejercicio 6-7 días/semana)', multiplier: 1.725 },
  { value: 'very_active', label: 'Muy activo (ejercicio muy intenso)', multiplier: 1.9 },
];

const GOALS = [
  { value: 'lose', label: 'Perder peso', icon: '🔥', adj: -500 },
  { value: 'maintain', label: 'Mantener peso', icon: '⚖️', adj: 0 },
  { value: 'gain', label: 'Ganar masa muscular', icon: '💪', adj: 300 },
];

export default function ProfilePage() {
  const { user, updateUser, logout, updateAvatar, isPremium, isPro } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [avatarMessage, setAvatarMessage] = React.useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [avatarType, setAvatarType] = React.useState<string>(user?.avatarType || 'initials');
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(user?.avatarUrl || null);

  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    age: user?.age || 25,
    sex: user?.sex || 'male',
    weight: user?.weight || 70,
    height: user?.height || 170,
    activityLevel: user?.activityLevel || 'sedentary',
    goal: user?.goal || 'maintain',
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || 25,
        sex: user.sex || 'male',
        weight: user.weight || 70,
        height: user.height || 170,
        activityLevel: user.activityLevel || 'sedentary',
        goal: user.goal || 'maintain',
      });
    }
  }, [user]);

  // Calcular BMR (Mifflin-St Jeor)
  const calculateBMR = () => {
    const { age, sex, weight, height } = formData;
    if (!age || !weight || !height) return 0;
    if (sex === 'male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    }
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  };

  // Calcular TDEE
  const calculateTDEE = () => {
    const bmr = calculateBMR();
    const level = ACTIVITY_LEVELS.find(l => l.value === formData.activityLevel);
    return level ? Math.round(bmr * level.multiplier) : 0;
  };

  // Calcular objetivo calórico según meta
  const calculateCalorieGoal = () => {
    const tdee = calculateTDEE();
    const goal = GOALS.find(g => g.value === formData.goal);
    return tdee + (goal?.adj || 0);
  };

  const bmr = calculateBMR();
  const tdee = calculateTDEE();
  const calorieGoal = calculateCalorieGoal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await updateUser({ ...formData, tdee, bmr, calorieGoal });
      setMessage('Perfil actualizado correctamente');
    } catch (error: any) {
      setMessage(error.message || 'Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleSelectPreset = async (presetId: string) => {
    setIsAvatarLoading(true);
    setAvatarMessage('');
    try {
      await updateAvatar('preset', presetId);
      setAvatarType('preset');
      setAvatarUrl(presetId);
      setAvatarMessage('✅ Avatar actualizado');
      setTimeout(() => setAvatarMessage(''), 3000);
    } catch (err: any) {
      setAvatarMessage('❌ ' + (err.message || 'Error al cambiar avatar'));
    } finally {
      setIsAvatarLoading(false);
    }
  };

  const handleUploadImage = async (dataUrl: string) => {
    setIsAvatarLoading(true);
    setAvatarMessage('');
    try {
      await updateAvatar('custom', dataUrl);
      setAvatarType('custom');
      setAvatarUrl(dataUrl);
      setAvatarMessage('✅ Imagen subida correctamente');
      setTimeout(() => setAvatarMessage(''), 3000);
    } catch (err: any) {
      setAvatarMessage('❌ ' + (err.message || 'Error al subir imagen'));
    } finally {
      setIsAvatarLoading(false);
    }
  };

  const handleUseInitials = async () => {
    setIsAvatarLoading(true);
    setAvatarMessage('');
    try {
      await updateAvatar('initials');
      setAvatarType('initials');
      setAvatarUrl(null);
      setAvatarMessage('✅ Avatar de iniciales activado');
      setTimeout(() => setAvatarMessage(''), 3000);
    } catch (err: any) {
      setAvatarMessage('❌ ' + (err.message || 'Error'));
    } finally {
      setIsAvatarLoading(false);
    }
  };

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-extrabold text-slate-900 tracking-tighter">
              Mi Perfil
            </h1>
            <p className="text-lg text-slate-500">
              Gestiona tu información personal y objetivos
            </p>
          </div>
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>

        {/* Logout Confirmation */}
        {showLogoutConfirm && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900">¿Cerrar sesión?</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Tendrás que volver a iniciar sesión para acceder a tu cuenta.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-200"
                    onClick={() => setShowLogoutConfirm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Card */}
        <Card className="border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 h-32 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0yMGgtNjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-50" />
          </div>
          <CardContent className="pt-0 -mt-16 relative">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
                  {avatarType === 'preset' && avatarUrl ? (
                    (() => {
                      const preset = AVATAR_PRESETS.find(p => p.id === avatarUrl);
                      return preset ? preset.render(128) : (
                        <span className="text-white text-4xl font-bold">{initials}</span>
                      );
                    })()
                  ) : avatarType === 'custom' && avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-4xl font-bold">{initials}</span>
                  )}
                </div>
                {isPro && (
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                    <Crown className="h-3 w-3" /> PRO
                  </div>
                )}
                {isPremium && !isPro && (
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                    <Crown className="h-3 w-3" /> Premium
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pt-4 md:pt-16">
                <h2 className="text-3xl font-heading font-bold text-slate-900">{user.name}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> Desde {memberSince}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-100">
                  <Flame className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{calorieGoal}</div>
                  <div className="text-xs text-slate-500">kcal/día (objetivo)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100">
                  <Zap className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{tdee}</div>
                  <div className="text-xs text-slate-500">TDEE (gasto total)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{bmr}</div>
                  <div className="text-xs text-slate-500">BMR (metabolismo)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-violet-100">
                  <TrendingUp className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 capitalize">{formData.goal === 'lose' ? 'Perder' : formData.goal === 'gain' ? 'Ganar' : 'Mantener'}</div>
                  <div className="text-xs text-slate-500">Objetivo actual</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Body Info & Plan */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="h-5 w-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-500">Peso</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{formData.weight} <span className="text-lg text-slate-400">kg</span></div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Ruler className="h-5 w-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-500">Altura</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{formData.height} <span className="text-lg text-slate-400">cm</span></div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-500">Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-slate-900 capitalize">{user.subscriptionPlan}</span>
                {user.subscriptionPlan === 'pro' && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" /> Máximo
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Avatar Selector Card */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-slate-900">Tu Avatar</CardTitle>
                <CardDescription className="text-slate-500">
                  Elige un avatar con personalidad o sube tu propia imagen
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {avatarMessage && (
              <div className={cn(
                'mb-4 p-3 text-sm rounded-xl border transition-all',
                avatarMessage.startsWith('✅')
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              )}>
                {avatarMessage}
              </div>
            )}
            {isAvatarLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : (
              <AvatarSelector
                currentAvatar={avatarUrl}
                currentType={avatarType}
                onSelectPreset={handleSelectPreset}
                onUploadImage={handleUploadImage}
                onUseInitials={handleUseInitials}
              />
            )}
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-slate-900">Editar Perfil</CardTitle>
                <CardDescription className="text-slate-500">
                  Actualiza tu información para recalcular tus objetivos automáticamente
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Nombre completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                />
              </div>

              {/* Age + Sex */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-slate-700 font-medium">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    min="10"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    required
                    className="h-12 rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex" className="text-slate-700 font-medium">Sexo</Label>
                  <select
                    id="sex"
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value as 'male' | 'female' })}
                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    required
                  >
                    <option value="male">♂️ Hombre</option>
                    <option value="female">♀️ Mujer</option>
                  </select>
                </div>
              </div>

              {/* Weight + Height */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-slate-700 font-medium">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    required
                    className="h-12 rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-slate-700 font-medium">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="100"
                    max="250"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    required
                    className="h-12 rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div className="space-y-2">
                <Label htmlFor="activityLevel" className="text-slate-700 font-medium">Nivel de actividad física</Label>
                <div className="grid gap-2">
                  {ACTIVITY_LEVELS.map((level) => (
                    <label
                      key={level.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.activityLevel === level.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="activityLevel"
                        value={level.value}
                        checked={formData.activityLevel === level.value}
                        onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
                        className="sr-only"
                      />
                      <CheckCircle
                        className={`h-5 w-5 shrink-0 ${
                          formData.activityLevel === level.value
                            ? 'text-emerald-600'
                            : 'text-slate-300'
                        }`}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-slate-900">{level.label}</span>
                        <span className="text-xs text-slate-400 ml-2">(×{level.multiplier})</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-slate-700 font-medium">Objetivo</Label>
                <div className="grid md:grid-cols-3 gap-3">
                  {GOALS.map((goal) => (
                    <label
                      key={goal.value}
                      className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.goal === goal.value
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={goal.value}
                        checked={formData.goal === goal.value}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
                        className="sr-only"
                      />
                      <span className="text-3xl">{goal.icon}</span>
                      <span className="text-sm font-medium text-slate-900 text-center">{goal.label}</span>
                      <span className="text-xs text-slate-400">
                        {goal.adj > 0 ? '+' : ''}{goal.adj} kcal
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Calculated Preview */}
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="pt-6">
                  <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Target className="h-4 w-4 text-emerald-600" />
                    Vista previa de tus objetivos calculados
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">{bmr}</div>
                      <div className="text-xs text-slate-500 mt-1">BMR (kcal)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal-600">{tdee}</div>
                      <div className="text-xs text-slate-500 mt-1">TDEE (kcal)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-700">{calorieGoal}</div>
                      <div className="text-xs text-slate-500 mt-1">Objetivo (kcal)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Message */}
              {message && (
                <div className={`p-4 text-sm rounded-xl border ${
                  message.includes('Error')
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-100">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-red-700">Zona de peligro</CardTitle>
                <CardDescription className="text-red-500">
                  Acciones que afectan tu cuenta permanentemente
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
