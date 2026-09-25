# Plan de Implementación: NutriFlow Mobile App

Este documento detalla el plan técnico para desarrollar la aplicación móvil nativa de NutriFlow, replicando la estética minimalista y funcionalidad de la plataforma web existente.

## 1. Objetivo General
Construir una aplicación móvil desde cero utilizando **React Native**, **Expo Router** y **TypeScript**, alojada en una carpeta independiente (`nutriflow-mobile`). La aplicación se conectará directamente a la API web actual (Next.js) y mantendrá la identidad visual: fondo oscuro (`#0F0F0F`), acentos verdes suaves y tipografías limpias.

## 2. Pila Tecnológica
- **Framework:** React Native con Expo (SDK 50+)
- **Enrutamiento:** Expo Router (estructura `/app` basada en sistema de archivos)
- **Lenguaje:** TypeScript
- **Estilos:** NativeWind v4 (Tailwind CSS adaptado para móvil)
- **Iconografía:** `lucide-react-native`
- **Peticiones HTTP:** Axios (reutilizando y adaptando servicios de la web)
- **Gráficos:** `react-native-svg` (para donas y barras de macros)

## 3. Arquitectura del Proyecto

El proyecto móvil vivirá en `c:\Users\USUARIO DELL\Videos\nutriflow\nutriflow-mobile` y tendrá una estructura modular:

```text
nutriflow-mobile/
├── app/                      # Rutas de Expo Router
│   ├── (tabs)/               # Navegación principal (Pestañas inferiores)
│   │   ├── _layout.tsx       # Configuración del Tab Bar
│   │   ├── index.tsx         # Dashboard (Macros y Progreso)
│   │   ├── food-log.tsx      # Registro de Comidas
│   │   └── recipes.tsx       # Catálogo de Recetas
│   ├── _layout.tsx           # Layout principal (Auth Provider, Theme)
│   └── +not-found.tsx        # Pantalla de error 404
├── components/               # Componentes de UI reutilizables
│   ├── ui/                   # Botones, Inputs, Tarjetas (View, Text)
│   └── charts/               # Gráficos SVG para macros
├── lib/                      # Lógica extraída de la web
│   ├── axios.ts              # Configuración de Axios con URLs absolutas
│   └── api/                  # Servicios de datos (comida, perfil, etc.)
├── constants/                # Variables y Tokens de Diseño
│   └── theme.ts              # Colores (#0F0F0F, verdes) y tipografía
├── tailwind.config.js        # Configuración de NativeWind
└── package.json
```

## 4. Identidad Visual y Estilizado (NativeWind)

Se configurará el archivo `tailwind.config.js` del proyecto móvil para inyectar los tokens de diseño de la web:

- **Fondo Principal:** `#0F0F0F` (Darker than standard slate para un look premium).
- **Acentos (Verde Suave):** Replicando las variables `--primary` (`#10b981` / `#059669`) de `globals.css`.
- **Componentes Nativos:** Las clases de Tailwind se aplicarán a `<View>`, `<Text>`, `<TouchableOpacity>`, y `<TextInput>`, reemplazando `div`, `span`, `button` e `input`.

## 5. Integración con el Backend Existente

Para no duplicar la lógica de negocio, extraeremos los servicios y hooks del proyecto `nutriflow-app`.
Dado que la app web y la API viven juntas, la app móvil requerirá **URLs absolutas**.

1. Se creará un archivo `.env` en la carpeta móvil con `EXPO_PUBLIC_API_URL`.
2. Se configurará una instancia de `Axios` dedicada:
```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api', // IP local para pruebas en simulador
  withCredentials: true,
});
```

## 6. Fases de Ejecución

### Fase 1: Inicialización del Proyecto
1. Ejecutar `npx create-expo-app@latest nutriflow-mobile --template blank-typescript`.
2. Instalar dependencias: `nativewind`, `tailwindcss`, `expo-router`, `lucide-react-native`, `axios`, `react-native-svg`.
3. Configurar Babel y NativeWind.

### Fase 2: Configuración de Navegación y UI Base
1. Crear el sistema de pestañas (`app/(tabs)/_layout.tsx`) con un fondo oscuro y los íconos correspondientes usando Lucide.
2. Definir estilos globales y colores base.

### Fase 3: Traducción de Vistas
1. **Dashboard (`index.tsx`):** Traducir el panel de macros a componentes nativos e implementar gráficos de progreso usando SVG puro o `react-native-svg-charts`.
2. **Food Log (`food-log.tsx`):** Crear listas desplazables (`FlatList`) y formularios para buscar alimentos.
3. **Recipes (`recipes.tsx`):** Catálogo tipo grilla usando `FlatList` con numColumns.

### Fase 4: Integración y Pruebas
1. Traer los servicios de la carpeta web e inyectar el token de sesión o conectar el contexto de autenticación.
2. Levantar el simulador usando `npx expo start`.
3. Ajustar márgenes, áreas seguras (SafeAreaView) y evitar desbordamientos de pantalla.

> [!IMPORTANT]
> **Requisito de Conectividad Local**
> Para que el simulador o el dispositivo físico (vía Expo Go) se comuniquen con el backend local (Next.js), el `EXPO_PUBLIC_API_URL` deberá apuntar a la dirección IPv4 de la máquina de desarrollo (ej. `http://192.168.x.x:3000/api`), no a `localhost`.

## Preguntas Abiertas para el Usuario

- ¿Deseas que la aplicación móvil soporte únicamente el modo oscuro (Dark Mode estricto), o quieres que herede la dualidad (Light/Dark) de la versión web?
- ¿El backend actual de Next.js (`nutriflow-app`) ya maneja el intercambio de tokens JWT a través de headers de autenticación estándar (`Authorization: Bearer <token>`), o depende exclusivamente de cookies `httpOnly`? (En móviles, el manejo de cookies es distinto al navegador y se recomienda usar tokens en headers con SecureStore).
