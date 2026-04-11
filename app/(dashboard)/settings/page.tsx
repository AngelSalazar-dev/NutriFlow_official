'use client';

import * as React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { useToast } from '@/components/ui/toast';
import { Bell, Moon, Mail, Shield, Download, Trash2, Globe, ShieldCheck, MailCheck, BellRing, Settings2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

export default function SettingsPage() {
  const { user } = useAuth();
  const { tr, lang, setLang } = useLang();
  const { success } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    weeklyReports: true,
    dataSharing: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    success(tr('ex_add_success') || 'Configuración guardada');
  };

  const handleExportData = () => {
    success(tr('set_priv_export') || 'Exportando datos', tr('landing_hero_subtitle') || 'Tu archivo se descargará pronto');
  };

  const handleDeleteAccount = () => {
    if (confirm(tr('set_acc_delete_confirm') || '¿Estás seguro?')) {
      success(tr('nav_logout'), tr('prof_logout_desc'));
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-32 px-4">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-slate-100 tracking-tighter">
            {tr('nav_settings') || 'Ajustes'}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            {tr('sub_plan_premium_desc') || 'Personaliza tu experiencia en NutriFlow'}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Notifications */}
          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-950 shadow-xl rounded-[2rem] overflow-hidden glass-card">
            <CardHeader className="border-b border-slate-50 dark:border-slate-900/50 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shadow-inner">
                  <BellRing className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                    {tr('set_notif_title') || 'Notificaciones'}
                  </CardTitle>
                  <CardDescription className="font-medium dark:text-slate-400">
                    {tr('sub_plan_premium_desc') || 'Gestiona cómo te mantienes informado'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-0 pt-0">
              {[
                { id: 'notifications', title: tr('set_notif_push') || 'Notificaciones Push', desc: 'Alertas en tiempo real', icon: Bell },
                { id: 'emailNotifications', title: tr('set_notif_email') || 'Correo Electrónico', desc: 'Resúmenes y noticias', icon: Mail },
                { id: 'weeklyReports', title: tr('set_notif_weekly') || 'Reportes Semanales', desc: 'Tu progreso por email', icon: MailCheck },
              ].map((item, i) => (
                <div key={item.id} className={cn(
                  "flex items-center justify-between py-6 group",
                  i !== 0 && "border-t border-slate-50 dark:border-slate-900/50"
                )}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-base font-black text-slate-900 dark:text-slate-100 cursor-pointer">{item.title}</Label>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[item.id as keyof typeof settings]}
                    onCheckedChange={() => handleToggle(item.id as keyof typeof settings)}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-950 shadow-xl rounded-[2rem] overflow-hidden glass-card">
            <CardHeader className="border-b border-slate-50 dark:border-slate-900/50 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-inner">
                  <Settings2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                    {tr('set_app_title') || 'Personalización'}
                  </CardTitle>
                  <CardDescription className="font-medium dark:text-slate-400">
                    {tr('sub_plan_premium_desc') || 'Ajusta la apariencia y el lenguaje'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-0 pt-0">
               <div className="flex items-center justify-between py-6 border-b border-slate-50 dark:border-slate-900/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                      <Moon className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-base font-black text-slate-900 dark:text-slate-100">{tr('set_app_mode') || 'Modo Oscuro'}</Label>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Activado automáticamente</p>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-sm">
                    {tr('sub_status_active') || 'Activo'}
                  </div>
               </div>

               <div className="flex items-center justify-between py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-base font-black text-slate-900 dark:text-slate-100">{tr('set_app_lang') || 'Idioma de Interfaz'}</Label>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Cambiar lenguaje global</p>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800 shadow-sm">
                     {lang === 'es' ? 'Español' : 'English'}
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-950 shadow-xl rounded-[2rem] overflow-hidden glass-card">
            <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shadow-inner">
                  <ShieldCheck className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                    {tr('set_priv_title') || 'Privacidad y Datos'}
                  </CardTitle>
                  <CardDescription className="font-medium dark:text-slate-400">
                    {tr('sub_plan_premium_desc') || 'Tú tienes el control total de tu información'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-0 pt-0">
               <div className="flex items-center justify-between py-6 border-b border-slate-50 dark:border-slate-900/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-base font-black text-slate-900 dark:text-slate-100">{tr('set_priv_share') || 'Compartir Datos Anónimos'}</Label>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Ayuda a mejorar la IA de NutriFlow</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.dataSharing}
                    onCheckedChange={() => handleToggle('dataSharing')}
                    className="data-[state=checked]:bg-emerald-500"
                  />
               </div>
               <div className="py-6">
                 <Button 
                   variant="outline" 
                   className="w-full h-14 rounded-2xl justify-start text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold shadow-sm transition-all active:scale-[0.98]"
                   onClick={handleExportData}
                 >
                   <Download className="h-5 w-5 mr-3 text-emerald-500" />
                   {tr('set_priv_export') || 'Exportar mi Información (JSON)'}
                 </Button>
               </div>
            </CardContent>
          </Card>

          {/* Account Danger Zone */}
          <Card className="border-red-200/50 dark:border-red-900/30 dark:bg-slate-950 shadow-2xl rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-red-50 dark:border-red-900/20 bg-red-50/10 dark:bg-red-900/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shadow-inner">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                    {tr('prof_danger_zone') || 'Cuenta y Seguridad'}
                  </CardTitle>
                  <CardDescription className="text-red-500 font-bold opacity-70">
                    Opciones de gestión irreversible
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-8 px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 gap-4">
                <div>
                   <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Tu Correo Actual</p>
                   <p className="text-lg font-black text-slate-900 dark:text-slate-100">{user?.email}</p>
                </div>
                <div className="px-4 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-black text-slate-600 dark:text-slate-400 shadow-sm">
                   NutriFlow User
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  variant="destructive" 
                  className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-red-500/20 border-0 transition-all active:scale-[0.98]"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="h-5 w-5 mr-3" />
                  {tr('set_acc_delete') || 'Eliminar mi Cuenta Permanentemente'}
                </Button>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 italic text-center px-8">
                  {tr('set_acc_delete_confirm') || 'Esta acción borrará todos tus datos, planes y progresos de forma inmediata.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
