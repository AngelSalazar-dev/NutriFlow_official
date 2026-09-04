import 'package:flutter/material.dart';
import 'dart:math';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../providers/auth_provider.dart';
import '../providers/dashboard_provider.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DashboardProvider>().fetchTodayStats();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final dashboardProvider = Provider.of<DashboardProvider>(context);
    
    final user = authProvider.currentUser;
    final stats = dashboardProvider.todayStats;

    final int calorieGoal = user?.calorieGoal ?? 2000;
    final int caloriesConsumed = stats?.caloriesConsumed ?? 0;
    final int caloriesBurned = stats?.caloriesBurned ?? 0;
    final int waterMl = stats?.waterMl ?? 0;

    int caloriesRemaining = calorieGoal - caloriesConsumed + caloriesBurned;
    double caloriePercentage = calorieGoal > 0 ? (caloriesConsumed / (calorieGoal + caloriesBurned)).clamp(0.0, 1.0) : 0.0;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16.0, top: 8.0, bottom: 8.0),
          child: CircleAvatar(
            backgroundColor: AppTheme.primary.withValues(alpha: 0.2),
            child: Text(
              user?.name.isNotEmpty == true ? user!.name[0].toUpperCase() : 'U',
              style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold),
            ),
          ),
        ),
        title: Row(
          children: [
            const Icon(Icons.spa, color: AppTheme.primary, size: 24),
            const SizedBox(width: 6),
            const Text(
              'NutriFlow',
              style: TextStyle(
                fontFamily: 'Outfit',
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: Colors.white),
            onPressed: () => dashboardProvider.fetchTodayStats(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => dashboardProvider.fetchTodayStats(),
        color: AppTheme.primary,
        backgroundColor: AppTheme.cardBg,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Greeting & Day Badge
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'TODAY',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textMuted,
                          letterSpacing: 1.2,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Good Morning, ${user?.name ?? 'User'}',
                        style: const TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppTheme.primary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.primary.withValues(alpha: 0.2)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.wb_sunny_rounded, color: AppTheme.primary, size: 16),
                        SizedBox(width: 4),
                        Text(
                          'Day 1',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Circular Calorie Wheel card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.cardBg,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Column(
                  children: [
                    // Donut Chart Custompaint
                    SizedBox(
                      height: 180,
                      width: 180,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          CustomPaint(
                            size: const Size(180, 180),
                            painter: CalorieRingPainter(
                              percentage: caloriePercentage,
                              primaryColor: AppTheme.primary,
                              trackColor: AppTheme.border,
                            ),
                          ),
                          Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                caloriesRemaining.toString(),
                                style: const TextStyle(
                                  fontFamily: 'Outfit',
                                  fontSize: 36,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              const Text(
                                'Remaining',
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 13,
                                  color: AppTheme.textSecondary,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Consumed / Burned / Goal Stats Row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatsItem(
                          icon: Icons.restaurant,
                          iconColor: AppTheme.primary,
                          value: '$caloriesConsumed kcal',
                          label: 'Consumed',
                        ),
                        Container(width: 1, height: 36, color: AppTheme.border),
                        _buildStatsItem(
                          icon: Icons.local_fire_department,
                          iconColor: Colors.orangeAccent,
                          value: '$caloriesBurned kcal',
                          label: 'Burned',
                        ),
                        Container(width: 1, height: 36, color: AppTheme.border),
                        _buildStatsItem(
                          icon: Icons.track_changes,
                          iconColor: AppTheme.tertiary,
                          value: '$calorieGoal kcal',
                          label: 'Goal',
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Macros Progress bars
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.cardBg,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Macros',
                          style: TextStyle(
                            fontFamily: 'Outfit',
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        Icon(Icons.info_outline, color: AppTheme.textMuted, size: 16),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _buildMacroBar(
                      label: 'Protein',
                      current: stats?.protein ?? 0,
                      target: ((calorieGoal * 0.3) / 4).round(),
                      color: AppTheme.primary,
                    ),
                    const SizedBox(height: 14),
                    _buildMacroBar(
                      label: 'Carbs',
                      current: stats?.carbs ?? 0,
                      target: ((calorieGoal * 0.4) / 4).round(),
                      color: Colors.cyan,
                    ),
                    const SizedBox(height: 14),
                    _buildMacroBar(
                      label: 'Fats',
                      current: stats?.fat ?? 0,
                      target: ((calorieGoal * 0.3) / 9).round(),
                      color: Colors.orange,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Hydration Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.cardBg,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  'Hydration',
                                  style: TextStyle(
                                    fontFamily: 'Outfit',
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                SizedBox(width: 8),
                                Icon(Icons.opacity, color: Colors.blueAccent, size: 16),
                              ],
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Goal: 2.5L / Day',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 12,
                                color: AppTheme.textSecondary,
                              ),
                            ),
                          ],
                        ),
                        GestureDetector(
                          onTap: () => dashboardProvider.fetchTodayStats(),
                          child: Text(
                            '$waterMl ml',
                            style: const TextStyle(
                              fontFamily: 'Outfit',
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.blueAccent,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        // Glasses Indicators
                        Expanded(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: List.generate(5, (index) {
                              int glassWaterEquivalent = (index + 1) * 500;
                              bool isFilled = waterMl >= glassWaterEquivalent;
                              bool isHalfFilled = !isFilled && waterMl >= (glassWaterEquivalent - 250);
                              return Icon(
                                isFilled
                                    ? Icons.local_drink
                                    : (isHalfFilled ? Icons.local_drink_outlined : Icons.local_drink_outlined),
                                color: isFilled
                                    ? Colors.blueAccent
                                    : (isHalfFilled ? Colors.blueAccent.withValues(alpha: 0.5) : AppTheme.textMuted),
                                size: 32,
                              );
                            }),
                          ),
                        ),
                        const SizedBox(width: 16),
                        // Add Button
                        GestureDetector(
                          onTap: () => dashboardProvider.addWater(250),
                          child: Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppTheme.primary,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(
                              Icons.add,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      '+250ml per glass',
                      style: TextStyle(fontFamily: 'Inter', fontSize: 10, color: AppTheme.textMuted),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Scan Food & Quick Log Row
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.cardBg,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: const BorderSide(color: AppTheme.border),
                        ),
                      ),
                      icon: const Icon(Icons.qr_code_scanner, color: AppTheme.primary),
                      label: const Text(
                        'Scan Food',
                        style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Escaner de código de barras próximamente')),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.cardBg,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: const BorderSide(color: AppTheme.border),
                        ),
                      ),
                      icon: const Icon(Icons.edit_note, color: AppTheme.primary),
                      label: const Text(
                        'Quick Log',
                        style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Registro rápido disponible en la pestaña de comidas')),
                        );
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatsItem({
    required IconData icon,
    required Color iconColor,
    required String value,
    required String label,
  }) {
    return Column(
      children: [
        Row(
          children: [
            Icon(icon, color: iconColor, size: 16),
            const SizedBox(width: 4),
            Text(
              value,
              style: const TextStyle(
                fontFamily: 'Outfit',
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 11,
            color: AppTheme.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildMacroBar({
    required String label,
    required int current,
    required int target,
    required Color color,
  }) {
    double pct = current / target;
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppTheme.textSecondary,
              ),
            ),
            Text(
              '${current}g / ${target}g',
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 12,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: SizedBox(
            height: 8,
            child: LinearProgressIndicator(
              value: pct,
              backgroundColor: AppTheme.border,
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ),
        ),
      ],
    );
  }
}

class CalorieRingPainter extends CustomPainter {
  final double percentage;
  final Color primaryColor;
  final Color trackColor;

  CalorieRingPainter({
    required this.percentage,
    required this.primaryColor,
    required this.trackColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final double strokeWidth = 14.0;
    final Offset center = Offset(size.width / 2, size.height / 2);
    final double radius = (size.width - strokeWidth) / 2;

    // Draw background track
    final Paint trackPaint = Paint()
      ..color = trackColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;
    canvas.drawCircle(center, radius, trackPaint);

    // Draw active progress arc
    final Paint progressPaint = Paint()
      ..color = primaryColor
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = strokeWidth;

    double sweepAngle = 2 * pi * percentage;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2, // Start at the top
      sweepAngle,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CalorieRingPainter oldDelegate) {
    return oldDelegate.percentage != percentage ||
        oldDelegate.primaryColor != primaryColor ||
        oldDelegate.trackColor != trackColor;
  }
}
