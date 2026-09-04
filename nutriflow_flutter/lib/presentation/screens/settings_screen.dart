import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../providers/auth_provider.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _pushNotifications = true;
  bool _emailNotifications = true;
  double _waterGoal = 2500;

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.currentUser;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Settings',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Notifications',
              style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 12),
            _buildSwitchTile(
              icon: Icons.notifications_active_outlined,
              title: 'Push Notifications',
              subtitle: 'Meal reminders and daily goals',
              value: _pushNotifications,
              onChanged: (val) => setState(() => _pushNotifications = val),
            ),
            _buildSwitchTile(
              icon: Icons.email_outlined,
              title: 'Email Notifications',
              subtitle: 'Weekly reports and tips',
              value: _emailNotifications,
              onChanged: (val) => setState(() => _emailNotifications = val),
            ),

            const SizedBox(height: 32),
            const Text(
              'Hydration',
              style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.cardBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Daily Water Goal',
                        style: TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white),
                      ),
                      Text(
                        '${_waterGoal.round()} ml',
                        style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.primary),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Slider(
                    value: _waterGoal,
                    min: 500,
                    max: 5000,
                    divisions: 9,
                    activeColor: AppTheme.primary,
                    inactiveColor: AppTheme.border,
                    label: '${_waterGoal.round()} ml',
                    onChanged: (val) => setState(() => _waterGoal = val),
                  ),
                  const Text(
                    'Recommended: 2000-3000 ml',
                    style: TextStyle(fontFamily: 'Inter', fontSize: 11, color: AppTheme.textMuted),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),
            const Text(
              'Account',
              style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 12),
            _buildInfoTile(Icons.person_outline, 'Name', user?.name ?? ''),
            _buildInfoTile(Icons.email_outlined, 'Email', user?.email ?? ''),
            _buildInfoTile(Icons.monitor_weight_outlined, 'Daily Goal', '${user?.calorieGoal ?? 2000} kcal'),

            const SizedBox(height: 32),
            Center(
              child: TextButton.icon(
                style: TextButton.styleFrom(foregroundColor: AppTheme.tertiary),
                icon: const Icon(Icons.logout_rounded),
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

  Widget _buildSwitchTile({
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
                Text(title, style: const TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
                Text(subtitle, style: const TextStyle(fontFamily: 'Inter', fontSize: 11, color: AppTheme.textSecondary)),
              ],
            ),
          ),
          Switch(value: value, activeThumbColor: AppTheme.primary, onChanged: onChanged),
        ],
      ),
    );
  }

  Widget _buildInfoTile(IconData icon, String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: AppTheme.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.border),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.textMuted, size: 20),
          const SizedBox(width: 12),
          Text(label, style: const TextStyle(fontFamily: 'Inter', fontSize: 13, color: AppTheme.textSecondary)),
          const Spacer(),
          Text(value, style: const TextStyle(fontFamily: 'Inter', fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white)),
        ],
      ),
    );
  }
}
