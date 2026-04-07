# 🔑 Configuración de Google Gemini API para NutriFlow

## ⚠️ **IMPORTANTE: Seguridad de tu API Key**

**NUNCA compartas tu API key públicamente como hiciste antes.**

Si ya compartiste tu key:
1. ✅ **Elimínala inmediatamente** en: https://aistudio.google.com/app/apikey
2. ✅ **Genera una nueva**
3. ✅ **Guárdala en `.env.local`** (nunca la subas a Git)

---

## 📋 Paso 1: Obtener API Key de Gemini

### Opción A: Google AI Studio (Recomendado - Gratis)

1. **Ve a:** https://aistudio.google.com/app/apikey
2. **Inicia sesión** con tu cuenta de Google
3. **Click en "Create API Key"**
4. **Selecciona un proyecto** o crea uno nuevo
5. **Copia tu API key** (empieza con `AIzaSy...`)

### Opción B: Google Cloud Console

1. **Ve a:** https://console.cloud.google.com/
2. **Crea o selecciona un proyecto**
3. **Habilita Gemini API** en "APIs & Services"
4. **Ve a "Credentials"** → "Create Credentials" → "API Key"
5. **Copia tu API key**

---

## 🔧 Paso 2: Configurar en NutriFlow

### Agregar al `.env.local`:

```env
# Google Gemini API Key
GEMINI_API_KEY=AIzaSy... (tu key aquí)
```

### **NO hagas esto:**
```env
❌ GEMINI_API_KEY=AIzaSyCMn6hOvBZ9VzYQb9PpYIndTcNLUjcRkv8  # ¡NUNCA la compartas!
```

### **Haz esto:**
```env
✅ GEMINI_API_KEY=AIzaSy...  # Tu NUEVA key (secreta)
```

---

## 📝 Paso 3: Verificar Configuración

### Test rápido:

```bash
# Reinicia el servidor de desarrollo
npm run dev

# Ve a: http://localhost:3000/chat
# Envía un mensaje de prueba
```

### Verificar en consola:

```
✅ Gemini API configurada
✅ Chat funcionando
```

---

## 💰 Costos y Límites

### Plan Gratuito (Generous Free Tier):

| Recurso | Límite |
|---------|--------|
| Requests por minuto | 60 |
| Requests por día | 1500 |
| Tokens por minuto | 60,000 |
| Tokens por día | 1,000,000 |

### Para NutriFlow:

- **Usuarios Free:** 10 mensajes/día = ~500 tokens/mensaje
- **Usuarios Premium:** Ilimitado (pero monitorear uso)

**Costo estimado:**
- 100 usuarios × 10 mensajes/día = 1000 mensajes/día
- 1000 × 500 tokens = 500,000 tokens/día
- **Gratis** (dentro del límite de 1M tokens/día)

---

## 🤖 Modelo Gemini Usado

**Modelo:** `gemini-pro`

**Características:**
- ✅ Texto de entrada y salida
- ✅ 32K contexto (30,000 palabras)
- ✅ Multilingüe (español incluido)
- ✅ Optimizado para diálogo
- ✅ Rápido y eficiente

**Alternativas:**
- `gemini-1.5-pro`: Más inteligente, más caro
- `gemini-1.5-flash`: Más rápido, más barato

---

## 🔒 Mejores Prácticas de Seguridad

### 1. **Nunca commitees tu API key**

```bash
# Verifica que .env.local esté en .gitignore
cat .gitignore | grep env
# Debería mostrar: .env.local
```

### 2. **Usa variables de entorno en producción**

**Vercel:**
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega `GEMINI_API_KEY`
4. Deploy

### 3. **Monitorea tu uso**

**Google AI Studio:**
- Ve a: https://aistudio.google.com/app/quota
- Revisa tu uso diario
- Configura alertas si es necesario

### 4. **Rate Limiting en tu app**

Ya implementado en `/api/chat/message`:
- Free: 10 mensajes/día
- Premium: Ilimitado (con monitoreo)

---

## 🚀 Comandos Útiles

### Verificar si la API key funciona:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=TU_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hola"}]}]}'
```

### Ver uso actual:

```bash
# En tu app: http://localhost:3000/api/chat/limit
curl http://localhost:3000/api/chat/limit
```

---

## 🆘 Troubleshooting

### Error: "API_KEY_INVALID"

**Causa:** Tu API key es incorrecta o fue revocada

**Solución:**
1. Verifica que copiaste bien la key
2. Genera una nueva en: https://aistudio.google.com/app/apikey
3. Reinicia el servidor

### Error: "QUOTA_EXCEEDED"

**Causa:** Superaste el límite gratuito

**Solución:**
1. Espera al día siguiente (se resetea a las 00:00 UTC)
2. O habilita billing en Google Cloud para más cuota

### Error: "BILLING_NOT_ENABLED"

**Causa:** Necesitas habilitar billing para más cuota

**Solución:**
1. Ve a: https://console.cloud.google.com/billing
2. Agrega un método de pago
3. Habilita billing en tu proyecto

### Chat no responde

**Causa:** GEMINI_API_KEY no está configurada

**Solución:**
```bash
# Verifica en tu .env.local
cat .env.local | grep GEMINI

# Debería mostrar:
# GEMINI_API_KEY=AIzaSy...
```

---

## 📊 Ejemplo de Uso

### Request:

```json
POST /api/chat/message
{
  "message": "¿Cuántas calorías debo comer para perder peso?",
  "conversationHistory": []
}
```

### Response:

```json
{
  "success": true,
  "message": "Para perder peso de manera saludable...",
  "usage": {
    "used": 1,
    "limit": 10,
    "remaining": 9
  }
}
```

---

## 🎯 Optimización de Costos

### Tips para reducir uso:

1. **Limita longitud de respuestas:**
   ```javascript
   maxOutputTokens: 1024  // Ya configurado
   ```

2. **Usa conversation history corto:**
   ```javascript
   conversationHistory.slice(-5)  // Últimos 5 mensajes
   ```

3. **Cachea respuestas comunes:**
   - Preguntas frecuentes
   - Información nutricional básica

4. **Monitorea usuarios premium:**
   - Si un usuario hace 100+ mensajes/día
   - Considera límite razonable (ej: 100/día)

---

## 📚 Recursos

- **Docs Oficiales:** https://ai.google.dev/docs
- **Gemini API:** https://ai.google.dev/api
- **Pricing:** https://ai.google.dev/pricing
- **Quotas:** https://aistudio.google.com/app/quota
- **Safety:** https://ai.google.dev/responsibilities

---

## ✅ Checklist Final

- [ ] Eliminar API key compartida (si la compartiste)
- [ ] Generar nueva API key
- [ ] Agregar a `.env.local`
- [ ] No commitear `.env.local` a Git
- [ ] Reiniciar servidor
- [ ] Probar chat en `/chat`
- [ ] Verificar que funciona
- [ ] Configurar en Vercel (producción)
- [ ] Monitorear uso en Google AI Studio

---

**¡Listo! Tu chat con Gemini está configurado 🤖**

**URL del chat:** http://localhost:3000/chat
