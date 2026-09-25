# NutriFlow Android App

Aplicación móvil de NutriFlow para Android - Tu compañero inteligente para una vida más saludable.

## 🚀 Características

- **Autenticación**: Login y registro con JWT
- **Dashboard**: Resumen diario de calorías, macros y agua
- **Registro de Alimentos**: Controla tu alimentación diaria
- **Registro de Ejercicios**: Sigue tu actividad física
- **Perfil**: Gestiona tus datos personales y metas
- **Diseño Moderno**: Material Design 3 con Jetpack Compose

## 🛠️ Tecnologías

- **Lenguaje**: Kotlin 1.9+
- **UI**: Jetpack Compose
- **Arquitectura**: MVVM
- **Inyección de Dependencias**: Hilt
- **Networking**: Retrofit + OkHttp
- **Almacenamiento**: DataStore Preferences
- **Navegación**: Navigation Compose

## 📋 Requisitos

- Android Studio Hedgehog (2023.1.1) o superior
- JDK 17
- Android SDK 24+ (mínimo)
- Android SDK 34 (target)

## 🔧 Configuración

### 1. Abrir el proyecto

```bash
# Abrir Android Studio
File → Open → Seleccionar carpeta Nutriflow-prototype
```

### 2. Sincronizar Gradle

Android Studio sincronizará automáticamente las dependencias.

### 3. Configurar la URL de la API

El archivo `app/build.gradle.kts` ya tiene configurada la URL:

```kotlin
buildConfigField("String", "API_BASE_URL", "\"http://10.0.2.2:3000/api/\"")
```

**Nota**: `10.0.2.2` es la dirección para acceder al localhost desde el emulador de Android.

### 4. Ejecutar la app

```bash
# Opción 1: Desde Android Studio
Click en el botón "Run" (▶️)

# Opción 2: Desde terminal
./gradlew installDebug
```

## 📱 Estructura del Proyecto

```
app/
├── src/main/
│   ├── java/com/nutriflow/app/
│   │   ├── data/
│   │   │   ├── api/           # Retrofit API interfaces
│   │   │   ├── model/         # Data models
│   │   │   └── repository/    # Repositorios
│   │   ├── di/                # Hilt dependency injection
│   │   ├── ui/
│   │   │   ├── components/    # UI components reutilizables
│   │   │   ├── navigation/    # Navegación
│   │   │   ├── screens/       # Pantallas
│   │   │   │   ├── auth/      # Login, Register
│   │   │   │   ├── dashboard/ # Dashboard principal
│   │   │   │   └── onboarding/# Onboarding
│   │   │   └── theme/         # Tema Material Design
│   │   └── NutriFlowApplication.kt
│   ├── res/
│   │   ├── values/            # Colors, Strings, Themes
│   │   └── xml/               # Backup rules
│   └── AndroidManifest.xml
└── build.gradle.kts
```

## 🔑 Endpoints de la API

La app se conecta a la API de NutriFlow en los siguientes endpoints:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrarse |
| GET | `/api/auth/profile` | Obtener perfil |
| PUT | `/api/auth/profile` | Actualizar perfil |
| GET | `/api/food/today` | Alimentos de hoy |
| POST | `/api/food/log` | Agregar alimento |
| GET | `/api/exercise/log` | Ejercicios de hoy |
| POST | `/api/exercise/log` | Agregar ejercicio |
| GET | `/api/stats/today` | Estadísticas de hoy |

## 🎨 Diseño

La app utiliza Material Design 3 con una paleta de colores personalizada:

- **Color Primario**: Emerald (#059669)
- **Color Secundario**: Stone (#57534E)
- **Tema**: Claro/Oscuro automático según el sistema

## 🧪 Testing

```bash
# Ejecutar tests unitarios
./gradlew test

# Ejecutar tests de instrumentación
./gradlew connectedAndroidTest
```

## 📦 Generar APK

```bash
# APK de Debug
./gradlew assembleDebug

# APK de Release (requiere signing)
./gradlew assembleRelease
```

Los APK se generan en:
- `app/build/outputs/apk/debug/app-debug.apk`
- `app/build/outputs/apk/release/app-release.apk`

## 🔐 Seguridad

- Tokens JWT almacenados en DataStore (encriptado)
- Todas las peticiones usan HTTPS en producción
- No se almacenan credenciales en texto plano

## 📝 Próximas Características

- [ ] Reconocimiento de alimentos con IA
- [ ] Gráficos de progreso
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Integración con Google Fit
- [ ] Escáner de códigos de barras

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Pull Request

## 📄 Licencia

Este proyecto es parte de NutriFlow. Todos los derechos reservados.

## 📞 Soporte

Para soporte técnico, contacta a:
- Email: support@nutriflow.app
- Website: https://nutriflow.app

---

**Desarrollado con ❤️ usando Jetpack Compose**
