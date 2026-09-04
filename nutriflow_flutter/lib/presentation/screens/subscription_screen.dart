import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../providers/auth_provider.dart';

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.currentUser;
    final plan = user?.subscriptionPlan ?? 'free';

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Subscription',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(height: 20),
            // Current plan card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: plan == 'free'
                      ? [AppTheme.cardBg, AppTheme.cardBg]
                      : [AppTheme.primary, const Color(0xFF047857)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: AppTheme.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        plan == 'premium'
                            ? 'Premium'
                            : plan == 'pro'
                                ? 'Pro'
                                : 'Free',
                        style: const TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Icon(
                        plan == 'free' ? Icons.person_outline : Icons.star,
                        color: plan == 'free' ? AppTheme.textMuted : Colors.yellowAccent,
                        size: 28,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    plan == 'free'
                        ? 'Basic access to NutriFlow'
                        : 'Full access to all premium features',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14,
                      color: Colors.white.withValues(alpha: 0.8),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Plans comparison
            _buildPlanCard(
              name: 'Free',
              price: '\$0',
              period: 'forever',
              features: [
                'Basic dashboard',
                'Food logging (manual)',
                'Up to 15 AI messages/day',
                'Basic articles',
              ],
              isCurrent: plan == 'free',
              isPopular: false,
              onTap: null,
            ),
            const SizedBox(height: 16),
            _buildPlanCard(
              name: 'Premium',
              price: '\$9.99',
              period: '/month',
              features: [
                'Everything in Free',
                'Unlimited AI chat',
                'Smart log with AI',
                'Exercise tracking',
                'All articles',
                'Priority support',
              ],
              isCurrent: plan == 'premium',
              isPopular: true,
              onTap: plan == 'free' ? () => _subscribe('premium') : null,
            ),
            const SizedBox(height: 16),
            _buildPlanCard(
              name: 'Pro',
              price: '\$19.99',
              period: '/month',
              features: [
                'Everything in Premium',
                'Personalized meal plans',
                'AI workout generation',
                'Advanced analytics',
                'Ad-free experience',
              ],
              isCurrent: plan == 'pro',
              isPopular: false,
              onTap: plan != 'pro' ? () => _subscribe('pro') : null,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlanCard({
    required String name,
    required String price,
    required String period,
    required List<String> features,
    required bool isCurrent,
    required bool isPopular,
    VoidCallback? onTap,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isCurrent ? AppTheme.primary.withValues(alpha: 0.1) : AppTheme.cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isCurrent
              ? AppTheme.primary
              : isPopular
                  ? Colors.amber.withValues(alpha: 0.3)
                  : AppTheme.border,
          width: isCurrent ? 2 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                      fontFamily: 'Outfit',
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  if (isPopular) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.amber,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'POPULAR',
                        style: TextStyle(fontFamily: 'Inter', fontSize: 9, fontWeight: FontWeight.bold, color: Colors.black),
                      ),
                    ),
                  ],
                ],
              ),
              if (isCurrent)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.primary,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'CURRENT',
                    style: TextStyle(fontFamily: 'Inter', fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                price,
                style: const TextStyle(fontFamily: 'Outfit', fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              Text(
                period,
                style: const TextStyle(fontFamily: 'Inter', fontSize: 13, color: AppTheme.textSecondary),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...features.map((f) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle, color: AppTheme.primary, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(f, style: const TextStyle(fontFamily: 'Inter', fontSize: 13, color: AppTheme.textSecondary)),
                    ),
                  ],
                ),
              )),
          if (!isCurrent && onTap != null) ...[
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: isPopular ? Colors.amber : AppTheme.primary,
                  foregroundColor: isPopular ? Colors.black : Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: onTap,
                child: Text(
                  isCurrent ? 'Current Plan' : 'Upgrade to $name',
                  style: const TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  void _subscribe(String planId) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Subscription to $planId - coming soon (Stripe integration)'),
        backgroundColor: AppTheme.primary,
      ),
    );
  }
}
