import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const isSimulationMode = !stripeSecretKey || stripeSecretKey === 'sk_test_your_stripe_secret_key' || stripeSecretKey.includes('dummy');

// POST - Cancel subscription
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (isSimulationMode) {
      // Mark subscription as canceled but keep access until period end
      await query(
        `UPDATE subscriptions SET cancel_at_period_end = 1, updated_at = NOW() WHERE user_id = ?`,
        [user._id]
      );

      return NextResponse.json({ success: true, message: 'Subscription canceled at period end' });
    }

    // Real Stripe flow
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey!);

    // Get subscription ID
    const [subRows] = await query(
      `SELECT stripe_subscription_id FROM subscriptions WHERE user_id = ? AND status = 'active'`,
      [user._id]
    ) as any[];

    if (!subRows || subRows.length === 0) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    const stripeSubId = subRows[0].stripe_subscription_id;
    if (!stripeSubId) {
      // No Stripe subscription — just cancel locally
      await query(
        `UPDATE subscriptions SET cancel_at_period_end = 1, status = 'canceled', updated_at = NOW() WHERE user_id = ?`,
        [user._id]
      );
      return NextResponse.json({ success: true, message: 'Canceled locally' });
    }

    // Cancel at period end via Stripe
    await stripe.subscriptions.update(stripeSubId, {
      cancel_at_period_end: true,
    });

    await query(
      `UPDATE subscriptions SET cancel_at_period_end = 1, updated_at = NOW() WHERE user_id = ?`,
      [user._id]
    );

    return NextResponse.json({ success: true, message: 'Canceled at period end' });
  } catch (error: any) {
    console.error('[SUBSCRIPTION] Cancel error:', error.message);
    return NextResponse.json(
      { error: 'Error cancelando suscripción: ' + error.message },
      { status: 500 }
    );
  }
}
