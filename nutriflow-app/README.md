# NutriFlow

> **Plataforma Digital de Salud Integral — Nutrición + Ejercicio + IA**

NutriFlow es una aplicación web moderna diseñada para ayudar a las personas a gestionar su salud de forma integral. Combina seguimiento nutricional, registro de ejercicios, chat con IA educativa y un sistema de suscripciones con programa de referidos, todo en una interfaz intuitiva con modo oscuro y asistente de inicio guiado.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-TiDB-4479a1?logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Private-green)](#)

---

## Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso Básico](#-uso-básico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [API Reference](#-api-reference)
- [Sistema de Suscripciones](#-sistema-de-suscripciones)
- [Agente de IA](#-agente-de-ia)
- [Seguridad](#-seguridad)
- [Testing](#-testing)
- [Deploy a Producción](#-deploy-a-producción)
- [Variables de Entorno](#-variables-de-entorno)
- [Solución de Problemas](#-solución-de-problemas)
- [Licencia](#-licencia)

---

## 🚀 Características Principales

### 🍎 Nutrición
- **Registro diario de comidas** con base de datos de alimentos integrada
- **Cálculo automático de calorías** usando fórmula Mifflin-St Jeor para TDEE
- **Seguimiento de macronutrientes** (proteínas, carbohidratos, grasas)
- **Registro de hidratación** con recordatorios de agua
- **Exportación de datos** a CSV

### 🏋️ Ejercicio
- **Log de ejercicios** con cálculo de calorías quemadas (fórmula MET)
- **Datos de series** (repeticiones, peso, tipo de ejercicio)
- **Rutinas personalizables** organizadas por día de la semana
- **Seguimiento de grupos musculares**

### 🤖 Inteligencia Artificial
- **Chat con IA educativa** impulsado por Google Gemini
- **Artículos generados por IA** sobre salud y bienestar
- **Agente autónomo de IA** para gestión de revenus (SEO, marketing por email, redes sociales)

### 📊 Dashboard y Analíticas
- **Panel de control personalizado** con métricas de salud
- **Historial de 14 días** (plan gratuito) / ilimitado (premium)
- **Gráficos interactivos** con Recharts
- **Estadísticas diarias** de calorías, agua y ejercicio

### 💳 Suscripciones y Pagos
- **3 niveles**: Gratuito, Premium y Pro
- **Pagos con Stripe** (tarjetas de crédito/débito)
- **Códigos promocionales** con duración configurable
- **Sistema de referidos** con recompensas escalonadas
- **Integración con Google AdSense** para anuncios (plan gratuito)

### 🎨 Experiencia de Usuario
- **Modo oscuro** (claro, oscuro, sistema)
- **Asistente de inicio** (wizard de 5 pasos para nuevos usuarios)
- **Diseño responsivo** con Tailwind CSS v4 y Radix UI
- **Animaciones fluidas** con Framer Motion
- **Notificaciones toast** y estados de carga

---

## 🛠 Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| **Next.js** | 16.2.1 | Framework full-stack (App Router) |
| **React** | 19.2.4 | Biblioteca de UI |
| **TypeScript** | 5.x | Tipado estático |
| **Tailwind CSS** | v4 | Estilos utility-first |
| **Framer Motion** | 12.38.0 | Animaciones |
| **Recharts** | 3.8.1 | Gráficos y visualización de datos |
| **Radix UI** | latest | Componentes accesibles sin estilo |
| **Lucide React** | 1.7.0 | Iconos |
| **Zod** | 4.3.6 | Validación de esquemas |

### Backend
| Tecnología | Versión | Propósito |
|---|---|---|
| **MySQL** | 8.x | Base de datos relacional (TiDB Cloud) |
| **mysql2** | 3.20.0 | Driver MySQL con promises |
| **jose** | 6.2.2 | JWT (firma y verificación de tokens) |
| **bcryptjs** | 3.0.3 | Hash de contraseñas |
| **Stripe** | 21.0.1 | Procesamiento de pagos |
| **Google Gemini API** | — | Motor de IA para chat |

### DevOps y Calidad
| Tecnología | Propósito |
|---|---|
| **Vercel** | Hosting y CI/CD |
| **Jest** | Tests unitarios |
| **Playwright** | Tests E2E |
| **ESLint + Prettier** | Linting y formateo |
| **Husky** | Git hooks pre-commit |
| **tsx** | Ejecución de TypeScript |

---

## 🏗 Arquitectura del Proyecto

NutriFlow utiliza la arquitectura **Next.js App Router** con rutas agrupadas por dominio funcional:

```
┌─────────────────────────────────────────────────────┐
│                   Navegador Web                      │
├─────────────────────────────────────────────────────┤
│                   Middleware (auth, rate limit)      │
├──────────────┬──────────────────┬───────────────────┤
│  Páginas     │  API Routes      │  Componentes      │
│  (auth)      │  /api/*          │  UI/Features      │
│  (dashboard) │  CRUD operations │  Layout           │
│  (dev)       │  Webhooks        │  Ads              │
├──────────────┴──────────────────┴───────────────────┤
│                   Capa de Datos                     │
│  MySQL (TiDB Cloud)  │  Connection Pool (mysql2)    │
└─────────────────────────────────────────────────────┘
```

### Flujo de Autenticación
1. Usuario se registra → `POST /api/auth/register`
2. Se valida con Zod → Hash con bcrypt → Guarda en MySQL
3. Login → `POST /api/auth/login` → Genera JWT con `jose`
4. JWT se almacena en cookie `session` (HTTP-only, Secure, SameSite)
5. Middleware verifica cookie en rutas protegidas

### Flujo de Datos
```
Componente React → fetch('/api/...') → Route Handler → MySQL Pool → Response → UI Update
```

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

| Software | Versión Mínima | Descripción |
|---|---|---|
| **Node.js** | 18.x o superior | Entorno de ejecución JavaScript |
| **npm** | 9.x o superior | Gestor de paquetes (o pnpm/yarn) |
| **MySQL / TiDB Cloud** | 8.x | Base de datos (TiDB Cloud gratuito recomendado) |
| **Git** | 2.x | Control de versiones |

### Cuentas de Servicios Externos (Opcionales pero recomendados)

| Servicio | Propósito | Plan Gratuito |
|---|---|---|
| **[TiDB Cloud](https://tidbcloud.com)** | Base de datos MySQL en la nube | ✅ 5GB gratis |
| **[Stripe](https://stripe.com)** | Procesamiento de pagos | ✅ Solo cobra por transacción |
| **[Google AI Studio](https://aistudio.google.com)** | API Key para chat IA | ✅ Tier gratuito disponible |
| **[Vercel](https://vercel.com)** | Hosting | ✅ Hobby plan gratuito |
| **[Google AdSense](https://adsense.google.com)** | Anuncios | ✅ Gratuito |

---

## 📦 Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/AngelSalazar-dev/NutriFlow_official.git
cd NutriFlow_official/nutriflow-app
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
# ===========================================
# BASE DE DATOS (MySQL / TiDB Cloud)
# ===========================================
MYSQL_HOST=gateway01.us-east-1.prod.aws.tidbcloud.com
MYSQL_PORT=4000
MYSQL_USER=tu_usuario.root
MYSQL_PASSWORD=tu_password_segura
MYSQL_DATABASE=nutriflow_db

# ===========================================
# JWT SECRET
# Genera uno con: openssl rand -base64 64
# ===========================================
JWT_SECRET=tu-clave-secreta-larga-y-segura

# ===========================================
# STRIPE (Pagos)
# Obtén tus claves en: https://dashboard.stripe.com/apikeys
# ===========================================
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ===========================================
# URL DE LA APLICACIÓN
# ===========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===========================================
# AI/LLM API Key (Chatbot)
# Obtén la tuya en: https://aistudio.google.com/app/apikey
# ===========================================
GEMINI_API_KEY=AIzaSy...

# ===========================================
# AI AGENT API Key (Revenue sharing)
# Genera una: openssl rand -hex 32
# ===========================================
AI_AGENT_API_KEY=tu_api_key_para_agente_ia

# ===========================================
# GOOGLE ADSENSE (Opcional)
# ===========================================
# NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXX
# NEXT_PUBLIC_ADSENSE_SLOT_BANNER=1234567890
# NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE=0987654321
```

### Paso 4: Configurar la Base de Datos

#### Opción A: Usando scripts de migración (Recomendado)

```bash
# Ejecutar todas las migraciones
npx tsx scripts/run-migrations.ts

# Poblar con datos de ejemplo
npx tsx scripts/seed-mysql.ts
```

#### Opción B: Manualmente

Ejecuta los archivos SQL en orden desde `scripts/migrations/`:
1. `001-add-promo-codes-table.sql`
2. `002-add-referral-codes-table.sql`
3. `003-add-revenue-tracking-tables.sql`
4. `004-add-exercise-tables.sql`

### Paso 5: Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en **http://localhost:3000**

---

## 🎯 Uso Básico

### Iniciar en Desarrollo

```bash
npm run dev
```

### Construir para Producción

```bash
npm run build
npm start
```

### Flujo Típico de Usuario

1. **Registro**: Ve a `/register` y crea una cuenta
2. **Onboarding**: Completa el wizard de 5 pasos (edad, peso, altura, objetivos)
3. **Dashboard**: Revisa tus métricas del día
4. **Registrar comida**: Ve a `/food-log` y busca alimentos
5. **Registrar ejercicio**: Ve a `/exercise` y añade tu entrenamiento
6. **Chat IA**: Usa `/chat` para hacer preguntas de nutrición
7. **Historial**: Revisa tu progreso en `/history`

### Comandos Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo con Turbopack |
| `npm run build` | Construye para producción |
| `npm start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | Ejecuta ESLint y corrige errores |
| `npm run format` | Formatea código con Prettier |
| `npm run type-check` | Verifica tipos con TypeScript |
| `npm test` | Ejecuta tests unitarios con Jest |
| `npm run test:watch` | Tests en modo observación |
| `npm run test:e2e` | Tests E2E con Playwright |
| `npm run db:migrate` | Ejecuta migraciones de BD |
| `npm run db:seed` | Pobla la BD con datos de ejemplo |
| `npm run db:reset` | Resetea la BD completa |
| `npm run db:food-tables` | Crea tablas de alimentos |

---

## 📁 Estructura del Proyecto

```
nutriflow-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación (públicas)
│   │   ├── login/page.tsx        #   Página de inicio de sesión
│   │   └── register/page.tsx     #   Página de registro
│   ├── (dashboard)/              # Rutas del dashboard (protegidas)
│   │   ├── dashboard/page.tsx    #   Panel principal
│   │   ├── food-log/page.tsx     #   Registro de comidas
│   │   ├── exercise/page.tsx     #   Registro de ejercicios
│   │   ├── chat/page.tsx         #   Chat con IA
│   │   ├── articles/page.tsx     #   Artículos educativos
│   │   ├── history/page.tsx      #   Historial y gráficas
│   │   ├── profile/page.tsx      #   Perfil de usuario
│   │   ├── settings/page.tsx     #   Configuración
│   │   ├── subscription/page.tsx #   Gestión de suscripción
│   │   ├── ai-agent/page.tsx     #   Panel del agente IA
│   │   └── onboarding/page.tsx   #   Asistente de inicio
│   ├── api/                      # API Routes (backend)
│   │   ├── auth/                 #   Login, register, logout, me
│   │   ├── food/                 #   Log, search, today
│   │   ├── exercise/             #   Log, routines
│   │   ├── chat/                 #   Message (IA)
│   │   ├── articles/             #   List, by slug
│   │   ├── subscriptions/        #   Checkout, webhook, verify
│   │   ├── promo/                #   Redeem codes
│   │   ├── referral/             #   Referral system
│   │   ├── stats/                #   Today, history
│   │   ├── hydration/            #   Water tracking
│   │   └── ai/                   #   AI revenue
│   ├── layout.tsx                # Layout raíz
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Estilos globales
│
├── components/
│   ├── ui/                       # Componentes de UI base (Radix)
│   │   ├── button.tsx            #   Botón reutilizable
│   │   ├── card.tsx              #   Card component
│   │   ├── input.tsx             #   Input con validación
│   │   ├── toast.tsx             #   Sistema de notificaciones
│   │   ├── loading.tsx           #   Skeletons y spinners
│   │   └── ...                   #   (avatar, badge, dialog, etc.)
│   ├── layout/                   # Componentes de estructura
│   │   ├── Navbar.tsx            #   Barra de navegación
│   │   ├── Sidebar.tsx           #   Barra lateral
│   │   └── DashboardLayout.tsx   #   Layout del dashboard
│   ├── features/                 # Funcionalidades específicas
│   │   ├── OnboardingWizard.tsx  #   Wizard de 5 pasos
│   │   ├── PromoCodeRedeemer.tsx #   Canje de códigos
│   │   ├── ReferralProgram.tsx   #   Programa de referidos
│   │   └── ThemeToggle.tsx       #   Selector de tema
│   └── ads/
│       └── BannerAd.tsx          # Componente de anuncios AdSense
│
├── lib/                          # Utilidades y servicios
│   ├── mysql.ts                  # Conexión y pool de MySQL
│   ├── auth.ts                   # Generación y verificación JWT
│   ├── auth-mysql.ts             # Operaciones de auth en BD
│   ├── validation.ts             # Esquemas Zod
│   ├── validators.ts             # Validadores adicionales
│   ├── food-database.ts          # Búsqueda de alimentos
│   ├── revenue-tracker.ts        # Tracking de revenus
│   ├── article-scraper.ts        # Scraping de artículos
│   ├── rate-limit.ts             # Rate limiting
│   ├── cn.ts                     # Utility para clases CSS
│   └── utils.ts                  # Utilidades generales
│
├── scripts/                      # Scripts de mantenimiento
│   ├── migrations/               # Migraciones SQL
│   ├── run-migrations.ts         # Ejecutor de migraciones
│   ├── seed-mysql.ts             # Seeder de datos
│   ├── reset-database.ts         # Reset completo de BD
│   └── create-food-tables.ts     # Tabla de alimentos
│
├── __tests__/                    # Tests unitarios (Jest)
├── playwright/                   # Tests E2E (Playwright)
├── config/                       # Configuraciones
├── context/                      # React Context providers
├── hooks/                        # Custom React hooks
├── types/                        # Definiciones de TypeScript
├── public/                       # Archivos estáticos
├── docs/                         # Documentación adicional
│
├── next.config.ts                # Configuración de Next.js
├── middleware.ts                 # Middleware (auth, rate limit)
├── tailwind.config.ts            # Configuración de Tailwind
├── tsconfig.json                 # Configuración de TypeScript
├── package.json                  # Dependencias y scripts
├── vercel.json                   # Configuración de Vercel
└── .env.local                    # Variables de entorno (no tracked)
```

---

## 🗄 Base de Datos

### Motor
**MySQL** alojado en **TiDB Cloud** (Serverless, 5GB gratis). Compatible 100% con MySQL 8.0.

### Tablas Principales

| Tabla | Descripción |
|---|---|
| `users` | Usuarios (datos personales, TDEE, plan, referido por) |
| `sessions` | Sesiones activas de usuario |
| `subscriptions` | Historial de suscripciones y pagos |
| `daily_logs` | Registros diarios de peso y bienestar |
| `food_entries` | Comidas registradas por usuario |
| `food_database` | Catálogo de alimentos |
| `exercise_logs` | Ejercicios realizados con datos de series |
| `water_logs` | Registro de ingesta de agua |
| `articles` | Artículos educativos |
| `chat_messages` | Historial de chat con IA |
| `ai_chat_usage` | Contador de uso de IA por usuario |
| `referrals` | Referidos y recompensas |
| `promo_codes` | Códigos promocionales |
| `revenue_records` | Registros de ingresos |
| `routines` | Rutinas de ejercicio personalizadas |

### Códigos Promocionales Incluidos

| Código | Plan | Duración |
|---|---|---|
| `BETA100` | Premium | De por vida |
| `EARLYBIRD` | Premium | 12 meses |
| `STUDENT` | Premium | 6 meses |
| `WELCOME7` | Premium | 7 días |
| `PRO30` | Pro | 30 días |

### Cálculos Nutricionales

**TDEE (Total Daily Energy Expenditure)** — Fórmula Mifflin-St Jeor:

```
Hombres: TDEE = (10 × peso_kg + 6.25 × altura_cm - 5 × edad + 5) × factor_actividad
Mujeres: TDEE = (10 × peso_kg + 6.25 × altura_cm - 5 × edad - 161) × factor_actividad

Factores de actividad:
  Sedentario:        1.2
  Ligero:             1.375
  Moderado:           1.55
  Activo:             1.725
  Muy activo:         1.9
```

**Calorías quemadas por ejercicio** — Fórmula MET:

```
Calorías = MET × peso_kg × duración_horas
```

---

## 🔌 API Reference

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |
| `POST` | `/api/auth/logout` | Cerrar sesión |
| `GET` | `/api/auth/me` | Obtener perfil del usuario actual |
| `PUT` | `/api/auth/profile` | Actualizar perfil |

### Alimentos y Nutrición

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/food/search?q=...` | Buscar alimentos |
| `POST` | `/api/food/log` | Registrar comida |
| `GET` | `/api/food/today` | Obtener comidas del día |

### Ejercicio

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/exercise/log` | Registrar ejercicio |
| `GET` | `/api/exercise/routines` | Obtener rutinas |

### Chat IA

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/chat/message` | Enviar mensaje al chat IA |

### Artículos

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/articles` | Listar artículos |
| `GET` | `/api/articles/:slug` | Obtener artículo por slug |

### Suscripciones

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/subscriptions/create-checkout` | Crear sesión de pago Stripe |
| `POST` | `/api/subscriptions/webhook` | Webhook de Stripe |
| `GET` | `/api/subscriptions/verify` | Verificar estado de suscripción |

### Códigos Promocionales

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/promo/redeem` | Canjear código promocional |

### Referidos

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/referral` | Obtener código y estadísticas de referidos |

### Estadísticas

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/stats/today` | Estadísticas del día actual |
| `GET` | `/api/stats/history` | Historial de estadísticas |

### Hidratación

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/hydration` | Registrar ingesta de agua |
| `POST` | `/api/hydration/quick` | Registro rápido de agua |

---

## 💳 Sistema de Suscripciones

### Planes

| Característica | Gratuito | Premium | Pro |
|---|---|---|---|
| **Historial** | 14 días | Ilimitado | Ilimitado |
| **Mensajes IA/día** | 10 | Ilimitados | Ilimitados |
| **Exportar datos** | CSV | CSV + PDF | CSV + PDF + JSON |
| **Anuncios** | Sí (AdSense) | No | No |
| **Rutinas** | Básicas | Personalizadas | Personalizadas + IA |
| **Soporte prioritario** | No | Sí | Sí |
| **Acceso API** | No | Sí | Sí |

### Distribución de Revenue (Agente IA)

| Destino | Porcentaje |
|---|---|
| **Propietario** | 70% |
| **Reinversión** | 20% |
| **Operador IA** | 10% |

---

## 🤖 Agente de IA

NutriFlow incluye un sistema de agente autónomo de IA para gestión de revenus:

- **Generación de contenido SEO** (1-2 artículos/día)
- **Publicación en redes sociales**
- **Email marketing automatizado**
- **Optimización de revenus**

El agente se configura mediante variables de entorno y opera de forma independiente una vez activado.

**Documentación completa**: Ver `docs/AI-AGENT-CONTRACT.md` y `AI-README.md`

---

## 🔒 Seguridad

### Medidas Implementadas

| Medida | Descripción |
|---|---|
| **CSP Headers** | Content-Security-Policy estricto con allowances para Stripe, Google, fonts |
| **Rate Limiting** | 100 requests por 15 minutos por IP (memory-based; Redis recomendado para producción) |
| **JWT HTTP-only Cookies** | Tokens almacenados en cookies seguras (Secure, SameSite=Strict, HTTP-only) |
| **bcrypt Hashing** | Contraseñas hasheadas con salt rounds |
| **Validación Zod** | Todos los inputs validados en backend con esquemas Zod |
| **XSS Protection** | Headers X-XSS-Protection y X-Content-Type-Options |
| **Clickjacking Protection** | X-Frame-Options: DENY |
| **HSTS** | HTTP Strict Transport Security en producción |
| **SSL/TLS** | Conexión a BD con SSL en producción |

### Content Security Policy

La CSP permite:
- Scripts: self, Stripe, Google Analytics, Google Tag Manager, AdSense
- Styles: self, inline, Google Fonts
- Fonts: self, Google Fonts
- Frames: Stripe, YouTube (para videos educativos)

---

## 🧪 Testing

### Tests Unitarios (Jest)

```bash
# Ejecutar todos los tests
npm test

# Modo observación
npm run test:watch

# Con cobertura
npm run test:coverage
```

### Tests E2E (Playwright)

```bash
# Ejecutar tests E2E
npm run test:e2e

# Con UI interactiva
npm run test:e2e:ui

# Modo headed (ver navegador)
npm run test:e2e:headed
```

### Linting y Type Checking

```bash
# ESLint
npm run lint

# Verificación de tipos
npm run type-check

# Formateo
npm run format
```

### Pre-commit Hooks

El proyecto usa Husky para ejecutar automáticamente:
- ESLint
- Prettier
- Tests unitarios

---

## 🚀 Deploy a Producción

### Opción 1: Vercel (Recomendado)

```bash
# Instalar CLI de Vercel
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Opción 2: GitHub Actions (CI/CD)

El repositorio incluye workflows de GitHub Actions que:
1. Ejecutan linter
2. Ejecutan tests unitarios
3. Construyen el proyecto
4. Despliegan a Vercel automáticamente en cada push a `main`

### Variables de Entorno en Producción

Configura estas variables en el dashboard de Vercel (**Settings → Environment Variables**):

| Variable | Valor de Ejemplo | Requerida |
|---|---|---|
| `MYSQL_HOST` | `gateway01.us-east-1.prod.aws.tidbcloud.com` | ✅ |
| `MYSQL_PORT` | `4000` | ✅ |
| `MYSQL_USER` | `tu_usuario.root` | ✅ |
| `MYSQL_PASSWORD` | `tu_password` | ✅ |
| `MYSQL_DATABASE` | `nutriflow_db` | ✅ |
| `JWT_SECRET` | `tu-secreto-largo` | ✅ |
| `GEMINI_API_KEY` | `AIzaSy...` | ✅ |
| `STRIPE_SECRET_KEY` | `sk_live_...` | ✅ (pagos) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | ✅ (pagos) |
| `NEXT_PUBLIC_APP_URL` | `https://tu-dominio.vercel.app` | ✅ |
| `AI_AGENT_API_KEY` | `tu-api-key` | ❌ (agente IA) |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | `ca-pub-...` | ❌ (anuncios) |

> **Nota**: Las variables deben configurarse también para los entornos `Preview` y `Development` si deseas parity completo.

### Dominio Personalizado

1. Ve a **Vercel Dashboard → Project Settings → Domains**
2. Agrega tu dominio (ej: `nutriflow.com`)
3. Configura los registros DNS según las instrucciones de Vercel

---

## 📝 Variables de Entorno

### Completamente Documentadas en `.env.example`

```env
# BASE DE DATOS
MYSQL_HOST=          # Host de MySQL o TiDB Cloud
MYSQL_PORT=          # Puerto (default: 3306 o 4000 para TiDB)
MYSQL_USER=          # Usuario de MySQL
MYSQL_PASSWORD=      # Contraseña de MySQL
MYSQL_DATABASE=      # Nombre de la base de datos

# JWT
JWT_SECRET=          # Clave secreta para firmar tokens (mínimo 32 caracteres)

# STRIPE
STRIPE_SECRET_KEY=       # Clave secreta de Stripe
STRIPE_WEBHOOK_SECRET=   # Secreto del webhook de Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Clave pública de Stripe (frontend)

# APP
NEXT_PUBLIC_APP_URL=     # URL de la aplicación

# IA
GEMINI_API_KEY=          # API Key de Google Gemini
AI_AGENT_API_KEY=        # API Key para el agente autónomo

# ADSENSE (opcional)
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=
NEXT_PUBLIC_ADSENSE_SLOT_BANNER=
NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE=
```

---

## 🐛 Solución de Problemas

### Error: `ECONNREFUSED 127.0.0.1:3306`

**Causa**: MySQL no está corriendo localmente o la variable `MYSQL_HOST` apunta a localhost en producción.

**Solución**:
- **Local**: Asegúrate de que MySQL esté corriendo (`mysql --version`)
- **Producción**: Configura `MYSQL_HOST` con la dirección de tu servidor en la nube (TiDB Cloud, Railway, etc.)

### Error: `ER_BAD_DB_ERROR - Unknown database`

**Causa**: La base de datos especificada no existe.

**Solución**:
1. Crea la base de datos: `CREATE DATABASE nutriflow_db;`
2. O usa la BD predeterminada de TiDB Cloud (`sys`)
3. Ejecuta las migraciones: `npx tsx scripts/run-migrations.ts`

### Error: `getaddrinfo ENOTFOUND`

**Causa**: El hostname de MySQL no resuelve en DNS.

**Solución**:
- Verifica que estás usando el host **público** de TiDB Cloud (sin `-privatelink`)
- Prueba con `nslookup tu-host.tidbcloud.com` localmente

### Error: Stripe webhook no recibe eventos

**Solución**:
1. En desarrollo, usa [Stripe CLI](https://stripe.com/docs/stripe-cli#listen):
   ```bash
   stripe listen --forward-to localhost:3000/api/subscriptions/webhook
   ```
2. En producción, configura el webhook en Stripe Dashboard con la URL:
   ```
   https://tu-dominio.vercel.app/api/subscriptions/webhook
   ```
3. Eventos a suscribir:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### Error: El chat de IA no responde

**Solución**:
1. Verifica que `GEMINI_API_KEY` esté configurada correctamente
2. Obtén una API Key en [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Revisa los logs de Vercel para errores específicos

### Error: Rate Limiting (429 Too Many Requests)

**Causa**: Más de 100 requests en 15 minutos desde la misma IP.

**Solución**:
- Para producción, considera migrar el rate limiter a **Redis** (actualmente en memoria)
- Modifica los límites en `middleware.ts` si es necesario

---

## 📚 Recursos Adicionales

- **[Documentación del Agente IA](AI-README.md)** — Setup y uso del agente autónomo
- **[Mejoras Implementadas](MEJORAS.md)** — Lista de 10 mejoras con detalles
- **[Guía de Deploy](DEPLOY.md)** — Instrucciones completas de despliegue
- **[Documentación de MySQL](README-MYSQL.md)** — Setup de base de datos
- **[Estructura del Proyecto](PROJECT-STRUCTURE.md)** — Arquitectura y reorganización
- **[Reporte de Verificación](VERIFICATION-REPORT.md)** — Auditoría de calidad

---

## 👨‍💻 Contribuir

1. Haz un fork del repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'feat: agregué nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Pre-requisitos para PR

- [ ] Tests unitarios pasan (`npm test`)
- [ ] Tests E2E pasan (`npm run test:e2e`)
- [ ] Linting pasa (`npm run lint`)
- [ ] Type checking pasa (`npm run type-check`)
- [ ] Documentación actualizada si es necesario

---

## 📄 Licencia

Este proyecto es **privado**. Todos los derechos reservados.

---

<div align="center">

**Hecho con ❤️ por el equipo de NutriFlow**

[🌐 Sitio Web](https://nutriflow-official.vercel.app) · [📧 Soporte](mailto:soporte@nutriflow.com)

</div>
