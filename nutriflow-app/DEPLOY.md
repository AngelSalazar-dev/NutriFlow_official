# 🚀 NutriFlow - Guía Completa de Deploy

Esta guía te ayudará a desplegar NutriFlow en producción de forma segura y eficiente.

## 📋 Índice

1. [Preparación](#preparación)
2. [Base de Datos](#base-de-datos)
3. [Vercel (Frontend + API)](#vercel-frontend--api)
4. [Variables de Entorno](#variables-de-entorno)
5. [Stripe](#stripe)
6. [Google AdSense](#google-adsense)
7. [Dominio Personalizado](#dominio-personalizado)
8. [Monitoreo](#monitoreo)

---

## 🛠️ Preparación

### Requisitos Previos

- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Cuenta en [MySQL hosting](https://planetscale.com, https://railway.app, o https://aws.amazon.com/rds)
- ✅ Cuenta en [Stripe](https://stripe.com)
- ✅ Cuenta en [Google AdSense](https://adsense.google.com) (opcional)
- ✅ Repositorio en GitHub/GitLab

### Archivos Necesarios

Asegúrate de tener:
- `.env.local` actualizado (no subir a Git)
- Scripts de migración en `scripts/migrations/`
- `package.json` con scripts correctos

---

## 🗄️ Base de Datos

### Opción 1: PlanetScale (Recomendado)

1. **Crear cuenta** en [PlanetScale](https://planetscale.com)
2. **Crear nueva base de datos**:
   ```bash
   pscale shell nutriflow_db main
   ```
3. **Ejecutar migraciones**:
   ```bash
   # Copia el contenido de scripts/migrations/001-add-promo-codes-table.sql
   # Y pégalo en la consola de PlanetScale
   ```
4. **Obtener connection string**:
   - Ve a Settings → Connection strings
   - Copia el string para "Node.js"
   - Actualiza tus variables de entorno

### Opción 2: Railway

1. **Crear cuenta** en [Railway](https://railway.app)
2. **New Project → MySQL**
3. **Conectar desde tu app**:
   - Variables automáticas: `MYSQLHOST`, `MYSQLUSER`, etc.
   - Copia cada una a tus variables de Vercel

### Opción 3: AWS RDS

1. **Crear instancia** en AWS RDS
2. **Configurar security group** para permitir conexiones
3. **Crear base de datos**:
   ```sql
   CREATE DATABASE nutriflow_db;
   ```
4. **Ejecutar migraciones** desde tu máquina local

---

## ⚡ Vercel (Frontend + API)

### Paso 1: Conectar Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. **Add New → Project**
3. **Import Git Repository**
4. Selecciona tu repositorio de NutriFlow

### Paso 2: Configurar Build

- **Framework Preset**: Next.js
- **Root Directory**: `./` (o `nutriflow-app` si está en subdirectorio)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Paso 3: Variables de Entorno

Agrega las siguientes variables en **Settings → Environment Variables**:

```env
# Producción
MYSQL_HOST=db.railway.app
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=tu_password_seguro
MYSQL_DATABASE=nutriflow_db

JWT_SECRET=tu_jwt_secret_muy_largo_y_aleatorio

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...

NEXT_PUBLIC_APP_URL=https://nutriflow.vercel.app

EMERGENT_LLM_KEY=sk-... (opcional)

NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-... (opcional)
```

### Paso 4: Deploy

1. Click en **Deploy**
2. Espera a que complete (2-5 minutos)
3. ¡Listo! Tu app está en `https://nutriflow.vercel.app`

---

## 💳 Stripe

### Configurar Webhook en Producción

1. Ve a [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. **Add endpoint**
3. **Endpoint URL**: `https://tu-dominio.com/api/subscriptions/webhook`
4. **Events**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copia el **Signing secret** a Vercel: `STRIPE_WEBHOOK_SECRET`

### Productos en Stripe

Crea los productos en Stripe Dashboard:

**NutriFlow Premium**
- Price: $9.99 USD
- Recurring: Monthly

**NutriFlow Pro**
- Price: $19.99 USD
- Recurring: Monthly

---

## 📢 Google AdSense

### Paso 1: Agregar Sitio

1. Ve a [AdSense](https://adsense.google.com)
2. **Add site**: `https://tu-dominio.com`
3. **Verificar propiedad**:
   - Agrega meta tag al `<head>` de tu app
   - O verifica vía Google Search Console

### Paso 2: Agregar Script

En `app/layout.tsx`, el script ya está configurado. Solo actualiza:

```env
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXX
```

### Paso 3: Crear Unidades

1. **Anuncios → Por sitio**
2. Crea unidades para:
   - Banner principal
   - In-article
   - Sidebar
3. Copia los **Ad slot IDs** a `.env`

### Paso 4: Esperar Aprobación

- Revisión típica: 1-7 días
- Recibirás email cuando sea aprobado

---

## 🌐 Dominio Personalizado

### Comprar Dominio

- [Namecheap](https://namecheap.com) - Recomendado
- [GoDaddy](https://godaddy.com)
- [Google Domains](https://domains.google)

### Configurar en Vercel

1. Ve a **Project Settings → Domains**
2. **Add domain**: `nutriflow.app`
3. **Configurar DNS** en tu registrador:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### SSL Automático

Vercel configura SSL automáticamente. Tu sitio estará en HTTPS.

---

## 📊 Monitoreo

### Vercel Analytics

1. Ve a **Analytics** en Vercel
2. **Enable** para tu proyecto
3. Agrega el script de analytics (opcional)

### Error Tracking

#### Opción 1: Sentry

```bash
npm install @sentry/nextjs
```

Configura en `next.config.js`:

```js
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  // tu config actual
}, {
  org: 'tu-org',
  project: 'nutriflow',
});
```

#### Opción 2: LogRocket

```bash
npm install logrocket
```

```tsx
// app/layout.tsx
import LogRocket from 'logrocket';

LogRocket.init('tu-app-id');
```

### Uptime Monitoring

- [UptimeRobot](https://uptimerobot.com) - Gratis
- [Pingdom](https://pingdom.com) - Premium

Configura alerts para:
- Site down
- Slow response times
- Error rate > 1%

---

## 🔒 Seguridad

### Headers de Seguridad

El middleware ya incluye headers seguros. Verifica:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

### Rate Limiting

Configurado en `middleware.ts`:
- API general: 100 requests / 15 min
- Auth: 5 intentos / 15 min

### Secrets

**NUNCA** subas a Git:
- `.env.local`
- Claves de API
- Contraseñas

Usa **Vercel Environment Variables** para todo.

---

## 📈 Optimización

### Image Optimization

Next.js ya optimiza imágenes automáticamente. Usa:

```tsx
import Image from 'next/image';
<Image src="..." width={500} height={300} alt="..." />
```

### Caching

- **Static Generation**: Para landing page
- **ISR**: Para artículos (`revalidate: 3600`)
- **SWR**: Para datos del usuario

### Bundle Size

Analiza tu bundle:

```bash
npm run build
npx next-bundle-analyzer
```

Optimiza:
- Lazy load components pesados
- Code splitting por ruta
- Tree shaking de librerías

---

## 🆘 Troubleshooting

### Error: "Module not found"

```bash
npm install
npm run build
```

### Error: "Database connection failed"

- Verifica variables de entorno en Vercel
- Revisa que tu DB permita conexiones externas
- Verifica credentials

### Error: "Stripe webhook failed"

- Verifica que el webhook secret es correcto
- Revisa logs en Stripe Dashboard
- Testea con Stripe CLI localmente

### Build falla en Vercel

1. Revisa **Build Logs** en Vercel
2. Ejecuta `npm run build` localmente
3. Verifica que no haya errores de TypeScript

---

## 📚 Recursos Adicionales

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Stripe Best Practices](https://stripe.com/docs/best-practices)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)

---

## ✅ Checklist Pre-Lanzamiento

- [ ] Base de datos configurada y migrada
- [ ] Variables de entorno en Vercel
- [ ] Stripe en modo Live
- [ ] Webhook de Stripe configurado
- [ ] Dominio personalizado conectado
- [ ] SSL activo
- [ ] Analytics configurado
- [ ] Error tracking activo
- [ ] Tests passing
- [ ] Landing page revisada
- [ ] Términos y privacidad publicados
- [ ] Email de soporte configurado
- [ ] Redes sociales creadas
- [ ] Primeros códigos promocionales generados

---

**¡Listo para lanzar! 🚀**

Tu NutriFlow está en producción y listo para recibir usuarios.
