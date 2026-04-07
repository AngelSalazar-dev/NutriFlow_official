'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Gift, TrendingUp, Copy, Check, Crown, Loader2, Share2 } from 'lucide-react';

interface ReferralStats {
  code: string;
  link: string;
  totalReferrals: number;
  rewardedReferrals: number;
}

const REWARDS = [
  { referrals: 1, reward: '3 días Premium', icon: Gift },
  { referrals: 3, reward: '1 semana Premium', icon: TrendingUp },
  { referrals: 5, reward: '1 mes Premium', icon: Crown },
  { referrals: 10, reward: 'Premium Lifetime', icon: Users },
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
    } catch (error) {
      console.error('Error copying to clipboard:', error);
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
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const nextRewardIndex = REWARDS.findIndex(
    (r) => r.referrals > (stats?.totalReferrals || 0)
  );

  const currentReward = nextRewardIndex > 0 ? REWARDS[nextRewardIndex - 1] : null;
  const nextReward = nextRewardIndex >= 0 ? REWARDS[nextRewardIndex] : null;

  const progress = nextReward
    ? ((stats?.totalReferrals || 0) / nextReward.referrals) * 100
    : 100;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Programa de Referidos</CardTitle>
            <CardDescription>
              Gana Premium gratis invitando amigos
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Your Referral Code */}
        {stats && (
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-emerald-800">Tu código:</span>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  {stats.code}
                </Badge>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 p-3 rounded bg-white border border-emerald-200 font-mono text-sm break-all">
                  {stats.link}
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={shareReferral}
                  variant="default"
                  size="icon"
                  disabled={isSharing}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-stone-50">
                <div className="text-2xl font-bold text-emerald-700">
                  {stats.totalReferrals}
                </div>
                <div className="text-xs text-stone-500">Total Referidos</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-stone-50">
                <div className="text-2xl font-bold text-emerald-700">
                  {stats.rewardedReferrals}
                </div>
                <div className="text-xs text-stone-500">Con Recompensa</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-stone-50">
                <div className="text-2xl font-bold text-emerald-700">
                  {stats.totalReferrals - stats.rewardedReferrals}
                </div>
                <div className="text-xs text-stone-500">Pendientes</div>
              </div>
            </div>

            {/* Progress to Next Reward */}
            {nextReward && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">
                    {currentReward ? (
                      <>
                        ✅ {currentReward.reward} logrado
                      </>
                    ) : (
                      'Próxima recompensa:'
                    )}
                  </span>
                  <span className="font-medium text-emerald-700">
                    {nextReward.referrals - (stats?.totalReferrals || 0)} más para {nextReward.reward}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {nextRewardIndex === -1 && (
              <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 text-center">
                <Crown className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="font-semibold text-amber-900">¡Nivel Máximo Alcanzado!</p>
                <p className="text-sm text-amber-700">Tienes Premium Lifetime</p>
              </div>
            )}
          </div>
        )}

        {/* Rewards Table */}
        <div>
          <h3 className="font-semibold mb-3">Recompensas Disponibles</h3>
          <div className="space-y-2">
            {REWARDS.map((tier, index) => {
              const Icon = tier.icon;
              const isUnlocked = (stats?.totalReferrals || 0) >= tier.referrals;
              const isNext = tier.referrals === nextReward?.referrals;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isUnlocked
                      ? 'bg-emerald-50 border-emerald-200'
                      : isNext
                      ? 'bg-stone-50 border-stone-300'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        isUnlocked
                          ? 'bg-emerald-600'
                          : isNext
                          ? 'bg-stone-400'
                          : 'bg-stone-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tier.reward}</p>
                      <p className="text-xs text-stone-500">
                        {tier.referrals} {tier.referrals === 1 ? 'referido' : 'referidos'}
                      </p>
                    </div>
                  </div>
                  {isUnlocked && (
                    <Check className="h-5 w-5 text-emerald-600" />
                  )}
                  {isNext && !isUnlocked && (
                    <span className="text-xs font-medium text-stone-600">
                      {tier.referrals - (stats?.totalReferrals || 0)} faltantes
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-stone-600 text-center w-full">
          <p>
            🎁 Tus amigos también obtienen <strong>7 días Premium</strong> cuando se registran con tu código.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ReferralProgram;
