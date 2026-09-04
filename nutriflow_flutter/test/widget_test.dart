import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:nutriflow_flutter/main.dart';
import 'package:nutriflow_flutter/presentation/providers/auth_provider.dart';
import 'package:nutriflow_flutter/presentation/providers/dashboard_provider.dart';
import 'package:nutriflow_flutter/presentation/providers/food_log_provider.dart';
import 'package:nutriflow_flutter/presentation/providers/ai_chat_provider.dart';

void main() {
  testWidgets('NutriFlow app renders auth screen', (WidgetTester tester) async {
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AuthProvider()),
          ChangeNotifierProvider(create: (_) => DashboardProvider()),
          ChangeNotifierProvider(create: (_) => FoodLogProvider()),
          ChangeNotifierProvider(create: (_) => AiChatProvider()),
        ],
        child: const NutriFlowApp(),
      ),
    );

    expect(find.text('NutriFlow'), findsOneWidget);
    expect(find.text('Iniciar Sesión'), findsOneWidget);
  });
}
