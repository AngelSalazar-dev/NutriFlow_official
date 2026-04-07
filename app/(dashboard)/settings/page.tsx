'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Bell, Moon, Mail, Shield, Download, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { success } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    weeklyReports: true,
    dataSharing: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    success('Configuración guardada');
  };

  const handleExportData = () => {
    success('Exportando datos', 'Tu archivo se descargará pronto');
  };

  const handleDeleteAccount = () => {
    // En producción, mostrar confirmación
    success('Solicitud enviada', 'Tu cuenta será eliminada en 30 días');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ajustes</h1>
          <p className="text-slate-500">Configura tu experiencia en NutriFlow</p>
        </div>

        {/* Notificaciones */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle className="text-slate-900">Notificaciones</CardTitle>
                <CardDescription className="text-slate-500">
                  Configura cómo quieres recibir notificaciones
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-700">Notificaciones Push</Label>
                <p className="text-sm text-slate-500">Recibe alertas en tu dispositivo</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={() => handleToggle('notifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-700">Email Notifications</Label>
                <p className="text-sm text-slate-500">Recibe actualizaciones por email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-700">Reporte Semanal</Label>
                <p className="text-sm text-slate-500">Recibe un resumen de tu progreso</p>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={() => handleToggle('weeklyReports')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Apariencia */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle className="text-slate-900">Apariencia</CardTitle>
                <CardDescription className="text-slate-500">
                  Personaliza cómo ves la aplicación
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
              <div>
                <Label className="text-slate-700">Modo Oscuro</Label>
                <p className="text-sm text-slate-500">Esta aplicación usa exclusivamente el tema claro</p>
              </div>
              <Switch checked={false} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Privacidad */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle className="text-slate-900">Privacidad</CardTitle>
                <CardDescription className="text-slate-500">
                  Controla tus datos y privacidad
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-700">Compartir Datos</Label>
                <p className="text-sm text-slate-500">Permitir uso anónimo de datos para mejoras</p>
              </div>
              <Switch
                checked={settings.dataSharing}
                onCheckedChange={() => handleToggle('dataSharing')}
              />
            </div>
            <div className="pt-4 border-t border-slate-200">
              <Button 
                variant="outline" 
                className="w-full justify-start text-slate-700 border-slate-200"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar mis datos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cuenta */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle className="text-slate-900">Cuenta</CardTitle>
                <CardDescription className="text-slate-500">
                  Información de tu cuenta
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-500">Email</Label>
              <p className="text-slate-900">{user?.email}</p>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <Button 
                variant="destructive" 
                className="w-full justify-start bg-red-600 hover:bg-red-700"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar cuenta
              </Button>
              <p className="text-xs text-slate-500 mt-2">
                Esta acción es irreversible. Tu cuenta será eliminada en 30 días.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
