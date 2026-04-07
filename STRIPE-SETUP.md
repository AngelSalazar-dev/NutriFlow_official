# 🏦 Configuración de Stripe para NutriFlow

Esta guía te ayudará a configurar Stripe para aceptar pagos en tu aplicación NutriFlow.

## 📋 Paso 1: Crear Cuenta en Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Crea una cuenta gratuita
3. Activa el **Modo Test** (toggle en la esquina superior izquierda)

## 🔑 Paso 2: Obtener Claves API

### Claves de Test (Desarrollo)

1. En Stripe Dashboard, ve a **Developers → API keys**
2. Copia las siguientes claves:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### Agregar al archivo `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
```

## 🎯 Paso 3: Crear Productos en Stripe

### Opción A: Desde el Dashboard

1. Ve a **Products → Add product**
2. Crea el producto **NutriFlow Premium**:
   - Name: `NutriFlow Premium`
   - Price: `$9.99`
   - Billing: `Recurring` → `Monthly`

3. Crea el producto **NutriFlow Pro**:
   - Name: `NutriFlow Pro`
   - Price: `$19.99`
   - Billing: `Recurring` → `Monthly`

### Opción B: Desde la API

```bash
curl https://api.stripe.com/v1/products \
  -u sk_test_YOUR_SECRET_KEY: \
  -d "name=NutriFlow Premium" \
  -d "description=Suscripción mensual Premium"

curl https://api.stripe.com/v1/prices \
  -u sk_test_YOUR_SECRET_KEY: \
  -d "product=prod_..." \
  -d "unit_amount=999" \
  -d "currency=usd" \
  -d "recurring[interval]=month"
```

## 🔔 Paso 4: Configurar Webhooks

### Para Desarrollo Local

1. **Instala Stripe CLI**:

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (PowerShell como administrador)
winget install Stripe.StripeCLI

# O descarga desde: https://github.com/stripe/stripe-cli/releases
```

2. **Login en Stripe CLI**:

```bash
stripe login
```

3. **Escuchar eventos localmente**:

```bash
stripe listen --forward-to localhost:3000/api/subscriptions/webhook
```

Verás un mensaje como:
```
Ready! Your webhook signing secret is whsec_xxxxx
```

4. **Agrega el webhook secret a `.env.local`**:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx (copia el que te dio Stripe CLI)
```

### Para Producción (Vercel)

1. En Stripe Dashboard, ve a **Developers → Webhooks**
2. Click en **Add endpoint**
3. Configura:
   - **Endpoint URL**: `https://tu-dominio.com/api/subscriptions/webhook`
   - **Events to send**:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
4. Copia el **Signing secret** y agrégalo a tus variables de entorno en Vercel:

```
STRIPE_WEBHOOK_SECRET=whsec_produccion_xxxxx
```

## 🧪 Paso 5: Testing

### Tarjetas de Test

Stripe provee tarjetas de test para desarrollo:

| Número | Propósito |
|--------|-----------|
| `4242 4242 4242 4242` | Pago exitoso |
| `4000 0000 0000 9995` | Pago declinado |
| `4000 0025 0000 3155` | Requiere autenticación 3D Secure |

### Datos de Test

- **Card number**: 4242 4242 4242 4242
- **Expiry**: Cualquier fecha futura (ej: 12/34)
- **CVC**: Cualquier número de 3 dígitos (ej: 123)
- **ZIP**: Cualquier código postal de 5 dígitos (ej: 12345)

## 🚀 Paso 6: Producción

### Antes de Lanzar

1. **Cambia a modo Live** en Stripe Dashboard
2. **Obtén claves Live**:
   - `pk_live_...`
   - `sk_live_...`
3. **Configura webhook en producción**
4. **Actualiza variables de entorno en Vercel**

### Variables para Producción

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

## 📊 Paso 7: Verificar Pagos

### Dashboard de Stripe

- **Payments**: Ver todos los pagos
- **Subscriptions**: Ver suscripciones activas
- **Customers**: Ver clientes

### En Tu Aplicación

Los usuarios pueden ver su estado de suscripción en:
- `/subscription` - Página de suscripción
- `/profile` - Perfil del usuario

## 🛠️ Troubleshooting

### Error: "No valid payment method"

- Verifica que estás usando tarjetas de test en modo test
- En modo live, usa tarjetas reales

### Error: "Invalid webhook signature"

- Verifica que `STRIPE_WEBHOOK_SECRET` es correcto
- Para desarrollo, usa el secret de Stripe CLI
- Para producción, usa el secret del webhook en Stripe Dashboard

### Error: "Product not found"

- Verifica que los productos están creados en Stripe
- En modo test, los productos son separados de live

## 📚 Recursos Adicionales

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Next.js + Stripe Guide](https://nextjs.org/learn/seo/improving-lcp)

## 💡 Tips

1. **Nunca commitees tus claves secretas** a Git
2. **Usa variables de entorno** para todas las claves
3. **Prueba exhaustivamente** en modo test antes de lanzar
4. **Monitorea tus webhooks** en el dashboard de Stripe
5. **Configura alertas** para pagos fallidos

---

**¿Problemas?** Revisa los logs:
- Stripe Dashboard → Developers → Logs
- Tu aplicación: consola del servidor Next.js
