# 🌿 NutriFlow - MySQL Edition

**Plataforma Digital de Salud Integral — Nutrición + Ejercicio + IA**

Aplicación web moderna con **MySQL** como base de datos para controlar tu alimentación, ejercicio y bienestar general.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Base de Datos**: MySQL 8.0+
- **Autenticación**: JWT con cookies HTTP-only
- **Pagos**: Stripe Checkout
- **UI Components**: Radix UI, shadcn/ui patterns
- **Iconos**: Lucide React

## 📋 Requisitos Previos

- **Node.js** v18+
- **MySQL 8.0+** (o MariaDB 10.3+)
- **npm** o **yarn**

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar MySQL

Inicia sesión en MySQL y ejecuta el script de creación de base de datos:

```bash
mysql -u root -p < scripts/nutriflow-schema.sql
```

O copia y pega el contenido de tu esquema SQL en el cliente de MySQL.

### 3. Configurar variables de entorno

Crea o actualiza `.env.local`:

```env
# MySQL Connection
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña
MYSQL_DATABASE=nutriflow_db

# JWT Secret
JWT_SECRET=tu-clave-secreta-muy-larga-y-segura

# Stripe (opcional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Frontend URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Seed de datos iniciales (opcional)

```bash
npm run seed
```

Esto insertará 8 artículos de nutrición en la base de datos.

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📊 Esquema de Base de Datos

### Tablas Principales

**users** - Perfiles de usuario y suscripciones
- `id` (UUID PRIMARY KEY)
- `email`, `password_hash`, `name`
- `age`, `weight_kg`, `height_cm`, `sex`
- `activity_level`, `goal`
- `subscription_plan` (free/premium/pro)
- `daily_calorie_target`

**food_entries** - Registro de alimentos
- `user_id`, `food_id` (FK)
- `custom_food_name`, `calories`
- `protein_g`, `carbs_g`, `fat_g`
- `meal_type`, `entry_date`

**daily_logs** - Resumen diario
- `user_id`, `log_date`
- `total_calories`, `total_protein_g`, `total_carbs_g`, `total_fat_g`
- `total_water_ml`, `exercise_calories_burned`
- `weight_kg`, `mood`, `sleep_hours`

**water_logs** - Registro de hidratación
- `user_id`, `amount_ml`
- `log_date`, `log_time`

**chat_messages** - Historial de chat IA
- `user_id`, `session_id`
- `role`, `content`, `created_at`

**articles** - Artículos educativos
- `title`, `slug`, `summary`, `content`
- `category`, `is_premium`, `read_time_minutes`

**subscriptions** - Transacciones de pago
- `user_id`, `plan`, `status`
- `stripe_session_id`, `amount_cents`
- `current_period_start`, `current_period_end`

## 🔐 Autenticación

La aplicación usa JWT almacenados en cookies HTTP-only:

- **Registro**: Crea usuario con hash de contraseña (bcrypt)
- **Login**: Verifica credenciales y establece sesión
- **Middleware**: Protege rutas del dashboard

## 🧮 Cálculos Nutricionales

### TDEE (Mifflin-St Jeor)

**Hombres**: `BMR = 10×peso + 6.25×altura − 5×edad + 5`  
**Mujeres**: `BMR = 10×peso + 6.25×altura − 5×edad − 161`

**TDEE** = `BMR × activity_multiplier`

**Objetivo calórico**:
- Perder peso: `TDEE − 500`
- Mantener: `TDEE`
- Ganar: `TDEE + 300`

## 📢 Sistema de Anuncios

Los usuarios gratuitos ven anuncios no invasivos:

- **BannerAd**: Banner superior/inferior
- **ArticleAd**: Entre artículos
- **SponsoredCard**: Cada 3 artículos

Configura Google AdSense en los componentes de anuncios.

## 💳 Stripe (Pagos)

### Configurar productos en Stripe Dashboard:

**NutriFlow Premium**: $9.99 USD mensual  
**NutriFlow Pro**: $19.99 USD mensual

### Testing con tarjetas:
- `4242 4242 4242 4242` — Éxito
- `4000 0000 0000 9995` — Declinada

## 🔒 Seguridad

### Headers de Seguridad (Middleware)
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy
Strict-Transport-Security (production)
```

### Rate Limiting
- API general: 100 requests / 15 min
- Autenticación: 5 intentos / 15 min

### Validación
- XSS protection con `xss` library
- Validación de emails, passwords, números
- Sanitización de inputs

## 📱 Responsive Design

- Mobile-first approach
- Menú hamburguesa para móvil
- Tarjetas y layouts adaptables
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura variables de entorno
3. Usa **PlanetScale** o **Railway** para MySQL en la nube

### MySQL en Producción

Opciones recomendadas:
- **PlanetScale** (MySQL serverless)
- **Railway** (MySQL gestionado)
- **AWS RDS** (MySQL tradicional)
- **DigitalOcean Managed Database**

## 📄 Licencia

MIT License

## 👥 Soporte

- Email: soporte@nutriflow.app
- Documentación: docs.nutriflow.app

---

**Nota**: Esta aplicación es una herramienta de seguimiento y no reemplaza el consejo médico profesional.
