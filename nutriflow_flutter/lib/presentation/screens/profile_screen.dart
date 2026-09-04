import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../providers/auth_provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late TextEditingController _weightController;
  late TextEditingController _heightController;
  String _activityLevel = 'Moderately Active';
  bool _pushNotifications = true;

  @override
  void initState() {
    super.initState();
    _weightController = TextEditingController();
    _heightController = TextEditingController();
  }

  @override
  void dispose() {
    _weightController.dispose();
    _heightController.dispose();
    super.dispose();
  }

  void _recalculateMacros() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final user = authProvider.currentUser;
    if (user == null) return;

    final weight = double.tryParse(_weightController.text) ?? user.weight;
    final height = double.tryParse(_heightController.text) ?? user.height;

    authProvider.updateProfile(
      weight: weight,
      height: height,
      activityLevel: _activityLevel.toLowerCase().replaceAll(' ', ''),
    );

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Perfil actualizado correctamente'),
        backgroundColor: AppTheme.primary,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.currentUser;

    _weightController.text = user?.weight.toStringAsFixed(1) ?? '';
    _heightController.text = user?.height.toStringAsFixed(1) ?? '';

    final goalLabels = {
      'lose': 'Perder peso',
      'maintain': 'Mantener peso',
      'gain': 'Aumentar masa muscular',
    };
    final String goalLabel = goalLabels[user?.goal] ?? user?.goal ?? '';

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
              'Profile',
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
            icon: const Icon(Icons.notifications_none_rounded, color: Colors.white),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Notificaciones próximamente')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User Header Profile info
            Center(
              child: Column(
                children: [
                  const SizedBox(height: 10),
                  Stack(
                    alignment: Alignment.bottomRight,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: AppTheme.primary,
                          shape: BoxShape.circle,
                        ),
                        child: CircleAvatar(
                          radius: 46,
                          backgroundImage: user?.avatarUrl != null
                              ? NetworkImage(user!.avatarUrl!)
                              : null,
                          child: user?.avatarUrl == null
                              ? Text(
                                  user?.name.isNotEmpty == true ? user!.name[0].toUpperCase() : 'U',
                                  style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: AppTheme.primary),
                                )
                              : null,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(
                          color: AppTheme.primary,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.edit, color: Colors.white, size: 14),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    user?.name ?? 'Usuario',
                    style: const TextStyle(
                      fontFamily: 'Outfit',
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    user?.email ?? '',
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 13,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Badges
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppTheme.primary.withValues(alpha: 0.2)),
                        ),
                        child: Text(
                          user?.subscriptionPlan == 'premium' || user?.subscriptionPlan == 'pro'
                              ? 'Premium'
                              : 'Free',
                          style: const TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primary,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.tertiary.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppTheme.tertiary.withValues(alpha: 0.2)),
                        ),
                        child: Text(
                          goalLabel,
                          style: const TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.tertiary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Upgrade Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primary, Color(0xFF047857)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        user?.subscriptionPlan == 'premium' || user?.subscriptionPlan == 'pro'
                            ? 'NutriFlow Elite ★'
                            : 'Upgrade to Elite ★',
                        style: const TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const Icon(Icons.star, color: Colors.yellowAccent, size: 20),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    user?.subscriptionPlan == 'premium' || user?.subscriptionPlan == 'pro'
                        ? 'Enjoying premium features!'
                        : 'Unlock advanced AI macro coaching and personalized workout generation.',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 13,
                      color: Colors.white.withValues(alpha: 0.85),
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: AppTheme.primary,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    onPressed: () {},
                    child: Text(
                      user?.subscriptionPlan == 'premium' || user?.subscriptionPlan == 'pro'
                          ? 'Manage'
                          : 'Upgrade Now',
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Body Metrics Form
            Text(
              'Body Metrics',
              style: const TextStyle(
                fontFamily: 'Outfit',
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 14),

            _buildInputLabel('Current Weight (kg)'),
            TextField(
              controller: _weightController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: user?.weight.toStringAsFixed(1) ?? '70.0',
                filled: true,
                fillColor: AppTheme.cardBg,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppTheme.primary, width: 1.5),
                ),
              ),
            ),
            const SizedBox(height: 14),

            _buildInputLabel('Height (cm)'),
            TextField(
              controller: _heightController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: user?.height.toStringAsFixed(1) ?? '170.0',
                filled: true,
                fillColor: AppTheme.cardBg,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppTheme.primary, width: 1.5),
                ),
              ),
            ),
            const SizedBox(height: 14),

            _buildInputLabel('Activity Level'),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: AppTheme.cardBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.border),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _activityLevel,
                  dropdownColor: AppTheme.cardBg,
                  style: const TextStyle(color: Colors.white, fontSize: 16),
                  icon: const Icon(Icons.keyboard_arrow_down, color: AppTheme.primary),
                  isExpanded: true,
                  items: <String>['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active']
                      .map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    if (newValue != null) setState(() => _activityLevel = newValue);
                  },
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Target result banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.primary.withValues(alpha: 0.15)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'DAILY CALORIE TARGET',
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textMuted,
                      letterSpacing: 1.2,
                    ),
                  ),
                  Text(
                    '${user?.calorieGoal ?? 2000} kcal/day',
                    style: const TextStyle(
                      fontFamily: 'Outfit',
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primary,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                onPressed: authProvider.isLoading ? null : _recalculateMacros,
                child: authProvider.isLoading
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : const Text(
                        'Update Profile',
                        style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold, fontSize: 15),
                      ),
              ),
            ),
            const SizedBox(height: 32),

            // App Preferences
            Text(
              'App Preferences',
              style: const TextStyle(
                fontFamily: 'Outfit',
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 12),

            _buildPreferenceSwitchTile(
              icon: Icons.notifications_none_rounded,
              title: 'Push Notifications',
              subtitle: 'Meal reminders and goals',
              value: _pushNotifications,
              onChanged: (val) => setState(() => _pushNotifications = val),
            ),

            const SizedBox(height: 24),
            // Sign Out
            Center(
              child: TextButton.icon(
                style: TextButton.styleFrom(foregroundColor: AppTheme.tertiary),
                icon: const Icon(Icons.logout_rounded, size: 20),
                label: const Text(
                  'Sign Out',
                  style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold, fontSize: 14),
                ),
                onPressed: () async {
                  await authProvider.logout();
                },
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildInputLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0, left: 4.0),
      child: Text(
        label.toUpperCase(),
        style: const TextStyle(
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: FontWeight.bold,
          color: AppTheme.textMuted,
          letterSpacing: 1.0,
        ),
      ),
    );
  }

  Widget _buildPreferenceSwitchTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppTheme.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.border),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.primary, size: 22),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 11,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            activeThumbColor: AppTheme.primary,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}

class LineChartPainter extends CustomPainter {
  final List<double> points;
  final Color lineColor;

  LineChartPainter({required this.points, required this.lineColor});

  @override
  void paint(Canvas canvas, Size size) {
    if (points.isEmpty) return;

    final Paint linePaint = Paint()
      ..color = lineColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round;

    final double stepX = size.width / (points.length - 1);
    final double minVal = points.reduce((a, b) => a < b ? a : b);
    final double maxVal = points.reduce((a, b) => a > b ? a : b);
    final double range = maxVal - minVal == 0 ? 1 : maxVal - minVal;

    final List<Offset> offsets = [];
    for (int i = 0; i < points.length; i++) {
      double x = i * stepX;
      // Map points: highest value at the top, lowest value at the bottom (with 10px padding)
      double pct = (points[i] - minVal) / range;
      double y = size.height - 15 - (pct * (size.height - 30));
      offsets.add(Offset(x, y));
    }

    final Path path = Path();
    path.moveTo(offsets[0].dx, offsets[0].dy);

    // Smooth Bezier Curve fitting
    for (int i = 0; i < offsets.length - 1; i++) {
      final Offset p1 = offsets[i];
      final Offset p2 = offsets[i + 1];
      final double controlX = (p1.dx + p2.dx) / 2;
      path.cubicTo(controlX, p1.dy, controlX, p2.dy, p2.dx, p2.dy);
    }

    // Draw fading gradient below line
    final Path fillPath = Path.from(path);
    fillPath.lineTo(size.width, size.height);
    fillPath.lineTo(0, size.height);
    fillPath.close();

    final Paint fillPaint = Paint()
      ..shader = LinearGradient(
        colors: [lineColor.withValues(alpha: 0.25), lineColor.withValues(alpha: 0.0)],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    canvas.drawPath(fillPath, fillPaint);
    canvas.drawPath(path, linePaint);

    // Draw dots at points
    final Paint dotPaint = Paint()
      ..color = lineColor
      ..style = PaintingStyle.fill;
    final Paint outerDotPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    for (var offset in offsets) {
      canvas.drawCircle(offset, 5, outerDotPaint);
      canvas.drawCircle(offset, 3, dotPaint);
    }
  }

  @override
  bool shouldRepaint(covariant LineChartPainter oldDelegate) {
    return oldDelegate.points != points || oldDelegate.lineColor != lineColor;
  }
}
