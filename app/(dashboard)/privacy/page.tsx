'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Política de Privacidad</CardTitle>
            <CardDescription>Última actualización: 28 de marzo de 2026</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-stone max-w-none">
            <h2 className="text-2xl font-semibold mt-6 mb-4">1. Información que Recopilamos</h2>
            <p className="text-stone-600">
              En NutriFlow, recopilamos información para brindarte un mejor servicio:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li><strong>Información de cuenta:</strong> Nombre, email, contraseña</li>
              <li><strong>Información de perfil:</strong> Edad, peso, altura, sexo, nivel de actividad</li>
              <li><strong>Datos de salud:</strong> Registro de alimentos, ejercicios, hidratación</li>
              <li><strong>Datos de uso:</strong> Cómo interactúas con la aplicación</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">2. Cómo Usamos tu Información</h2>
            <p className="text-stone-600">
              Utilizamos tu información para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>Proporcionar y mantener el servicio</li>
              <li>Personalizar tu experiencia</li>
              <li>Calcular tus objetivos nutricionales</li>
              <li>Enviar notificaciones y actualizaciones</li>
              <li>Mejorar nuestros servicios</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">3. Compartir Información</h2>
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 my-4">
              <p className="text-stone-600 font-medium">
                ✅ <strong>No vendemos tu información personal.</strong> Solo compartimos datos con proveedores 
                de servicios necesarios para operar la plataforma.
              </p>
            </div>
            <p className="text-stone-600">
              Podemos compartir información con:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>Proveedores de hosting y almacenamiento</li>
              <li>Procesadores de pago (Stripe)</li>
              <li>Servicios de análisis (Google Analytics)</li>
              <li>Autoridades cuando sea requerido por ley</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">4. Cookies y Tecnologías de Seguimiento</h2>
            <p className="text-stone-600">
              Utilizamos cookies para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>Mantener tu sesión activa</li>
              <li>Personalizar tu experiencia</li>
              <li>Analizar el uso del sitio</li>
            </ul>
            <p className="text-stone-600 mt-4">
              Puedes configurar tu navegador para rechazar cookies, pero algunas funciones del sitio pueden no funcionar correctamente.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">5. Seguridad de Datos</h2>
            <p className="text-stone-600">
              Implementamos medidas de seguridad para proteger tu información:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>Encriptación SSL/TLS para datos en tránsito</li>
              <li>Contraseñas hasheadas con bcrypt</li>
              <li>Acceso restringido a datos personales</li>
              <li>Monitoreo regular de seguridad</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">6. Tus Derechos</h2>
            <p className="text-stone-600">
              Tienes derecho a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>Acceder a tu información personal</li>
              <li>Corregir información incorrecta</li>
              <li>Solicitar eliminación de datos</li>
              <li>Exportar tus datos</li>
              <li>Oponerte al procesamiento de datos</li>
              <li>Retirar tu consentimiento</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-4">7. Retención de Datos</h2>
            <p className="text-stone-600">
              Conservamos tu información mientras tu cuenta esté activa. Puedes solicitar la eliminación 
              de tu cuenta en cualquier momento, y eliminaremos tus datos en 30 días.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">8. Menores de Edad</h2>
            <p className="text-stone-600">
              NutriFlow no está dirigido a menores de 13 años. No recopilamos intencionalmente 
              información de menores de 13 años.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">9. Cambios a esta Política</h2>
            <p className="text-stone-600">
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos de 
              cambios significativos por email o mediante un aviso en la aplicación.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">10. Contacto</h2>
            <p className="text-stone-600">
              Para preguntas sobre esta política de privacidad, contáctanos en:{" "}
              <a href="/contact" className="text-emerald-600 hover:underline">
                /contact
              </a>
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">11. Transferencias Internacionales</h2>
            <p className="text-stone-600">
              Tu información puede ser transferida y procesada en países fuera de tu país de residencia. 
              Nos aseguramos de que todos los proveedores cumplan con estándares adecuados de protección de datos.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-4">12. Cumplimiento Legal</h2>
            <p className="text-stone-600">
              NutriFlow cumple con:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>GDPR (Reglamento General de Protección de Datos - UE)</li>
              <li>CCPA (California Consumer Privacy Act)</li>
              <li>HIPAA (solo para funciones no médicas)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
