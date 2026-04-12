'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
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
  Gift,
  Copy,
  Check,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser, logout, updateAvatar, isPremium, isPro } = useAuth();
  const { tr, lang } = useLang();
  const router = useRouter();

  const ACTIVITY_LEVELS = [
    { value: 'sedentary', label: tr('profile_activity_sedentary') || 'Sedentario', multiplier: 1.2 },
    { value: 'light', label: tr('profile_activity_light') || 'Ligero', multiplier: 1.375 },
    { value: 'moderate', label: tr('profile_activity_moderate') || 'Moderado', multiplier: 1.55 },
    { value: 'active', label: tr('profile_activity_active') || 'Activo', multiplier: 1.725 },
    { value: 'very_active', label: tr('profile_activity_very_active') || 'Muy activo', multiplier: 1.9 },
  ];

  const GOALS = [
    { value: 'lose', label: tr('auth_goal_lose') || 'Perder peso', icon: '🔥', adj: -500 },
    { value: 'maintain', label: tr('auth_goal_maintain') || 'Mantener peso', icon: '⚖️', adj: 0 },
    { value: 'gain', label: tr('auth_goal_gain') || 'Ganar masa muscular', icon: '💪', adj: 300 },
  ];
  const [isLoading, setIsLoading] = React.useState(false);
  const [referralCode, setReferralCode] = React.useState<string | null>(null);
  const [copiedReferral, setCopiedReferral] = React.useState(false);

  React.useEffect(() => {
    loadReferralCode();
  }, []);

  const loadReferralCode = async () => {
    try {
      const res = await fetch('/api/referral/my-code', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setReferralCode(data.code || user?.referralCode || null);
      }
    } catch {
      console.error('Error loading referral code');
    }
  };

  const copyReferralCode = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    } catch {
      console.error('Error copying referral code');
    }
  };
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
      setAvatarType(user.avatarType || 'initials');
      setAvatarUrl(user.avatarUrl || null);
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
    ? new Date(user.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tracking-tighter">
              {tr('nav_profile')}
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              {tr('profile_activity')}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 gap-2"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="h-4 w-4" />
            {tr('nav_logout') || 'Cerrar sesión'}
          </Button>
        </div>

        {/* Logout Confirmation */}
        {showLogoutConfirm && (
          <Card className="border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">{tr('nav_logout')}?</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    {tr('profile_activity')}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-200 dark:border-amber-800 dark:text-amber-400"
                    onClick={() => setShowLogoutConfirm(false)}
                  >
                    {tr('common_back')}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg shadow-red-500/20"
                    onClick={handleLogout}
                  >
                    {tr('nav_logout')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Card */}
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 h-32 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0yMGgtNjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-30" />
          </div>
          <CardContent className="pt-0 -mt-16 relative">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
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
                    <Crown className="h-3 w-3" /> {tr('sub_plan_pro_name')}
                  </div>
                )}
                {isPremium && !isPro && (
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                    <Crown className="h-3 w-3" /> {tr('sub_plan_premium_name')}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pt-4 md:pt-16">
                <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100">{user.name}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1.5 capitalize">
                    <Calendar className="h-4 w-4" /> {tr('profile_activity')} {memberSince}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 border-b-4 border-b-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/30">
                  <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{calorieGoal}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">kcal/{tr('common_back')} ({tr('common_confirm')})</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 border-b-4 border-b-emerald-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{tdee}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">TDEE ({tr('food_nutrient_density')})</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 border-b-4 border-b-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{bmr}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">BMR ({tr('food_nutrient_density')})</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 border-b-4 border-b-violet-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/30">
                  <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 capitalize">
                    {GOALS.find(g => g.value === formData.goal)?.label || formData.goal}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{tr('common_confirm')} {tr('common_back')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Body Info & Plan */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{tr('auth_weight') || 'Peso'}</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{formData.weight} <span className="text-lg text-slate-400">kg</span></div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Ruler className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{tr('auth_height') || 'Altura'}</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{formData.height} <span className="text-lg text-slate-400">cm</span></div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{tr('nav_subscription') || 'Plan'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 capitalize">
                  {user.subscriptionPlan === 'pro' ? tr('sub_plan_pro_name') : 
                   user.subscriptionPlan === 'premium' ? tr('sub_plan_premium_name') : 
                   tr('sub_plan_free_name')}
                </span>
                {user.subscriptionPlan === 'pro' && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" /> {tr('sub_plan_pro_name')}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Referral Code Card */}
          <Card className="border-0 shadow-xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600">
            <CardContent className="p-6 text-white relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">Código de Referido</p>
                    <p className="text-lg font-heading font-black tracking-tight">Comparte y gana Premium</p>
                  </div>
                </div>

                {referralCode ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-emerald-200 tracking-widest">Tu código</p>
                        <p className="text-2xl font-heading font-black tracking-wider">{referralCode}</p>
                      </div>
                      <Button
                        onClick={copyReferralCode}
                        className="h-12 w-12 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/30 shrink-0"
                        size="icon"
                      >
                        {copiedReferral ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      </Button>
                    </div>
                    <p className="text-xs text-emerald-100 text-center">
                      🎁 Tus amigos obtienen <strong>7 días Premium</strong> al registrarse
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Avatar Selector Card */}
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-slate-900 dark:text-slate-100">{tr('prof_avatar') || 'Avatar de Perfil'}</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  {tr('landing_hero_subtitle')}
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
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-slate-900 dark:text-slate-100">{tr('prof_title') || 'Editar Perfil'}</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  {tr('landing_hero_subtitle')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-500" />
                  {tr('nav_profile')}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:ring-emerald-500 dark:text-slate-200"
                />
              </div>

              {/* Age + Sex */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="age" className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    {tr('common_back')}
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="10"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    required
                    className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:ring-emerald-500 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="sex" className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    {tr('dash_no_weekly_data')}
                  </Label>
                  <select
                    id="sex"
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value as 'male' | 'female' })}
                    className="flex h-12 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-200"
                    required
                  >
                    <option value="male" className="dark:bg-slate-900">♂️ {tr('common_back')}</option>
                    <option value="female" className="dark:bg-slate-900">♀️ {tr('common_back')}</option>
                  </select>
                </div>
              </div>

              {/* Weight + Height */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2">
                    <Scale className="h-4 w-4 text-emerald-500" />
                    {tr('comming_soon')} (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    required
                    className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:ring-emerald-500 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="height" className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-emerald-500" />
                    {tr('comming_soon')} (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    min="100"
                    max="250"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    required
                    className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:ring-emerald-500 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div className="space-y-4">
                <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300 font-bold text-sm">
                  {tr('profile_activity')}
                </Label>
                <div className="grid gap-3">
                  {ACTIVITY_LEVELS.map((level) => (
                    <label
                      key={level.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.activityLevel === level.value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 shadow-md shadow-emerald-500/5'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
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
                        className={`h-5 w-5 shrink-0 transition-colors ${
                          formData.activityLevel === level.value
                            ? 'text-emerald-600'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{level.label}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">(×{level.multiplier})</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="space-y-4">
                <Label htmlFor="goal" className="text-slate-700 dark:text-slate-300 font-bold text-sm">
                  {tr('common_confirm')}
                </Label>
                <div className="grid md:grid-cols-3 gap-4">
                  {GOALS.map((goal) => (
                    <label
                      key={goal.value}
                      className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.goal === goal.value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 shadow-lg shadow-emerald-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
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
                      <span className="text-3xl filter drop-shadow-sm">{goal.icon}</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100 text-center">{goal.label}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {goal.adj > 0 ? '+' : ''}{goal.adj} kcal
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Calculated Preview */}
              <Card className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-inner">
                <CardContent className="pt-6">
                  <h4 className="text-sm font-black text-slate-700 dark:text-slate-300 mb-6 flex items-center justify-center gap-2 uppercase tracking-widest opacity-70">
                    <Target className="h-4 w-4 text-emerald-600" />
                    {tr('dash_action_analytics') || 'Vista Previa'}
                  </h4>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-500">{bmr}</div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2">BMR (kcal)</div>
                    </div>
                    <div className="space-y-1 border-x border-slate-200 dark:border-slate-800">
                      <div className="text-2xl font-black text-teal-600 dark:text-teal-500">{tdee}</div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2">TDEE (kcal)</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{calorieGoal}</div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2">{tr('common_confirm')} (kcal)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Message */}
              {message && (
                <div className={`p-4 text-sm font-medium rounded-xl border transition-all animate-in fade-in slide-in-from-top-2 ${
                  message.includes('Error')
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30'
                    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30'
                }`}>
                  {message}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl shadow-emerald-500/20 border-0 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {tr('landing_start_button')}...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    {tr('common_confirm')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-900/30 bg-red-50/10 dark:bg-red-900/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30">
                <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-red-700 dark:text-red-300">{tr('prof_danger_zone') || 'Zona de Peligro'}</CardTitle>
                <CardDescription className="text-red-500 dark:text-red-400/70">
                  {tr('common_back') || 'Opciones irrevocables'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full h-12 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 gap-2 font-bold"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut className="h-5 w-5" />
              {tr('nav_logout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
