'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Términos y Condiciones</CardTitle>
            <CardDescription>Última actualización: 28 de marzo de 2026</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-stone max-w-none">
            <h2 className="text-2xl font-semibold mt-6 mb-4">1. Aceptación de los Términos</h2>
            <p className="text-stone-600">
              Al acceder y utilizar NutriFlow, aceptas estar bound por estos Términos y Condiciones de Uso. 
              Si no estás de acuerdo con estos términos, por favor no utilices nuestro servicio.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">2. Descripción del Servicio</h2>
            <p className="text-stone-600">
              NutriFlow es una plataforma de salud y bienestar que proporciona:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>Seguimiento de nutrición y calorías</li>
              <li>Registro de ejercicios y actividad física</li>
              <li>Chat con asistente de IA para nutrición</li>
              <li>Artículos educativos sobre salud</li>
              <li>Estadísticas y progreso personal</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">3. Registro de Cuenta</h2>
            <p className="text-stone-600">
              Para utilizar NutriFlow, debes crear una cuenta proporcionando información precisa y completa. 
              Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">4. Suscripciones y Pagos</h2>
            <p className="text-stone-600">
              NutriFlow ofrece planes gratuitos y de pago:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li><strong>Gratuito:</strong> Funciones básicas con anuncios</li>
              <li><strong>Premium ($9.99/mes):</strong> Sin anuncios, chat ilimitado, módulo de ejercicio</li>
              <li><strong>{tr('sub_plan_pro_name')} ($19.99/mes):</strong> Todas las funciones, historial ilimitado, exportación de datos</li>
            </ul>
            <p className="text-stone-600 mt-4">
              Las suscripciones se renuevan automáticamente. Puedes cancelar en cualquier momento desde tu perfil.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">5. Descargo de Responsabilidad Médica</h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
              <p className="text-stone-600 font-medium">
                ⚠️ NutriFlow NO es un servicio médico profesional. La información proporcionada es solo para fines 
                informativos y educativos. Siempre consulta con un profesional de la salud antes de comenzar 
                cualquier programa de nutrición o ejercicio.
              </p>
            </div>

            <h2 className="text-2xl font-semibold mt-6 mb-4">6. Propiedad Intelectual</h2>
            <p className="text-stone-600">
              Todo el contenido de NutriFlow, incluyendo texto, gráficos, logotipos y software, es propiedad de 
              NutriFlow o sus licenciantes y está protegido por leyes de derechos de autor.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">7. Limitación de Responsabilidad</h2>
            <p className="text-stone-600">
              NutriFlow no será responsable por daños directos, indirectos, incidentales o consecuentes que resulten 
              del uso o incapacidad de uso del servicio.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">8. Modificaciones</h2>
            <p className="text-stone-600">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en 
              vigor inmediatamente después de su publicación en la plataforma.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">9. Ley Aplicable</h2>
            <p className="text-stone-600">
              Estos términos se regirán por las leyes de la jurisdicción donde opera NutriFlow.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">10. Contacto</h2>
            <p className="text-stone-600">
              Para preguntas sobre estos términos, contáctanos en:{" "}
              <a href="/contact" className="text-emerald-600 hover:underline">
                /contact
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
