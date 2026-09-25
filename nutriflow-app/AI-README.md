# 🚀 NutriFlow AI - Sistema Completo de Ingresos Autónomos

## 📖 ¿Qué Es Esto?

NutriFlow es una plataforma SaaS de nutrición y ejercicio que puede ser gestionada **automáticamente por una IA**, generando ingresos y compartiendo un porcentaje contigo (el propietario).

### 💰 Modelo de Revenue Sharing

```
┌────────────────────────────────────────┐
│       INGRESO TOTAL (100%)             │
├────────────────────────────────────────┤
│  70% → Tú (Owner)                      │
│  20% → Reinversión (ads, herramientas) │
│  10% → IA Operator                     │
└────────────────────────────────────────┘
```

---

## 🎯 ¿Qué Hace la IA Automáticamente?

| Tarea | Frecuencia | Impacto |
|-------|------------|---------|
| 📝 Generar artículos SEO | 1-2/día | +30% tráfico orgánico |
| 📱 Publicar en redes sociales | Diario | +50% engagement |
| 📧 Email marketing | Semanal | +20% retención |
| 💰 Optimizar ingresos | Continuo | ROAS > 3x |
| 📊 Reportes y analytics | Diario | Transparencia total |

---

## 📋 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `APIS-NEEDED.md` | **LEE ESTO PRIMERO** - Qué APIs necesitas y cómo obtenerlas |
| `AI-QUICKSTART.md` | Guía rápida de activación |
| `AI-AGENT.md` | Documentación completa del sistema |
| `docs/AI-AGENT-CONTRACT.md` | Contrato legal entre tú y la IA |
| `ai-agent/ai-agent.py` | Script de Python que automatiza todo |
| `app/(dashboard)/ai-agent/page.tsx` | Dashboard de transparencia |

---

## ⚡ Inicio Rápido (15 minutos)

### Paso 1: Instalar dependencias

```bash
cd nutriflow-app
npm install
```

### Paso 2: Configurar base de datos

```bash
# Ejecutar migraciones
mysql -u root -p nutriflow_db < scripts/migrations/001-add-promo-codes-table.sql
mysql -u root -p nutriflow_db < scripts/migrations/002-add-referral-codes-table.sql
mysql -u root -p nutriflow_db < scripts/migrations/003-add-revenue-tracking-tables.sql
```

### Paso 3: Generar claves

```bash
# JWT Secret
openssl rand -base64 64

# AI Agent API Key
openssl rand -hex 32
```

### Paso 4: Configurar .env.local

Abre `.env.local` y completa:

```env
# Base de datos
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=tu_contraseña
MYSQL_DATABASE=nutriflow_db

# JWT Secret (pega el generado)
JWT_SECRET=...

# AI Agent API Key (pega el generado)
AI_AGENT_API_KEY=...
```

### Paso 5: Iniciar la app

```bash
npm run dev
```

Visita http://localhost:3000/ai-agent

---

## 🔑 APIs Necesarias

### Nivel 1: Esenciales (HOY)

| API | Tiempo | Costo |
|-----|--------|-------|
| Stripe | 10 min | Gratis (2.9% + $0.30/tx) |
| MySQL | 5 min | Gratis (local) |
| JWT Secret | 1 min | Gratis |

### Nivel 2: Para AI Agent (MAÑANA)

| API | Tiempo | Costo |
|-----|--------|-------|
| OpenAI | 5 min | ~$0.01-0.10/artículo |
| Buffer | 10 min | Gratis (3 canales) |
| SendGrid | 5 min | Gratis (100 emails/día) |

### Nivel 3: Monetización (SEMANA 1-2)

| API | Tiempo | Costo |
|-----|--------|-------|
| Google AdSense | 15 min + 1-7 días | Gratis (32% comisión) |

**📖 Ver `APIS-NEEDED.md` para instrucciones detalladas de cada API.**

---

## 🤖 Cómo Funciona la IA

### 1. La IA se conecta a tu API

```python
# ai-agent/ai-agent.py
response = requests.post(
    'http://localhost:3000/api/ai/revenue/record',
    headers={'Authorization': 'Bearer AI_AGENT_API_KEY'},
    json={'amount': 9.99, 'source': 'subscription'}
)
```

### 2. Registra ingresos automáticamente

Cada vez que la IA genera revenue:
- $9.99 suscripción → $6.99 tú, $2.00 reinversión, $1.00 IA
- $0.50 AdSense → $0.35 tú, $0.10 reinversión, $0.05 IA

### 3. Los pagos son automáticos

Cuando acumula $10+:
- Stripe Connect → Tu cuenta bancaria
- PayPal → Tu email
- Crypto → Tu wallet USDC

### 4. Dashboard en tiempo real

En `/ai-agent` ves:
- Ingresos totales y por fuente
- Tu share acumulado
- Share de la IA
- Pagos pendientes

---

## 📊 Proyección de Ingresos

### Escenario Conservador (Mes 6)

| Fuente | Ingreso Mensual |
|--------|-----------------|
| Suscripciones (50 Premium + 10 Pro) | $699 |
| AdSense (10K visitas/mes) | $200 |
| Afiliados | $100 |
| **Total** | **$999/mes** |

### Tu Share (70%)

| Mes | Ingreso Total | Tú (70%) | IA (10%) | Reinversión (20%) |
|-----|---------------|----------|----------|-------------------|
| 1 | $100 | $70 | $10 | $20 |
| 3 | $500 | $350 | $50 | $100 |
| 6 | $1,000 | $700 | $100 | $200 |
| 12 | $5,000 | $3,500 | $500 | $1,000 |

---

## 🛠️ Estructura del Proyecto

```
nutriflow-app/
├── app/
│   ├── (dashboard)/
│   │   ├── ai-agent/         # Dashboard de revenue sharing
│   │   ├── subscription/     # Página de suscripción
│   │   └── ...
│   └── api/
│       ├── ai/
│       │   └── revenue/      # API para que la IA se conecte
│       └── ...
├── ai-agent/
│   ├── ai-agent.py           # Script principal de automatización
│   ├── requirements.txt      # Dependencias de Python
│   └── .env.example          # Ejemplo de variables
├── lib/
│   └── revenue-tracker.ts    # Lógica de revenue sharing
├── docs/
│   └── AI-AGENT-CONTRACT.md  # Contrato legal
├── APIS-NEEDED.md            # Qué APIs necesitas
├── AI-QUICKSTART.md          # Guía rápida
└── AI-AGENT.md               # Documentación completa
```

---

## 📝 Contrato con la IA

El archivo `docs/AI-AGENT-CONTRACT.md` establece:

- **Duración**: 12 meses renovables
- **Revenue Share**: 70% tú / 20% reinversión / 10% IA
- **Pago**: Automático dentro de 24 horas
- **Límites de gasto**: $50/día, $500/mes (sin aprobación)
- **Terminación**: 30 días de aviso
- **Transparencia**: Dashboard 24/7

**Imprime, firma y guarda una copia.**

---

## 🎯 Próximos Pasos

### Hoy (30 minutos)

- [ ] Leer `APIS-NEEDED.md`
- [ ] Obtener Stripe API keys
- [ ] Configurar MySQL
- [ ] Generar JWT Secret y AI_AGENT_API_KEY
- [ ] Ejecutar migraciones
- [ ] `npm run dev`

### Mañana (1 hora)

- [ ] Obtener OpenAI API key
- [ ] Configurar Buffer para redes
- [ ] Configurar SendGrid para emails
- [ ] Probar script de Python: `python ai-agent/ai-agent.py`

### Semana 1

- [ ] Publicar en Vercel
- [ ] Conectar dominio personalizado
- [ ] Aplicar a Google AdSense
- [ ] Firmar contrato (`docs/AI-AGENT-CONTRACT.md`)

### Semana 2-4

- [ ] Monitorear dashboard `/ai-agent`
- [ ] Ajustar estrategia de contenido
- [ ] Optimizar ingresos
- [ ] Escalar campañas

---

## 💡 Tips para Maximizar Ingresos

### Contenido
- ✅ 1 artículo/día mínimo (la IA lo hace automático)
- ✅ Keywords de baja competencia, alto volumen
- ✅ Actualizar artículos antiguos cada 30 días

### Redes Sociales
- ✅ Publicar en horarios pico (8am, 12pm, 8pm)
- ✅ Usar hashtags relevantes (#nutricion, #salud, #fitness)
- ✅ Interactuar con comentarios (la IA puede responder)

### Monetización
- ✅ AdSense en posiciones estratégicas (above the fold)
- ✅ Afiliados de productos que realmente uses
- ✅ Sponsorships cuando tengas 10K+ visitas/mes

---

## 🆘 Soporte y Recursos

### Documentación

- `APIS-NEEDED.md` - Cómo obtener cada API
- `AI-QUICKSTART.md` - Guía de activación
- `AI-AGENT.md` - Sistema completo
- `DEPLOY.md` - Cómo desplegar en Vercel
- `STRIPE-SETUP.md` - Configurar Stripe
- `ADSENSE-SETUP.md` - Configurar AdSense

### Dashboard

- Local: http://localhost:3000/ai-agent
- Producción: https://tu-dominio.com/ai-agent

### Contrato

- `docs/AI-AGENT-CONTRACT.md` - Imprime y firma

---

## ✅ Checklist Final

Antes de lanzar:

- [ ] Todas las APIs configuradas en `.env.local`
- [ ] Migraciones ejecutadas en MySQL
- [ ] `npm run dev` sin errores
- [ ] Dashboard `/ai-agent` accesible
- [ ] Script de Python probado
- [ ] Contrato firmado
- [ ] Método de pago configurado (Stripe/PayPal/Crypto)
- [ ] Límites de gasto verificados

---

## 🎉 ¡Listo!

Una vez completado el checklist:

1. ✅ La IA trabaja 24/7 generando contenido
2. ✅ Los ingresos se distribuyen automáticamente
3. ✅ Tú recibes 70% sin hacer nada
4. ✅ Dashboard en tiempo real para transparencia
5. ✅ Pagos automáticos cuando superan $10

**La IA trabaja, tú ganas. 🚀**

---

## 📞 Contacto

- Dashboard: `/ai-agent`
- Email: [TU EMAIL]
- Contrato: `docs/AI-AGENT-CONTRACT.md`

---

**Última actualización:** 2026-03-28
**Versión:** 2.0.0 (AI Agent Enabled)
