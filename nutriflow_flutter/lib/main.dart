import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart' show AppTheme;
import 'presentation/navigation/main_tab_screen.dart';
import 'presentation/providers/auth_provider.dart';
import 'presentation/providers/dashboard_provider.dart';
import 'presentation/providers/food_log_provider.dart';
import 'presentation/providers/ai_chat_provider.dart';
import 'presentation/providers/exercise_provider.dart';
import 'presentation/providers/notification_provider.dart';
import 'presentation/providers/article_provider.dart';
import 'presentation/screens/auth/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..checkSession()),
        ChangeNotifierProvider(create: (_) => DashboardProvider()),
        ChangeNotifierProvider(create: (_) => FoodLogProvider()),
        ChangeNotifierProvider(create: (_) => AiChatProvider()),
        ChangeNotifierProvider(create: (_) => ExerciseProvider()),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
        ChangeNotifierProvider(create: (_) => ArticleProvider()),
      ],
      child: const NutriFlowApp(),
    ),
  );
}

class NutriFlowApp extends StatelessWidget {
  const NutriFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NutriFlow',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const AuthSessionWrapper(),
    );
  }
}

class AuthSessionWrapper extends StatelessWidget {
  const AuthSessionWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    if (authProvider.isLoading && authProvider.currentUser == null) {
      return Scaffold(
        backgroundColor: AppTheme.background,
        body: const Center(
          child: CircularProgressIndicator(color: Color(0xFF10B981)),
        ),
      );
    }

    if (authProvider.isAuthenticated) {
      return const MainTabScreen();
    } else {
      return const LoginScreen();
    }
  }
}
