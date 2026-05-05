# Nutriflow - Integración PayPal (Guía Completa)

## 📋 Estado Actual

La integración de PayPal en Nutriflow está **implementada y funcional**. Las credenciales Sandbox están configuradas y la API backend funciona correctamente (crea órdenes y captura pagos). Sin embargo, el frontend tiene un problema conocido con la carga del SDK de PayPal.

---

## ⚠️ Problema Conocido

### Error: "Failed to load the PayPal JS SDK script"

**Descripción:** El componente `PayPalScriptProvider` del paquete `@paypal/react-paypal-js` falla al intentar cargar el SDK en el navegador, mostrando el error:

```
Failed to load the PayPal JS SDK script. Error: The script 
"https://www.paypal.com/sdk/js?client-id=...&currency=USD&intent=capture" 
failed to load.
```

**Causa:** El SDK de PayPal no se está cargando correctamente en Next.js 16 con Turbopack. Posibles causas:
1. Conflictos entre `PayPalScriptProvider` renderizado dentro de `React.lazy` o componentes dinámicos
2. Múltiples instancias de `PayPalScriptProvider` compitiendo por el mismo script
3. El SDK de PayPal no es compatible con la forma en que Turbopack resuelve los scripts externos
4. Restricciones de CORS o Content Security Policy en el entorno de desarrollo local

---

## 🏗️ Arquitectura Actual

### Archivos Implementados

| Archivo | Propósito |
|---------|-----------|
| `app/api/payments/create-order/route.ts` | Crea una orden de pago en PayPal (backend) |
| `app/api/payments/capture-order/route.ts` | Captura el pago y activa el plan automáticamente |
| `components/ui/paypal-checkout.tsx` | Wrapper del componente de botones de PayPal |
| `app/(dashboard)/subscription/page.tsx` | Página de suscripción con botones de PayPal |

### Flujo de Pago (Funcional)

1. Usuario elige plan (Premium $9.99 o Pro $19.99)
2. Clic en botón "Actualizar a Premium" / "Obtener Pro"
3. Se muestra componente `PayPalCheckout` con botones de PayPal
4. Usuario hace clic en "Pay with PayPal"
5. PayPal abre ventana de pago segura
6. Usuario autentica y paga
7. `onApprove` se ejecuta → Llama a `/api/payments/capture-order`
8. Backend verifica el pago con PayPal → Activa el plan en la BD
9. Mensaje de éxito aparece

---

## 🔧 Credenciales Configuradas

### `.env.local`

```env
# PAYPAL (Sandbox - Modo Pruebas)
PAYPAL_CLIENT_ID=Aa_d9myP4gn_LzUoiO6hHmaptmqGoPVy2rBoDiv0FwdbQZob0TYeKRPTxrPkSYv0EaqiPJqofzesvcb3
PAYPAL_SECRET=EK_vPEj64bEgEqn4niIfW2rB-zemQ18JfSCwei5jWpAlmuKszrb5YB4ZHT23X52jXXWcxhAiqCuZ7gJf
```

### Para Producción (Live)

Reemplazar las credenciales Sandbox con las Live:
1. Ir a https://developer.paypal.com
2. Dashboard → Apps → NutriFlow
3. Cambiar a modo "Live"
4. Copiar Client ID y Secret Live
5. Reemplazar en `.env.local`

---

## 💻 Prompt para Solucionar el Error del SDK

```
Estoy trabajando en un proyecto Next.js 16.2.1 con Turbopack que tiene 
integración con PayPal usando @paypal/react-paypal-js.

### Problema
El componente PayPalScriptProvider falla al cargar el SDK con el error:
"Failed to load the PayPal JS SDK script"

La URL del SDK es válida (retorna 200 OK cuando se prueba directamente).

### Stack Actual
- Next.js 16.2.1 (Turbopack, App Router)
- @paypal/react-paypal-js (última versión)
- TypeScript
- Componentes 'use client'

### Arquitectura
- El componente PayPalCheckout está en components/ui/paypal-checkout.tsx
- Usa PayPalScriptProvider con clientId, currency, intent, components
- La API backend funciona correctamente (create-order y capture-order)

### Intentos Fallidos
1. PayPalScriptProvider a nivel del grid de planes → Mismo error
2. PayPalScriptProvider dentro de cada card → Mismo error
3. Componente dedicado PayPalCheckout → Mismo error
4. Verificar credenciales → Válidas (la API backend autentica correctamente)

### Lo que Funciona
- `curl` a la URL del SDK retorna 200 OK con el script correcto
- La API de PayPal para crear órdenes funciona con las mismas credenciales
- Solo falla la carga del script en el navegador

### Posibles Soluciones
1. Cargar el SDK manualmente con <script> tag en el head de layout.tsx
2. Usar dynamic import con ssr: false para el componente de PayPal
3. Verificar si hay CSP (Content Security Policy) bloqueando el script
4. Probar con next/script en lugar de PayPalScriptProvider
5. Verificar si Turbopack tiene problemas conocidos con scripts externos
6. Agregar data-uid único al script del SDK

Necesito que identifiques la causa raíz y proporciones una solución 
funcional que permita mostrar los botones de PayPal correctamente en 
el navegador.
```

---

## 🚀 Mejoras Pendientes

### 1. Webhook de Confirmación
- Crear endpoint `POST /api/payments/webhook` para recibir notificaciones de PayPal
- Activar planes automáticamente incluso si el usuario cierra el navegador
- Verificar firma del webhook para seguridad

### 2. Reintentos Automáticos
- Si la captura falla, reintentar 3 veces antes de mostrar error
- Mostrar estado "Procesando tu pago..." mientras se reintentan

### 3. Historial de Pagos
- Tabla de pagos realizados por el usuario
- Descargar recibos en PDF
- Estado de cada pago (completado, pendiente, fallido)

### 4. Múltiples Monedas
- Soporte para MXN (pesos mexicanos) además de USD
- Conversión automática según la ubicación del usuario

### 5. Suscripciones Recurrentes
- Usar PayPal Subscriptions para cobros automáticos mensuales
- El usuario no necesita pagar manualmente cada mes

### 6. Pruebas con Cuentas Sandbox
- Probar con cuenta de comprador sandbox (`sb-xxxxx@personal.example.com`)
- Probar con cuenta de vendedor sandbox (`sb-xxxxx@business.example.com`)
- Verificar que el flujo completo funciona

---

## 🔐 Seguridad

### Verificaciones Actuales
- ✅ El usuario debe estar autenticado (JWT) para crear una orden
- ✅ El plan debe existir en `PLAN_PRICES`
- ✅ El `orderId` y `planId` se validan antes de capturar
- ✅ Se verifica que el pago esté "COMPLETED" antes de activar

### Mejoras de Seguridad Pendientes
- Verificar el monto del pago capturado contra el precio del plan
- Verificar que el `reference_id` coincida con el userId + planId
- Implementar webhook con verificación de firma HMAC
- Prevenir pagos duplicados (mismo orderId dos veces)

---

## 🧪 Cómo Probar

### Con Cuenta Sandbox
1. Ir a `http://localhost:3000/subscription`
2. Seleccionar un plan (Premium o Pro)
3. Hacer clic en el botón de PayPal
4. Iniciar sesión con la cuenta sandbox:
   - **Email:** `sb-oisvc50462933@business.example.com`
   - **Password:** (la que aparece en developer.paypal.com > Sandbox Accounts)
5. Completar el pago
6. Verificar que el plan se activó

### API Testing (curl)
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"founder@nutriflow.com","password":"NutriFlow2026!"}' \
  -c cookies.txt

# Crear orden
curl -X POST http://localhost:3000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"planId":"premium"}'

# Capturar orden (después de aprobar en PayPal)
curl -X POST http://localhost:3000/api/payments/capture-order \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"orderId":"ORDER_ID_FROM_PAYPAL","planId":"premium"}'
```

---

## 📞 Recursos

- [PayPal Developer Docs](https://developer.paypal.com/docs/)
- [React PayPal SDK](https://github.com/paypal/react-paypal-js)
- [PayPal REST API](https://developer.paypal.com/docs/api/overview/)
- [Sandbox Testing Guide](https://developer.paypal.com/docs/business/test/)

---

*Última actualización: 11 de abril, 2026*
