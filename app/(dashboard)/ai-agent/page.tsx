'use client';

import * as React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  Wallet,
  CreditCard, 
  Download, 
  RefreshCw,
  PiggyBank,
  Bot,
} from 'lucide-react';

interface RevenueAnalytics {
  totalRevenue: number;
  ownerTotal: number;
  aiOperatorTotal: number;
  reinvestmentTotal: number;
  bySource: Record<string, number>;
  dailyRevenue: Array<{ date: string; amount: number }>;
}

interface PendingPayouts {
  owner: number;
  aiOperator: number;
  reinvestment: number;
}

interface RevenueConfig {
  ownerPercentage: number;
  reinvestmentPercentage: number;
  aiOperatorPercentage: number;
  minimumPayout: number;
}

export default function AIAgentDashboard() {
  const { isPremium, isPro } = useAuth();
  const [analytics, setAnalytics] = React.useState<RevenueAnalytics | null>(null);
  const [pendingPayouts, setPendingPayouts] = React.useState<PendingPayouts | null>(null);
  const [config, setConfig] = React.useState<RevenueConfig | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState(30);

  React.useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ai/revenue?action=analytics&days=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
        setPendingPayouts(data.pendingPayouts);
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-2" />
            <p className="text-stone-600">Cargando dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AI Agent Dashboard</h1>
            <p className="text-stone-500">Revenue sharing y transparencia en tiempo real</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setTimeRange(7)}
              className={timeRange === 7 ? 'bg-emerald-50' : ''}
            >
              7D
            </Button>
            <Button
              variant="outline"
              onClick={() => setTimeRange(30)}
              className={timeRange === 30 ? 'bg-emerald-50' : ''}
            >
              30D
            </Button>
            <Button onClick={loadAnalytics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Revenue Split Configuration */}
        {config && (
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="h-6 w-6 text-emerald-600" />
                  <CardTitle>Configuración de Revenue Share</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  Activo
                </Badge>
              </div>
              <CardDescription>
                Distribución automática de ingresos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-white border border-emerald-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Wallet className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium text-stone-600">Tú (Owner)</span>
                  </div>
                  <div className="text-3xl font-bold text-emerald-700">
                    {(config.ownerPercentage * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border border-blue-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <PiggyBank className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-stone-600">Reinversión</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-700">
                    {(config.reinvestmentPercentage * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border border-purple-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bot className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-stone-600">AI Operator</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-700">
                    {(config.aiOperatorPercentage * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Total Revenue */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-stone-500">
                  Ingreso Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${analytics?.totalRevenue.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-stone-500">
                  Tu Share (70%)
                </CardTitle>
                <Wallet className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-700">
                ${analytics?.ownerTotal.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-stone-500">
                  AI Operator (10%)
                </CardTitle>
                <Bot className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">
                ${analytics?.aiOperatorTotal.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-stone-500">
                  Reinversión (20%)
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">
                ${analytics?.reinvestmentTotal.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue by Source */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Fuente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries(analytics?.bySource || {}).map(([source, amount]) => (
                <div key={source} className="text-center p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="text-sm font-medium text-stone-600 capitalize mb-1">
                    {source}
                  </div>
                  <div className="text-2xl font-bold text-stone-900">
                    ${amount.toFixed(2)}
                  </div>
                </div>
              ))}
              {(!analytics?.bySource || Object.keys(analytics.bySource).length === 0) && (
                <div className="col-span-5 text-center py-8 text-stone-500">
                  No hay ingresos registrados aún
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-blue-100">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">
                  ¿Cómo funciona el AI Agent?
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• La IA genera contenido y gestiona marketing automáticamente</li>
                  <li>• Los ingresos se registran y distribuyen en tiempo real</li>
                  <li>• Tú recibes 70%, la IA recibe 10%, 20% se reinvierte</li>
                  <li>• Los pagos se procesan automáticamente cuando superan el mínimo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
