# 📢 Configuración de Google AdSense para NutriFlow

Esta guía te ayudará a configurar Google AdSense para mostrar anuncios a usuarios gratuitos.

## 📋 Requisitos Previos

- Tener una cuenta de Google
- Sitio web publicado (puede estar en desarrollo)
- Contenido original y de calidad

## 🚀 Paso 1: Crear Cuenta en Google AdSense

1. Ve a [Google AdSense](https://www.google.com/adsense)
2. Click en **Comenzar**
3. Ingresa tu sitio web: `https://tu-dominio.com`
4. Completa el formulario con tus datos
5. Acepta los términos y condiciones

## ⏳ Paso 2: Esperar Aprobación

Google revisará tu sitio (puede tomar 1-7 días). Recibirás un email cuando sea aprobado.

### Tips para Aprobación Rápida

- ✅ Contenido original y útil
- ✅ Navegación clara
- ✅ Política de privacidad visible
- ✅ Página "Sobre nosotros"
- ✅ Información de contacto
- ✅ Diseño responsive

## 🔧 Paso 3: Obtener Código de AdSense

Una vez aprobado:

1. Inicia sesión en [AdSense Dashboard](https://www.google.com/adsense)
2. Ve a **Anuncios → Por sitio**
3. Click en **+ Nuevo grupo de anuncios**
4. Configura:
   - **Nombre**: Banner Principal
   - **Tipo de anuncio**: Anuncios display
   - **Tamaños**: 728x90, 300x250, 320x50 (responsive)
5. Click en **Crear**

## 📝 Paso 4: Agregar Script de AdSense

### En el Root Layout (`app/layout.tsx`)

Agrega el script de AdSense en el `<head>`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Reemplaza `ca-pub-XXXXXXXXXXXXXX` con tu **Publisher ID** de AdSense.

### Variables de Entorno (`.env.local`)

```env
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_BANNER=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE=0987654321
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=5678901234
```

## 🎯 Paso 5: Crear Unidades de Anuncio

### Banner Principal (Header/Footer)

1. En AdSense: **Anuncios → Por sitio**
2. Crea unidad **Display responsive**
3. Copia el **Ad slot ID** (ej: `1234567890`)
4. Agrega a `.env.local`: `NEXT_PUBLIC_ADSENSE_SLOT_BANNER=1234567890`

### In-Article (Entre artículos)

1. Crea unidad **In-article**
2. Copia el **Ad slot ID**
3. Agrega a `.env.local`: `NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE=0987654321`

### Sidebar (Barra lateral)

1. Crea unidad **Display responsive**
2. Copia el **Ad slot ID**
3. Agrega a `.env.local`: `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=5678901234`

## 💻 Paso 6: Usar Componentes de Anuncios

### Banner en Dashboard

```tsx
import { BannerAd } from '@/components/ads/BannerAd';

export default function DashboardPage() {
  return (
    <div>
      <BannerAd position="top" />
      {/* Contenido */}
      <BannerAd position="bottom" />
    </div>
  );
}
```

### Anuncios en Artículos

```tsx
import { ArticleAd } from '@/components/ads/BannerAd';

export default function ArticlesPage() {
  return (
    <div>
      <Article />
      <ArticleAd />
      <Article />
    </div>
  );
}
```

## 📊 Paso 7: Monitorear Rendimiento

### Métricas Clave en AdSense Dashboard

- **Impresiones**: Cuántas veces se mostró el anuncio
- **Clics**: Cuántos clics recibieron
- **CTR**: Click-through rate (clics/impresiones)
- **RPM**: Revenue per mille (ingresos por 1000 impresiones)
- **Ingresos**: Total ganado

### Optimización

- 📈 **CTR bajo**: Prueba diferentes tamaños/posiciones
- 💰 **RPM bajo**: Mejora contenido en páginas de alto tráfico
- 📱 **Mobile**: Asegura anuncios responsive

## 🎨 Mejores Prácticas

### UX-Friendly

- ✅ No más de 3 anuncios por página
- ✅ Anuncios no intrusivos
- ✅ Contenido siempre visible
- ✅ Cerrar anuncios fácil

### Cumplimiento

- ✅ No hacer clic en tus propios anuncios
- ✅ No pedir a otros que hagan clic
- ✅ Respetar políticas de AdSense
- ✅ Mostrar aviso de cookies

## 💡 Tips de Revenue

1. **Contenido de calidad** = Más tráfico = Más ingresos
2. **SEO optimizado** = Visitas orgánicas
3. **Contenido actualizado** = Usuarios recurrentes
4. **Redes sociales** = Más alcance
5. **Email marketing** = Retención

## 🚫 Errores Comunes

| Error | Consecuencia | Solución |
|-------|--------------|----------|
| Clics en tus anuncios | Suspensión | Nunca hagas clic en tus anuncios |
| Contenido copiado | Rechazo | Crea contenido original |
| Demasiados anuncios | Mala UX | Máximo 3 por página |
| Sin política de privacidad | Rechazo | Agrega página de privacidad |

## 🔒 Privacidad y GDPR

### Agrega Aviso de Cookies

```tsx
// components/CookieConsent.tsx
export function CookieConsent() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookie-consent');
    if (hasAccepted) setAccepted(true);
  }, []);

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-stone-900 text-white p-4 z-50">
      <p>
        Usamos cookies de Google AdSense para mostrar anuncios relevantes.
        {' '}
        <a href="/privacy" className="underline">Más información</a>
      </p>
      <button onClick={() => {
        localStorage.setItem('cookie-consent', 'true');
        setAccepted(true);
      }}>
        Aceptar
      </button>
    </div>
  );
}
```

## 📈 Escalando

### Cuando tengas +10K visitas/mes

- **AdSense Premium**: Mejor soporte, más opciones
- **Anuncios directos**: Vende espacios directamente
- **Sponsorships**: Colaboraciones con marcas

### Alternativas a AdSense

- **Media.net**: Similar a AdSense
- **Ezoic**: IA para optimizar ingresos
- **Mediavine**: Para sitios con +50K sesiones/mes

## 🆘 Troubleshooting

### Anuncios no se muestran

- ✅ Verifica que el script está en el `<head>`
- ✅ Revisa que el Publisher ID es correcto
- ✅ Espera 24-48 horas después de crear unidades
- ✅ Revisa consola del navegador por errores

### Cuenta rechazada

- ✅ Mejora contenido original
- ✅ Agrega páginas legales (privacidad, términos)
- ✅ Mejora navegación del sitio
- ✅ Vuelve a aplicar después de mejorar

---

**Recursos:**

- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [AdSense API](https://developers.google.com/adsense)
