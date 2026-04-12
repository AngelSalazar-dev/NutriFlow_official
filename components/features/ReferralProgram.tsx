'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Copy, Check, Crown, Loader2, Share2, Gift, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

interface ReferralStats {
  code: string;
  link: string;
  totalReferrals: number;
  rewardedReferrals: number;
}

const REWARDS = [
  { referrals: 1, reward: '3 días Premium', icon: Gift, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
  { referrals: 3, reward: '1 semana Premium', icon: TrendingUp, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/20' },
  { referrals: 5, reward: '1 mes Premium', icon: Crown, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
  { referrals: 10, reward: 'Premium Lifetime', icon: Sparkles, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
];

export function ReferralProgram() {
  const [stats, setStats] = React.useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);

  React.useEffect(() => {
    loadReferralCode();
  }, []);

  const loadReferralCode = async () => {
    try {
      const response = await fetch('/api/referral/my-code');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading referral code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!stats) return;
    try {
      await navigator.clipboard.writeText(stats.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Error copying');
    }
  };

  const shareReferral = async () => {
    if (!stats) return;
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Únete a NutriFlow',
          text: 'Únete a NutriFlow y obtén acceso gratuito a la mejor plataforma de nutrición y ejercicio. Usa mi código:',
          url: stats.link,
        });
      } else {
        copyToClipboard();
      }
    } catch {
      console.error('Error sharing');
    } finally {
      setIsSharing(false);
    }
  };

  const nextRewardIndex = REWARDS.findIndex((r) => r.referrals > (stats?.totalReferrals || 0));
  const currentReward = nextRewardIndex > 0 ? REWARDS[nextRewardIndex - 1] : null;
  const nextReward = nextRewardIndex >= 0 ? REWARDS[nextRewardIndex] : null;
  const progress = nextReward ? ((stats?.totalReferrals || 0) / nextReward.referrals) * 100 : 100;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-2xl rounded-[2rem]">
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-2xl overflow-hidden rounded-[2rem]">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-xl">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <CardTitle className="text-2xl font-heading font-black tracking-tight">Programa de Referidos</CardTitle>
            <CardDescription className="text-emerald-100 text-sm mt-0.5">Gana Premium invitando amigos</CardDescription>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {stats && (
          <>
            {/* Referral Code & Link */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Tu código</p>
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 font-mono text-sm px-3 py-1">
                  {stats.code}
                </Badge>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 font-mono text-xs break-all text-slate-700 dark:text-slate-300">
                  {stats.link}
                </div>
                <Button onClick={copyToClipboard} variant="outline" className="h-12 w-12 rounded-2xl border-slate-200 dark:border-slate-700 shrink-0 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600">
                  {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                </Button>
                <Button onClick={shareReferral} disabled={isSharing} className="h-12 w-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shrink-0 shadow-lg shadow-emerald-500/20">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.totalReferrals}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mt-1 tracking-wider">Total</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <p className="text-3xl font-black text-teal-600 dark:text-teal-400">{stats.rewardedReferrals}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mt-1 tracking-wider">Premiados</p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <p className="text-3xl font-black text-slate-500 dark:text-slate-400">{stats.totalReferrals - stats.rewardedReferrals}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mt-1 tracking-wider">Pendientes</p>
              </div>
            </div>

            {/* Progress */}
            {nextReward && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-200 dark:border-violet-800 space-y-3">
                <div className="flex justify-between items-center">
                  {currentReward ? (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{currentReward.reward} ✅</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-violet-700 dark:text-violet-300">Próxima recompensa</span>
                  )}
                  <span className="text-xs font-black text-violet-600 dark:text-violet-400">
                    {nextReward.referrals - (stats.totalReferrals || 0)} más
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={progress} className="h-3 flex-1" />
                  <span className="text-sm font-black text-violet-700 dark:text-violet-300">{Math.round(progress)}%</span>
                </div>
                <p className="text-[10px] uppercase font-bold text-violet-500 dark:text-violet-400 text-center tracking-widest">
                  Meta: {nextReward.reward} ({nextReward.referrals} referidos)
                </p>
              </div>
            )}

            {nextRewardIndex === -1 && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-2 border-amber-200 dark:border-amber-800 text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-xl">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <p className="text-xl font-heading font-black text-amber-900 dark:text-amber-100">¡Nivel Máximo Alcanzado!</p>
                <p className="text-sm text-amber-700 dark:text-amber-400">Tienes Premium Lifetime</p>
              </div>
            )}
          </>
        )}

        {/* Rewards Tiers */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 text-center">Recompensas Disponibles</p>
          <div className="grid grid-cols-2 gap-3">
            {REWARDS.map((tier, index) => {
              const Icon = tier.icon;
              const isUnlocked = (stats?.totalReferrals || 0) >= tier.referrals;

              return (
                <div
                  key={index}
                  className={`relative p-4 rounded-2xl border-2 transition-all ${
                    isUnlocked
                      ? `${tier.bg} border-emerald-300 dark:border-emerald-700 shadow-md`
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isUnlocked && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-3 ${isUnlocked ? '' : 'opacity-50'}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className={`text-sm font-bold ${isUnlocked ? 'text-emerald-800 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400'}`}>
                    {tier.reward}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mt-0.5 tracking-wider">
                    {tier.referrals} {tier.referrals === 1 ? 'referido' : 'referidos'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Tip */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 text-center">
          <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
            <strong className="text-emerald-900 dark:text-emerald-200">🎁 Bonus para amigos:</strong> Tus referidos también obtienen <strong>7 días Premium gratis</strong> al registrarse con tu código.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReferralProgram;
