# 🚀 Instrucciones para Deploy en Vercel - NutriFlow

## Paso 1: Crear Repositorio en GitHub

1. **Inicia sesión en GitHub**: https://github.com/login

2. **Crea un nuevo repositorio**:
   - Ve a: https://github.com/new
   - Nombre del repositorio: `nutriflow`
   - Descripción: "NutriFlow - Plataforma Digital de Salud Integral | Nutrición + Ejercicio + IA"
   - **NO** lo inicialices con README (ya tenemos el código)
   - Haz clic en **"Create repository"**

3. **Copia la URL del repositorio** (se verá así):
   ```
   https://github.com/TU_USUARIO/nutriflow.git
   ```

## Paso 2: Subir Código a GitHub

Abre una terminal/PowerShell y ejecuta:

```bash
cd "C:\Users\USUARIO DELL\Videos\nutriflow\nutriflow-app"

# Reemplaza TU_USUARIO con tu usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/nutriflow.git

# Sube el código
git branch -M main
git push -u origin main
```

## Paso 3: Deploy en Vercel

1. **Ve a Vercel**: https://vercel.com/signup

2. **Regístrate/Inicia sesión** con tu cuenta de GitHub

3. **Importa el repositorio**:
   - Haz clic en **"Add New Project"**
   - Selecciona **"Import Git Repository"**
   - Busca `nutriflow` y haz clic en **"Import"**

4. **Configura el proyecto**:
   - **Framework Preset**: Next.js (se detecta automáticamente)
   - **Root Directory**: Déjalo como está
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Agrega Variables de Entorno** (Environment Variables):
   - Haz clic en **"Environment Variables"**
   - Agrega cada una de estas variables (puedes usar valores temporales para probar):

   | Variable | Valor (ejemplo) |
   |----------|-----------------|
   | `MYSQL_HOST` | `localhost` |
   | `MYSQL_PORT` | `3306` |
   | `MYSQL_USER` | `root` |
   | `MYSQL_PASSWORD` | `tu_password` |
   | `MYSQL_DATABASE` | `nutriflow_db` |
   | `JWT_SECRET` | `tu-clave-secreta-muy-larga-y-segura-12345` |
   | `STRIPE_SECRET_KEY` | `sk_test_your_stripe_secret_key` |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_your_webhook_secret` |
   | `NEXT_PUBLIC_APP_URL` | `https://nutriflow.vercel.app` |

6. **Haz clic en "Deploy"** 🚀

## Paso 4: ¡Listo!

- Vercel construirá tu aplicación automáticamente
- En ~2 minutos tendrás tu SaaS disponible en: **`https://nutriflow.vercel.app`**
- Cada vez que hagas push a GitHub, Vercel hará deploy automático

---

## 📝 Notas Importantes

### Base de Datos en la Nube (Recomendado para Producción)

Para que tu SaaS funcione en producción, necesitas una base de datos MySQL en la nube:

**Opción 1: PlanetScale** (Recomendado)
- https://planetscale.com/
- Gratis para empezar
- MySQL compatible

**Opción 2: Railway**
- https://railway.app/
- Fácil de configurar
- $5 USD/mes aproximadamente

**Opción 3: AWS RDS**
- https://aws.amazon.com/rds/
- Más complejo pero escalable

### Dominio Personalizado (Opcional)

Si quieres un dominio personalizado (.com, .app, etc.):
1. Compra tu dominio en Namecheap, GoDaddy, etc.
2. En Vercel, ve a tu proyecto → Settings → Domains
3. Agrega tu dominio y sigue las instrucciones de DNS

---

## 🎯 URLs del Proyecto

- **Desarrollo local**: `http://localhost:3000`
- **Producción (Vercel)**: `https://nutriflow.vercel.app`
- **Dashboard de Vercel**: https://vercel.com/dashboard

---

## ✅ Checklist Final

- [ ] Repositorio creado en GitHub
- [ ] Código subido a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] Base de datos configurada en la nube
- [ ] Pruebas de funcionalidad completadas

---

**¡Tu SaaS NutriFlow estará en línea y accesible para todo el mundo!** 🎉
