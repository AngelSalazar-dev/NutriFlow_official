# 🌿 NutriFlow

**Plataforma Digital de Salud Integral — Nutrición + Ejercicio + IA**

Una aplicación web moderna para controlar tu alimentación, ejercicio y bienestar general con un diseño minimalista y cálculos basados en ciencia.

## ✨ Características Principales

### Módulo de Nutrición
- **Registro de alimentos** manual con macros detallados
- **Seguimiento de calorías** en tiempo real
- **Distribución de macronutrientes** (proteínas, carbs, grasas)
- **Seguimiento de hidratación** con recordatorios
- **Historial y estadísticas** de 7 días (gratuito) o 30 días/ilimitado (premium)

### Módulo de Ejercicio (Premium+)
- **Registro de rutinas** y ejercicios personalizados
- **Cálculo automático de calorías quemadas** usando fórmula MET
- **Seguimiento de volumen total** (series × reps × peso)
- **Biblioteca de ejercicios** con 100+ ejercicios predefinidos
- **Historial de entrenamientos** con calendario visual

### Chat con IA
- **Asistente de nutrición** disponible 24/7
- **Límites por plan**: 5 mensajes/día (gratuito), ilimitado (premium/pro)
- **Contexto personalizado** basado en tu perfil y objetivos
- **Respuestas basadas en evidencia** científica

### Artículos Educativos
- **Contenido gratuito** para todos los usuarios (con anuncios no invasivos)
- **Artículos verificados** por nutricionistas y entrenadores certificados (premium)
- **Categorías**: nutrición, ejercicio, bienestar, suplementación
- **Sistema de anuncios** tipo banner para usuarios gratuitos

### Sistema de Suscripción
| Función | Gratuito | Premium ($9.99/mes) | Pro ($19.99/mes) |
|---------|----------|---------------------|------------------|
| Artículos | ✅ (con anuncios) | ✅ (sin anuncios) | ✅ (sin anuncios) |
| Artículos verificados | ❌ | ✅ | ✅ |
| Chat IA | 5 msg/día | Ilimitado | Ilimitado + historial |
| Registro de comida | Manual | Manual + Foto IA | Manual + Foto IA |
| Módulo ejercicio | Vista previa | ✅ Completo | ✅ Completo + IA |
| Estadísticas | 7 días | 30 días | Ilimitado |
| Exportar datos | ❌ | ❌ | ✅ PDF/CSV |
| Integración wearables | ❌ | ❌ | ✅ |

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, MongoDB
- **Base de Datos**: MongoDB Atlas o local
- **Autenticación**: JWT con cookies HTTP-only
- **Pagos**: Stripe Checkout
- **UI Components**: Radix UI, shadcn/ui patterns
- **Iconos**: Lucide React

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18+ ([descargar](https://nodejs.org/))
- **MongoDB** v6+ ([descargar](https://www.mongodb.com/try/download/community)) o cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** o **yarn** (incluido con Node.js)
- **Stripe CLI** (opcional, para testing de pagos) ([descargar](https://stripe.com/docs/stripe-cli))

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
cd nutriflow-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017
DB_NAME=nutriflow_db

# JWT Secret (genera una cadena aleatoria larga)
JWT_SECRET=tu-clave-secreta-muy-larga-y-segura-cambiala-en-produccion

# Stripe (para suscripciones)
STRIPE_SECRET_KEY=sk_test_tu_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret

# Frontend URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI/LLM API Key (opcional, para chat avanzado)
EMERGENT_LLM_KEY=sk-emergent-tu-api-key
```

### 4. Iniciar MongoDB (si usas MongoDB local)

**Windows:**
```bash
mongod
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
```

### 5. Ejecutar seed de datos iniciales (opcional)

```bash
npx tsx scripts/seed.ts
```

Esto populate la base de datos con artículos de ejemplo.

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
nutriflow-app/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/          # Rutas protegidas del dashboard
│   │   ├── dashboard/
│   │   ├── food-log/
│   │   ├── exercise/
│   │   ├── articles/
│   │   ├── chat/
│   │   ├── history/
│   │   ├── profile/
│   │   └── subscription/
│   ├── api/                  # API Routes
│   │   ├── auth/
│   │   ├── food/
│   │   ├── exercise/
│   │   ├── articles/
│   │   ├── chat/
│   │   └── subscriptions/
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                   # Componentes UI base
│   ├── layout/               # Layout components (Navbar, etc.)
│   ├── forms/                # Componentes de formularios
│   ├── exercise/             # Componentes de ejercicio
│   └── ads/                  # Componentes de anuncios
├── context/
│   └── AuthContext.tsx       # Auth state management
├── lib/
│   ├── auth.ts               # JWT auth utilities
│   ├── mongodb.ts            # MongoDB connection
│   ├── utils.ts              # Utility functions (TDEE, MET, etc.)
│   └── cn.ts                 # Class name utility
├── types/
│   └── index.ts              # TypeScript type definitions
└── scripts/
    └── seed.ts               # Database seed script
```

## 🔐 Autenticación

La aplicación usa JWT (JSON Web Tokens) almacenados en cookies HTTP-only para seguridad.

- **Registro**: Los usuarios crean una cuenta con email, contraseña y perfil
- **Login**: Autenticación con email y contraseña
- **Perfil**: Los usuarios pueden actualizar sus datos y recalcular objetivos

## 🧮 Cálculos Nutricionales

### TDEE (Total Daily Energy Expenditure)

Usamos la ecuación **Mifflin-St Jeor**:

**Hombres:**
```
BMR = 10 × peso(kg) + 6.25 × altura(cm) − 5 × edad + 5
```

**Mujeres:**
```
BMR = 10 × peso(kg) + 6.25 × altura(cm) − 5 × edad − 161
```

**TDEE = BMR × multiplicador_actividad**

Multiplicadores:
- Sedentario: 1.2
- Ligero: 1.375
- Moderado: 1.55
- Activo: 1.725
- Muy activo: 1.9

**Objetivo calórico:**
- Perder peso: TDEE − 500 kcal
- Mantener: TDEE
- Ganar: TDEE + 300 kcal

### Cálculo de Calorías Quemadas (Ejercicio)

Usamos el valor **MET** (Metabolic Equivalent of Task):

```
Calorías = MET × peso(kg) × duración(horas)
```

Ejemplo: Correr (MET=8) para 70kg durante 30 minutos:
```
8 × 70 × 0.5 = 280 kcal
```

## 💳 Configuración de Stripe (Pagos)

### 1. Crear cuenta en Stripe

1. Regístrate en [Stripe Dashboard](https://dashboard.stripe.com/)
2. Obtén tus claves API en Developers → API keys

### 2. Configurar productos en Stripe

Crea dos productos en Stripe Dashboard:

**NutriFlow Premium:**
- Precio: $9.99 USD
- Recurrente: mensual

**NutriFlow Pro:**
- Precio: $19.99 USD
- Recurrente: mensual

### 3. Testing local

Usa las tarjetas de test de Stripe:
- `4242 4242 4242 4242` — Éxito
- `4000 0000 0000 9995` — Declinada

## 🎨 Diseño y UI

### Paleta de Colores

- **Primario**: Verde esmeralda profundo (`#064E3B`)
- **Fondo**: Cálido neutro (`#FAFAF9`)
- **Acentos**: Tonos esmeralda (`#10B981`, `#059669`)

### Tipografía

- **Títulos**: Manrope (Google Fonts)
- **Cuerpo**: Inter (Google Fonts)

### Principios de Diseño

- Minimalismo elegante con espacios en blanco
- Jerarquía visual clara
- Accesibilidad prioritaria
- No saturación visual

## 📊 Base de Datos

### Colecciones MongoDB

**users:**
```typescript
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  name: string,
  age: number,
  sex: 'male' | 'female',
  weight: number,
  height: number,
  activityLevel: string,
  goal: string,
  subscriptionPlan: 'free' | 'premium' | 'pro',
  tdee: number,
  calorieGoal: number,
  proteinGoal: number,
  carbGoal: number,
  fatGoal: number,
  createdAt: Date,
  updatedAt: Date
}
```

**food_logs:**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  foodName: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  servingSize: number,
  mealType: string,
  date: Date,
  createdAt: Date
}
```

**exercise_logs:**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  exerciseName: string,
  exerciseType: string,
  muscleGroups: string[],
  metValue: number,
  durationMin: number,
  caloriesBurned: number,
  setsData: array,
  date: Date,
  createdAt: Date
}
```

**chat_messages:**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  role: 'user' | 'assistant',
  content: string,
  date: Date,
  createdAt: Date
}
```

**articles:**
```typescript
{
  _id: ObjectId,
  title: string,
  slug: string,
  excerpt: string,
  content: string,
  category: string,
  isVerified: boolean,
  author?: { name, credentials },
  publishedAt: Date,
  readTime: number
}
```

## 🔒 Seguridad

- **Contraseñas**: Hasheadas con bcrypt (salt rounds: 10)
- **JWT**: Almacenados en cookies HTTP-only
- **CORS**: Configurado para permitir solo el frontend
- **Validación**: Todos los inputs son validados en el servidor

## 🧪 Testing

### Ejecutar tests (futuro)

```bash
npm test
```

## 📦 Deploy

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático con cada push

### MongoDB Atlas

1. Crea un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Obtén la connection string
3. Actualiza `MONGODB_URI` en `.env.local`

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Equipo

Desarrollado con ❤️ por el equipo de NutriFlow

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@nutriflow.app
- Documentación: [docs.nutriflow.app](https://docs.nutriflow.app)

---

**Nota**: Esta aplicación es una herramienta de seguimiento y no reemplaza el consejo médico profesional. Consulta siempre con un profesional de la salud antes de comenzar cualquier programa de nutrición o ejercicio.
