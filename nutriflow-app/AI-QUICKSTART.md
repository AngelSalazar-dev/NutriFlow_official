# 🤖 NutriFlow AI Agent - Quick Start

## Activar el Sistema de Revenue Sharing

### Paso 1: Ejecutar Migraciones

```bash
# En tu terminal MySQL
mysql -u root -p nutriflow_db < scripts/migrations/001-add-promo-codes-table.sql
mysql -u root -p nutriflow_db < scripts/migrations/002-add-referral-codes-table.sql
mysql -u root -p nutriflow_db < scripts/migrations/003-add-revenue-tracking-tables.sql
```

### Paso 2: Generar API Key para la IA

```bash
# Genera una clave segura
openssl rand -hex 32
# Copia el resultado y pégalo en .env.local
```

En `.env.local`:
```env
AI_AGENT_API_KEY=tu_clave_generada_aqui
```

### Paso 3: Configurar Método de Pago

1. **Opción Stripe Connect** (Recomendado):
   - Ve a [Stripe Connect](https://dashboard.stripe.com/connect)
   - Crea una cuenta Connect
   - Agrega tu cuenta bancaria
   - Copia el `account_id` en `payout_accounts` table

2. **Opción PayPal**:
   - Agrega tu email de PayPal en la tabla `payout_accounts`

3. **Opción Crypto** (USDC):
   - Agrega tu wallet address en la tabla `payout_accounts`

### Paso 4: Actualizar Contrato

1. Abre `docs/AI-AGENT-CONTRACT.md`
2. Completa los campos entre corchetes `[LIKE THIS]`
3. Ambas partes firman (puede ser electrónico)
4. Guarda una copia firmada

### Paso 5: Acceder al Dashboard

1. Inicia sesión en NutriFlow
2. Ve a `/ai-agent` en tu dashboard
3. Verás:
   - Configuración de revenue share
   - Ingresos en tiempo real
   - Pagos pendientes
   - Analytics por fuente

### Paso 6: Conectar la IA

La IA necesitará:
- API Key: `AI_AGENT_API_KEY` de tu `.env.local`
- Endpoint: `https://tu-dominio.com/api/ai/revenue`
- Permisos: Lectura/escritura en revenue_records

**Ejemplo de cómo la IA registra ingresos:**

```python
import requests

API_KEY = "tu_api_key"
BASE_URL = "https://tu-dominio.com"

# Registrar ingreso por suscripción
response = requests.post(
    f"{BASE_URL}/api/ai/revenue/record",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "amount": 9.99,
        "source": "subscription",
        "metadata": {"user_id": "123", "plan": "premium"}
    }
)

print(response.json())
# Resultado:
# {
#   "success": true,
#   "distribution": {
#     "total": 9.99,
#     "ownerShare": 6.99,
#     "reinvestment": 2.00,
#     "aiOperatorShare": 1.00
#   }
# }
```

---

## 📊 ¿Qué Hace la IA Automáticamente?

### Contenido
- ✅ 4+ artículos SEO por mes
- ✅ Posts diarios en redes sociales
- ✅ Emails semanales a usuarios
- ✅ Optimización continua de SEO

### Marketing
- ✅ Gestión de Google/Facebook Ads
- ✅ A/B testing de landing pages
- ✅ Optimización de conversión
- ✅ Recuperación de usuarios inactivos

### Analytics
- ✅ Reportes diarios de ingresos
- ✅ Tracking de métricas clave
- ✅ Detección de anomalías
- ✅ Sugerencias de optimización

---

## 💰 Distribución de Ingresos

Cada vez que la IA genera ingresos:

```
┌────────────────────────────────────────┐
│       INGRESO: $10.00                  │
├────────────────────────────────────────┤
│  $7.00 → Tú (Owner)                    │
│  $2.00 → Reinversión (ads, tools)      │
│  $1.00 → AI Operator                   │
└────────────────────────────────────────┘
```

**Automático:**
- ✅ Registro en base de datos
- ✅ Cálculo de porcentajes
- ✅ Acumulación para payout
- ✅ Pago cuando supera mínimo ($10)

---

## 🛡️ Seguridad y Control

### Límites de la IA

```yaml
# La IA NO puede:
- Gastar más de $50/día en ads
- Gastar más de $500/mes en total
- Firmar contratos sin aprobación
- Acceder a tu cuenta bancaria
- Cambiar configuración de revenue share
```

### Alertas Automáticas

Recibirás:
- 📧 Email diario con resumen de ingresos
- 🔔 Notificación si gasto > $100
- 📊 Reporte semanal de métricas
- ⚠️ Alerta si revenue cae > 20%

---

## 📈 Monitoreo

### Dashboard en Tiempo Real

Accede a `/ai-agent` para ver:
- Ingresos totales y por fuente
- Tu share acumulado
- Share de la IA
- Fondo de reinversión
- Pagos pendientes y procesados
- Gráficos de evolución

### Comandos Útiles

```sql
-- Ver ingresos totales
SELECT SUM(amount) as total, 
       SUM(owner_share) as owner,
       SUM(ai_operator_share) as ai
FROM revenue_records;

-- Ver ingresos por fuente
SELECT source, SUM(amount) as amount
FROM revenue_records
GROUP BY source;

-- Ver pagos pendientes
SELECT 
  SUM(owner_share) as owner_pending,
  SUM(ai_operator_share) as ai_pending
FROM revenue_records
WHERE distributed = FALSE;
```

---

## 🚀 Escalamiento

### Mes 1-3: Prueba Piloto
- IA genera contenido básico
- Ads con presupuesto limitado ($10-20/día)
- Monitoreo constante de métricas
- Ajuste de estrategia

### Mes 4-6: Crecimiento
- Aumento de presupuesto de ads (si ROI > 2x)
- Más contenido (8+ artículos/mes)
- Campañas en múltiples canales
- Optimización de conversión

### Mes 7-12: Escala
- Presupuesto de ads optimizado ($500-2000/mes)
- Contenido diario en todas las plataformas
- Campañas de afiliados
- Sponsorships automáticos

---

## 📞 Soporte

### Problemas Comunes

**La IA no puede conectarse:**
- Verifica que `AI_AGENT_API_KEY` está configurada
- Revisa que el endpoint `/api/ai/revenue` responde
- Verifica CORS en tu dominio

**Pagos no se procesan:**
- Revisa que `payout_accounts` tiene datos válidos
- Verifica que el monto supera el mínimo ($10)
- Revisa logs de Stripe/PayPal

**Dashboard no muestra datos:**
- Ejecuta `SELECT * FROM revenue_records` para verificar datos
- Revisa permisos de usuario en la base de datos
- Limpia caché del navegador

### Contacto

Para soporte técnico del AI Agent:
- Email: [TU EMAIL]
- Dashboard: `/ai-agent`
- Docs: `AI-AGENT.md`, `docs/AI-AGENT-CONTRACT.md`

---

## ✅ Checklist de Activación

- [ ] Migraciones ejecutadas en MySQL
- [ ] API Key generada y en `.env.local`
- [ ] Contrato firmado (`docs/AI-AGENT-CONTRACT.md`)
- [ ] Cuenta de pago configurada (Stripe/PayPal/Crypto)
- [ ] Dashboard accesible en `/ai-agent`
- [ ] IA tiene credenciales para conectarse
- [ ] Límites de gasto configurados
- [ ] Emails de alerta verificados

---

## 🎉 ¡Listo!

Una vez completado el checklist:

1. La IA puede comenzar a operar automáticamente
2. Los ingresos se distribuyen en tiempo real
3. Los pagos se procesan automáticamente
4. Tú recibes 70% sin hacer nada

**La IA trabaja, tú ganas. 🚀**

---

**Última actualización:** 2026-03-28
**Versión:** 1.0.0
