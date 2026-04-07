# ✅ NutriFlow AI - Checklist de Activación

Imprime esta checklist y márcala a medida que completas cada paso.

---

## 📋 FASE 1: Configuración Básica (HOY - 30 minutos)

### 1. Dependencias de Node.js
- [ ] `npm install` en `nutriflow-app/`
- [ ] Verificar que no hay errores

### 2. Base de Datos MySQL
- [ ] MySQL instalado y corriendo
- [ ] Crear base de datos: `CREATE DATABASE nutriflow_db;`
- [ ] Ejecutar migración 1:
  ```bash
  mysql -u root -p nutriflow_db < scripts/migrations/001-add-promo-codes-table.sql
  ```
- [ ] Ejecutar migración 2:
  ```bash
  mysql -u root -p nutriflow_db < scripts/migrations/002-add-referral-codes-table.sql
  ```
- [ ] Ejecutar migración 3:
  ```bash
  mysql -u root -p nutriflow_db < scripts/migrations/003-add-revenue-tracking-tables.sql
  ```

### 3. Generar Claves de Seguridad
- [ ] Generar JWT Secret:
  ```bash
  openssl rand -base64 64
  # Copia el resultado
  ```
- [ ] Generar AI Agent API Key:
  ```bash
  openssl rand -hex 32
  # Copia el resultado
  ```

### 4. Configurar .env.local
- [ ] Abrir `nutriflow-app/.env.local`
- [ ] Completar `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
- [ ] Pegar JWT_SECRET
- [ ] Pegar AI_AGENT_API_KEY
- [ ] Guardar archivo

### 5. Stripe (Pagos)
- [ ] Ir a https://dashboard.stripe.com/register
- [ ] Crear cuenta
- [ ] Activar modo TEST (toggle arriba izquierda)
- [ ] Ir a Developers → API keys
- [ ] Copiar **Publishable key** (`pk_test_...`)
- [ ] Copiar **Secret key** (`sk_test_...`)
- [ ] Pegar en `.env.local`:
  ```env
  STRIPE_SECRET_KEY=sk_test_...
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  ```
- [ ] Ir a Developers → Webhooks
- [ ] Crear endpoint: `http://localhost:3000/api/subscriptions/webhook`
- [ ] Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] Copiar **Signing secret** (`whsec_...`)
- [ ] Pegar en `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`

### 6. Probar Aplicación
- [ ] `npm run dev`
- [ ] Abrir http://localhost:3000
- [ ] Verificar que carga la landing page
- [ ] Ir a http://localhost:3000/ai-agent
- [ ] Verificar que carga el dashboard (puede estar vacío)

---

## 📋 FASE 2: AI Agent (MAÑANA - 1 hora)

### 7. OpenAI (Generación de Contenido)
- [ ] Ir a https://platform.openai.com/signup
- [ ] Crear cuenta
- [ ] Ir a https://platform.openai.com/api-keys
- [ ] Crear nueva API key
- [ ] Copiar clave (`sk-proj-...`)
- [ ] Pegar en `.env.local`:
  ```env
  OPENAI_API_KEY=sk-proj-...
  ```
- [ ] (Opcional) Agregar $5 de crédito para testing

### 8. Buffer (Redes Sociales)
- [ ] Ir a https://buffer.com
- [ ] Crear cuenta gratuita
- [ ] Conectar al menos 1 red social (Twitter, LinkedIn, etc.)
- [ ] Ir a Settings → API
- [ ] Copiar **Access Token**
- [ ] Pegar en `.env.local`:
  ```env
  BUFFER_ACCESS_TOKEN=...
  ```

### 9. SendGrid (Email Marketing)
- [ ] Ir a https://sendgrid.com
- [ ] Crear cuenta
- [ ] Verificar email
- [ ] Ir a Settings → API Keys
- [ ] Crear API Key (nombre: `NutriFlow`)
- [ ] Copiar clave (`SG.xxxxx`)
- [ ] Pegar en `.env.local`:
  ```env
  SENDGRID_API_KEY=SG.xxxxx
  ```

### 10. Configurar AI Agent de Python
- [ ] Ir a `nutriflow-app/ai-agent/`
- [ ] Copiar `.env.example` a `.env`:
  ```bash
  cp .env.example .env
  ```
- [ ] Abrir `ai-agent/.env`
- [ ] Completar `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- [ ] Pegar `AI_AGENT_API_KEY` (la misma que en el paso 4)
- [ ] Pegar `OPENAI_API_KEY` (la misma que en el paso 7)
- [ ] Pegar `BUFFER_ACCESS_TOKEN` (la misma que en el paso 8)
- [ ] Pegar `SENDGRID_API_KEY` (la misma que en el paso 9)
- [ ] Instalar dependencias de Python:
  ```bash
  pip install -r requirements.txt
  ```
- [ ] Probar script:
  ```bash
  python ai-agent.py
  ```
- [ ] Verificar que no hay errores

### 11. Verificar Dashboard
- [ ] Ir a http://localhost:3000/ai-agent
- [ ] Verificar que muestra:
  - [ ] Configuración de revenue share (70/20/10)
  - [ ] Ingresos (pueden ser $0 al inicio)
  - [ ] Analytics por fuente
  - [ ] Pagos pendientes

---

## 📋 FASE 3: Producción (SEMANA 1-2)

### 12. Publicar en Vercel
- [ ] Ir a https://vercel.com
- [ ] Crear cuenta
- [ ] Importar repositorio de GitHub
- [ ] Configurar build (Next.js, automático)
- [ ] Agregar variables de entorno en Vercel:
  - [ ] Todas las de `.env.local`
- [ ] Deploy
- [ ] Verificar que funciona en https://tu-app.vercel.app

### 13. Dominio Personalizado (Opcional pero recomendado)
- [ ] Comprar dominio (Namecheap, GoDaddy, etc.)
- [ ] En Vercel: Settings → Domains
- [ ] Agregar dominio: `nutriflow.app`
- [ ] Configurar DNS en tu registrador:
  ```
  Type: A, Name: @, Value: 76.76.21.21
  Type: CNAME, Name: www, Value: cname.vercel-dns.com
  ```
- [ ] Esperar propagación (5 min - 24 horas)
- [ ] Verificar HTTPS automático

### 14. Google AdSense (Monetización)
**⚠️ Solo hacer cuando tengas:**
- ✅ Sitio publicado en Vercel
- ✅ Dominio personalizado
- ✅ Al menos 10 artículos de calidad

- [ ] Ir a https://adsense.google.com
- [ ] Crear cuenta
- [ ] Agregar sitio: `https://nutriflow.app`
- [ ] Completar formulario
- [ ] Agregar código de verificación en tu sitio
- [ ] Esperar aprobación (1-7 días)
- [ ] Una vez aprobado:
  - [ ] Ir a Anuncios → Por sitio
  - [ ] Crear unidades (Banner, In-Article)
  - [ ] Copiar Publisher ID (`ca-pub-XXXXXXXXXXXXXX`)
  - [ ] Pegar en `.env.local` (y en Vercel):
    ```env
    NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXX
    ```

### 15. Contrato Legal
- [ ] Imprimir `docs/AI-AGENT-CONTRACT.md`
- [ ] Completar campos entre corchetes `[LIKE THIS]`
- [ ] Firmar (tú y la IA / operador)
- [ ] Guardar copia firmada
- [ ] Escanear y tener digital

### 16. Método de Pago (Para recibir tu 70%)
**Opción A: Stripe Connect (Recomendado)**
- [ ] Ir a https://dashboard.stripe.com/connect
- [ ] Crear cuenta Connect
- [ ] Agregar cuenta bancaria
- [ ] Copiar `account_id`
- [ ] Agregar en base de datos:
  ```sql
  INSERT INTO payout_accounts (id, user_type, payment_type, account_details, is_active)
  VALUES (UUID(), 'owner', 'stripe', JSON_OBJECT('account_id', 'acct_...'), TRUE);
  ```

**Opción B: PayPal**
- [ ] Tener cuenta PayPal verificada
- [ ] Agregar en base de datos:
  ```sql
  INSERT INTO payout_accounts (id, user_type, payment_type, account_details, is_active)
  VALUES (UUID(), 'owner', 'paypal', JSON_OBJECT('email', 'tu@email.com'), TRUE);
  ```

**Opción C: Crypto (USDC)**
- [ ] Tener wallet (MetaMask, Trust Wallet, etc.)
- [ ] Copiar dirección de wallet
- [ ] Agregar en base de datos:
  ```sql
  INSERT INTO payout_accounts (id, user_type, payment_type, account_details, is_active)
  VALUES (UUID(), 'owner', 'crypto', JSON_OBJECT('wallet', '0x...'), TRUE);
  ```

---

## 📋 FASE 4: Monitoreo y Escalamiento (SEMANA 3-4)

### 17. Monitoreo Diario
- [ ] Revisar dashboard `/ai-agent` diariamente
- [ ] Verificar emails diarios de la IA
- [ ] Revisar ingresos acumulados
- [ ] Verificar que pagos se procesan automáticamente

### 18. Optimización
- [ ] Revisar analytics semanales
- [ ] Ajustar estrategia de contenido si es necesario
- [ ] Probar diferentes keywords
- [ ] Optimizar horarios de publicación en redes

### 19. Escalamiento
- [ ] Cuando ROI > 2x, aumentar presupuesto de ads
- [ ] Agregar más plataformas de redes sociales
- [ ] Crear más contenido (2-3 artículos/día)
- [ ] Explorar afiliados y sponsorships

### 20. Reporte Mensual
- [ ] Revisar reporte mensual de ingresos
- [ ] Calcular ROI total
- [ ] Decidir si escalar o mantener
- [ ] Renovar contrato si está por vencer (12 meses)

---

## ✅ Checklist Resumido por Día

### Día 1 (30 min)
- [ ] `npm install`
- [ ] MySQL + migraciones
- [ ] JWT Secret + AI_AGENT_API_KEY
- [ ] Stripe API keys
- [ ] `.env.local` completo
- [ ] `npm run dev` funciona

### Día 2 (1 hora)
- [ ] OpenAI API key
- [ ] Buffer access token
- [ ] SendGrid API key
- [ ] `pip install -r requirements.txt`
- [ ] `python ai-agent.py` funciona
- [ ] Dashboard `/ai-agent` muestra datos

### Semana 1 (2-3 horas)
- [ ] Deploy en Vercel
- [ ] Dominio personalizado
- [ ] Aplicar a AdSense
- [ ] Contrato firmado
- [ ] Método de pago configurado

### Semana 2-4 (1 hora/semana)
- [ ] Monitorear dashboard diariamente
- [ ] Optimizar estrategia
- [ ] Escalar campañas
- [ ] Reporte mensual

---

## 🎯 Progreso

**Completado:** ___ / 20 tareas

**Porcentaje:** ___%

**Próxima tarea:** _______________________

---

## 📞 Notas

Espacio para notas importantes:

```
_________________________________________________
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| MySQL no conecta | Verifica que MySQL está corriendo: `mysql -u root -p` |
| Stripe da error | Asegúrate de estar en modo TEST |
| Python no encuentra módulos | `pip install -r requirements.txt` |
| Dashboard vacío | Ejecuta `python ai-agent.py` para generar datos |
| AdSense rechaza | Espera a tener más contenido y tráfico |

---

**¡Buena suerte con tu NutriFlow AI! 🚀**

**La IA trabaja, tú ganas.**
