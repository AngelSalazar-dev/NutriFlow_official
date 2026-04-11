'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { useLang } from '@/context/LangContext';

export default function ContactPage() {
  const { tr } = useLang();
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío (en producción, enviar a API)
    setTimeout(() => {
      success('Mensaje enviado', 'Te responderemos pronto');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Contáctanos
          </h1>
          <p className="text-lg text-stone-600">
            ¿Tienes preguntas? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Información de Contacto */}
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="text-stone-900">Información</CardTitle>
              <CardDescription className="text-stone-500">
                Otras formas de contactarnos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-emerald-100">
                  <Mail className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">Email</h3>
                  <p className="text-stone-600">soporte@nutriflow.app</p>
                  <p className="text-sm text-stone-500">Respondemos en 24-48 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">Chat en Vivo</h3>
                  <p className="text-stone-600">Disponible 9am - 6pm EST</p>
                  <p className="text-sm text-stone-500">Tiempo de espera: ~2 min</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">Teléfono</h3>
                  <p className="text-stone-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-stone-500">Lun - Vie, 9am - 5pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-amber-100">
                  <MapPin className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">Oficinas</h3>
                  <p className="text-stone-600">Miami, FL, USA</p>
                  <p className="text-sm text-stone-500">Visitas con cita previa</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de Contacto */}
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="text-stone-900">Envíanos un Mensaje</CardTitle>
              <CardDescription className="text-stone-500">
                Completa el formulario y te responderemos pronto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-stone-700">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre"
                    required
                    className="bg-white border-stone-200 text-stone-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-stone-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    required
                    className="bg-white border-stone-200 text-stone-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-stone-700">Asunto</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="¿En qué podemos ayudarte?"
                    required
                    className="bg-white border-stone-200 text-stone-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-stone-700">Mensaje</Label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Cuéntanos más..."
                    rows={4}
                    required
                    className="flex w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle className="text-stone-900">Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-stone-900">¿Cuánto tardan en responder?</h3>
              <p className="text-stone-600">
                Generalmente respondemos dentro de 24-48 horas hábiles. Para soporte premium, el tiempo de respuesta es prioritario.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-stone-900">¿Puedo cancelar mi suscripción?</h3>
              <p className="text-stone-600">
                Sí, puedes cancelar en cualquier momento desde tu perfil. Mantendrás acceso hasta el final de tu período de facturación.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-stone-900">¿Ofrecen reembolsos?</h3>
              <p className="text-stone-600">
                Ofrecemos garantía de devolución de 14 días para el plan {tr('sub_plan_pro_name')}. Para otros planes, contacta a soporte.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
