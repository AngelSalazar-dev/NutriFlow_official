# 📋 APIs y Claves Necesarias para NutriFlow AI

Esta guía te muestra EXACTAMENTE qué APIs necesitas, cómo obtenerlas y dónde ponerlas.

---

## 🔑 Lista Completa de APIs Requeridas

### Nivel 1: Esenciales (Para comenzar YA)

| API | Para qué sirve | Costo | Tiempo de aprobación |
|-----|----------------|-------|---------------------|
| **Stripe** | Cobrar suscripciones | Gratis (2.9% + $0.30 por transacción) | Inmediato |
| **MySQL** | Base de datos | Gratis (local) o $5-15/mes (cloud) | Inmediato |
| **JWT Secret** | Autenticación de usuarios | Gratis | Inmediato |

### Nivel 2: Para AI Agent (Revenue Sharing)

| API | Para qué sirve | Costo | Tiempo de aprobación |
|-----|----------------|-------|---------------------|
| **OpenAI/Anthropic** | IA para generar contenido | $0.01-0.10 por artículo | Inmediato |
| **Buffer/Hootsuite** | Publicar en redes sociales | Gratis - $50/mes | Inmediato |
| **SendGrid/Resend** | Email marketing | Gratis (100 emails/día) | 1-2 días |
| **Google AdSense** | Mostrar anuncios | Gratis (Google se queda ~32%) | 1-7 días |

### Nivel 3: Opcional (Para escalar)

| API | Para qué sirve | Costo | Tiempo |
|-----|----------------|-------|--------|
| **Google Analytics** | Analytics avanzado | Gratis | Inmediato |
| **Facebook Ads** | Anuncios en FB/IG | Variable | 1 día |
| **Google Ads** | Anuncios en Google | Variable | 1 día |
| **LemonSqueezy/Paddle** | Alternativa a Stripe | 5% + $0.50 | Inmediato |

---

## 🚀 Cómo Obtener Cada API

### 1. Stripe (Pagos) ⭐ PRIORIDAD 1

**Pasos:**
1. Ve a https://dashboard.stripe.com/register
2. Regístrate con email y contraseña
3. Activa el modo TEST (toggle arriba a la izquierda)
4. Ve a **Developers → API keys**
5. Copia las claves:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

**Dónde ponerlas:**
```env
# En .env.local
STRIPE_SECRET_KEY=sk_test_51QK... (pega tu secret key aquí)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51QK... (pega tu publishable key aquí)
STRIPE_WEBHOOK_SECRET=whsec_... (lo ves después de configurar webhook)
```

**Configurar Webhook:**
1. En Stripe Dashboard ve a **Developers → Webhooks**
2. Click **Add endpoint**
3. URL: `http://localhost:3000/api/subscriptions/webhook` (para test)
4. Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copia el **Signing secret** que te da

**Tiempo total:** 10 minutos

---

### 2. MySQL (Base de Datos) ⭐ PRIORIDAD 1

**Opción A: Local (Gratis, para desarrollo)**

Si ya instalaste MySQL:
```env
# En .env.local
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña
MYSQL_DATABASE=nutriflow_db
```

**Opción B: PlanetScale (Gratis, cloud, recomendado para producción)**

1. Ve a https://planetscale.com
2. Regístrate con GitHub
3. **Create Database** → Nombre: `nutriflow_db`
4. Ve a **Settings → Passwords**
5. **Add Password** → Nombre: `production`
6. Copia el **connection string** que te da

Reemplaza en `.env.local`:
```env
MYSQL_HOST=aws.connect.psdb.cloud
MYSQL_PORT=3306
MYSQL_USER=tu_usuario
MYSQL_PASSWORD=tu_contraseña_de_planetscale
MYSQL_DATABASE=nutriflow_db
```

**Tiempo total:** 5 minutos

---

### 3. JWT Secret (Autenticación) ⭐ PRIORIDAD 1

**Generar:**
```bash
# En tu terminal (Mac/Linux/WSL)
openssl rand -base64 64

# O en Windows PowerShell
[System.Web.Security.Membership]::GeneratePassword(64, 10)

# O usa https://generate-secret.vercel.app/64
```

**Dónde ponerlo:**
```env
# En .env.local
JWT_SECRET=copia_aquí_el_resultado_generado
```

**Tiempo total:** 1 minuto

---

### 4. OpenAI o Anthropic (IA para Contenido) ⭐ PRIORIDAD 2

**OpenAI (Recomendado):**

1. Ve a https://platform.openai.com/signup
2. Regístrate con email o Google
3. Ve a https://platform.openai.com/api-keys
4. **Create new secret key**
5. Copia la clave: `sk-proj-...`

**Anthropic (Alternativa):**

1. Ve a https://console.anthropic.com
2. Regístrate
3. Ve a **API Keys**
4. **Create Key**
5. Copia la clave: `sk-ant-...`

**Dónde ponerlo:**
```env
# En .env.local
OPENAI_API_KEY=sk-proj-... (si usas OpenAI)
# O
ANTHROPIC_API_KEY=sk-ant-... (si usas Anthropic)
```

**Costos estimados:**
- GPT-4: ~$0.03 por 1000 palabras
- GPT-3.5: ~$0.002 por 1000 palabras
- Claude: ~$0.015 por 1000 palabras

**Para 10 artículos/mes (2000 palabras cada uno):**
- GPT-4: ~$1.80/mes
- GPT-3.5: ~$0.12/mes
- Claude: ~$0.90/mes

**Tiempo total:** 5 minutos

---

### 5. Buffer (Redes Sociales) ⭐ PRIORIDAD 2

**Plan Gratis (hasta 3 canales):**

1. Ve a https://buffer.com
2. **Sign Up Free**
3. Conecta tus redes (Twitter, LinkedIn, Instagram, Facebook)
4. Ve a **Settings → API**
5. Copia tu **Access Token**

**Dónde ponerlo:**
```env
# En .env.local
BUFFER_ACCESS_TOKEN=tu_token_aqui
```

**Alternativa Gratis: Hootsuite Free Plan**
- Similar proceso
- https://hootsuite.com

**Tiempo total:** 10 minutos

---

### 6. SendGrid o Resend (Email Marketing) ⭐ PRIORIDAD 2

**SendGrid (100 emails/día gratis):**

1. Ve a https://sendgrid.com
2. **Sign Up**
3. Verifica tu email
4. Ve a **Settings → API Keys**
5. **Create API Key** → Nombre: `NutriFlow`
6. Copia la clave: `SG.xxxxx`

**Resend (Alternativa moderna, 100 emails/día gratis):**

1. Ve a https://resend.com
2. **Sign In with GitHub**
3. Ve a **API Keys**
4. **Create API Key**
5. Copia la clave: `re_xxxxx`

**Dónde ponerlo:**
```env
# En .env.local
SENDGRID_API_KEY=SG.xxxxx (si usas SendGrid)
# O
RESEND_API_KEY=re_xxxxx (si usas Resend)
```

**Tiempo total:** 5 minutos

---

### 7. Google AdSense (Anuncios) ⭐ PRIORIDAD 3

**Requisitos previos:**
- ✅ Sitio web publicado (no localhost)
- ✅ Dominio propio (ej: nutriflow.app)
- ✅ Contenido original (mínimo 10-20 artículos)
- ✅ Tráfico orgánico (mínimo 100 visitas/día recomendado)

**Pasos:**

1. Ve a https://adsense.google.com
2. **Comenzar**
3. Ingresa tu sitio: `https://nutriflow.app`
4. Completa formulario con tus datos
5. Agrega el código de verificación en tu sitio
6. Espera aprobación (1-7 días)
7. Una vez aprobado, ve a **Anuncios → Por sitio**
8. Crea unidades de anuncio
9. Copia tu **Publisher ID**: `ca-pub-XXXXXXXXXXXXXX`

**Dónde ponerlo:**
```env
# En .env.local
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_BANNER=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE=0987654321
```

**⚠️ IMPORTANTE:** No apliques hasta que tengas:
- Sitio publicado en Vercel
- Dominio personalizado
- Al menos 10 artículos de calidad

**Tiempo total:** 15 minutos + 1-7 días de espera

---

## 📝 Archivo .env.local Completo

Cuando tengas TODAS las APIs, tu `.env.local` se verá así:

```env
# ===========================================
# NUTRIFLOW - TODAS LAS APIs CONFIGURADAS
# ===========================================

# -------------------------------------------
# BASE DE DATOS (MySQL)
# -------------------------------------------
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña
MYSQL_DATABASE=nutriflow_db

# -------------------------------------------
# JWT Secret
# -------------------------------------------
JWT_SECRET=tu_jwt_secret_generado

# -------------------------------------------
# STRIPE (Pagos)
# -------------------------------------------
STRIPE_SECRET_KEY=sk_test_51QK...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51QK...
STRIPE_WEBHOOK_SECRET=whsec_...

# -------------------------------------------
# AI/LLM (Generación de contenido)
# -------------------------------------------
OPENAI_API_KEY=sk-proj-...
# O
ANTHROPIC_API_KEY=sk-ant-...

# -------------------------------------------
# AI AGENT (Revenue sharing)
# -------------------------------------------
AI_AGENT_API_KEY=tu_clave_generada_con_openssl

# -------------------------------------------
# SOCIAL MEDIA (Publicación automática)
# -------------------------------------------
BUFFER_ACCESS_TOKEN=tu_token_de_buffer
# O
HOOTSUITE_API_KEY=tu_key_de_hootsuite

# -------------------------------------------
# EMAIL MARKETING
# -------------------------------------------
SENDGRID_API_KEY=SG.xxxxx
# O
RESEND_API_KEY=re_xxxxx

# -------------------------------------------
# GOOGLE ADSENSE (Anuncios)
# -------------------------------------------
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_BANNER=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE=0987654321

# -------------------------------------------
# URL DE LA APLICACIÓN
# -------------------------------------------
NEXT_PUBLIC_APP_URL=http://localhost:3000
# En producción: https://nutriflow.vercel.app
```

---

## ✅ Checklist de Activación

### Fase 1: Esencial (HOY - 30 minutos)

- [ ] Stripe registrado y claves en `.env.local`
- [ ] MySQL configurado (local o cloud)
- [ ] JWT Secret generado
- [ ] Migraciones ejecutadas en MySQL
- [ ] `npm run dev` funciona sin errores

### Fase 2: AI Agent (MAÑANA - 1 hora)

- [ ] OpenAI/Anthropic registrado y API key en `.env.local`
- [ ] Buffer o Hootsuite configurado
- [ ] SendGrid/Resend configurado
- [ ] AI_AGENT_API_KEY generada
- [ ] Dashboard `/ai-agent` accesible

### Fase 3: Monetización (SEMANA 1-2)

- [ ] Sitio publicado en Vercel
- [ ] Dominio personalizado conectado
- [ ] Aplicar a Google AdSense
- [ ] Esperar aprobación (1-7 días)
- [ ] Configurar unidades de anuncio

### Fase 4: Escalamiento (SEMANA 3-4)

- [ ] Google Analytics conectado
- [ ] Facebook Ads configurado
- [ ] Google Ads configurado
- [ ] Primeras campañas automáticas de IA

---

## 🎯 Orden Recomendado

**Día 1:**
1. Stripe (10 min)
2. MySQL (5 min)
3. JWT Secret (1 min)
4. Ejecutar migraciones (5 min)
5. Testear localmente

**Día 2:**
1. OpenAI/Anthropic (5 min)
2. Buffer (10 min)
3. SendGrid/Resend (5 min)
4. AI_AGENT_API_KEY (1 min)
5. Configurar AI Agent

**Día 3-7:**
1. Publicar en Vercel
2. Conectar dominio
3. Aplicar a AdSense
4. Esperar aprobación

---

## 💡 Tips para Obtener APIs Rápido

### Stripe
- ✅ Aprobación instantánea en modo TEST
- ✅ No necesitas empresa para test
- ✅ Para producción, verifica tu identidad (5 min)

### OpenAI
- ✅ Aprobación instantánea
- ✅ Te dan $5 de crédito gratis al registrar tarjeta
- ✅ Los primeros 3 meses son casi gratis

### Google AdSense
- ⚠️ Necesitas sitio publicado
- ⚠️ Necesitas contenido original
- ✅ Una vez aprobado, es para siempre

### Alternativas si te rechazan AdSense:
- **Media.net**: Similar, más fácil aprobación
- **Ezoic**: Aceptan sitios más pequeños
- **Carbon Ads**: Para sitios de tecnología

---

## 🆘 Problemas Comunes

### "Stripe no acepta mi país"
**Solución:** Usa Stripe Atlas o incorpora en Delaware ($500)

### "OpenAI no está disponible en mi país"
**Solución:** Usa Anthropic (Claude) o Gemini (Google)

### "AdSense me rechazó"
**Soluciones:**
1. Mejora contenido (más original, menos copiado)
2. Agrega más páginas (About, Contacto, Privacidad)
3. Espera a tener más tráfico
4. Prueba Media.net primero

### "MySQL no conecta"
**Solución:**
```bash
# Verifica que MySQL está corriendo
mysql -u root -p

# Si usas Mac/Linux
sudo systemctl status mysql

# Si usas Windows
net start MySQL
```

---

## 📞 Recursos de Soporte

### Stripe
- Docs: https://stripe.com/docs
- Soporte: https://support.stripe.com

### OpenAI
- Docs: https://platform.openai.com/docs
- Soporte: https://help.openai.com

### Google AdSense
- Docs: https://support.google.com/adsense
- Políticas: https://support.google.com/adsense/answer/48182

### MySQL
- Docs: https://dev.mysql.com/doc
- PlanetScale: https://planetscale.com/docs

---

## 🎉 Una vez Tengas Todo

1. Copia TODAS las claves en `.env.local`
2. Ejecuta: `npm run dev`
3. Verifica que no hay errores en consola
4. Ve a `http://localhost:3000/ai-agent`
5. ¡Comienza a generar ingresos!

---

**¿Tienes alguna API ya? ¿Necesitas ayuda con alguna en específico?**
