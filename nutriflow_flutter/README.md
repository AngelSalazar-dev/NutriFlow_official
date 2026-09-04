# NutriFlow Flutter

Mobile application for NutriFlow - nutrition tracking and AI coaching.

## Stack

- **Framework:** Flutter 3.44+
- **Language:** Dart 3.12+
- **State Management:** Provider
- **HTTP Client:** `http` package with singleton ApiClient
- **Auth:** JWT Bearer tokens stored in SharedPreferences
- **Fonts:** Outfit + Inter (via Google Fonts)
- **Charts:** Custom Canvas (CustomPainter)

## Setup

```bash
# Install dependencies
flutter pub get

# Copy environment config
cp .env.example .env
# Edit .env with your API URL

# Run on web
flutter run -d chrome

# Build web
flutter build web
```

## Architecture

```
lib/
├── core/
│   ├── network/api_client.dart    # Singleton HTTP client with JWT
│   └── theme/app_theme.dart       # Dark theme tokens
├── data/
│   ├── models/                    # User, FoodEntry, DailyLog, etc.
│   └── repositories/              # API calls for each domain
└── presentation/
    ├── navigation/                # MainTabScreen (BottomNavigationBar)
    ├── providers/                 # State management (ChangeNotifier)
    └── screens/
        ├── auth/                  # Login, Register
        ├── dashboard_screen.dart  # Daily macros, hydration
        ├── food_log_screen.dart   # Meal logging, search, smart log
        ├── exercise_screen.dart   # Exercise logging
        ├── ai_chat_screen.dart    # AI nutrition assistant
        ├── profile_screen.dart    # User profile, metrics
        ├── articles_screen.dart   # Educational articles
        ├── notifications_screen.dart
        ├── subscription_screen.dart
        └── settings_screen.dart
```

## API Configuration

All API calls go to the configured `API_URL`. The `.env` file should contain:

```
API_URL=http://localhost:3000/api
```

For Android emulator, use `http://10.0.2.2:3000/api`.
For physical devices on the same network, use your machine's local IP.

## Features

- **Auth:** Register, Login, JWT session management
- **Dashboard:** Calorie ring, macros progress, hydration tracker
- **Food Log:** Manual logging, preset library, API search, AI smart log
- **Exercise:** Log workouts, track calories burned
- **AI Chat:** Nutrition assistant with conversation history
- **Profile:** Body metrics, TDEE calculation, preferences
- **Articles:** Educational content library
- **Notifications:** In-app notification center
- **Subscriptions:** Plan management (Free / Premium / Pro)
