import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
// Only simulate if NO key is present OR if it's explicitly a dummy placeholder
const isSimulationMode = !stripeSecretKey || stripeSecretKey === 'sk_test_your_stripe_secret_key' || stripeSecretKey.includes('dummy');

const PLAN_PRICES: Record<string, { price: number; name: string; interval: string }> = {
  premium: { price: 9.99, name: 'NutriFlow Premium', interval: 'month' },
  pro: { price: 19.99, name: 'NutriFlow Pro', interval: 'month' },
};

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    if (!PLAN_PRICES[planId]) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    // If Stripe is not configured, use simulation mode
    if (isSimulationMode) {
      console.log('[SUBSCRIPTION] Simulation mode: activating', planId, 'for user', user._id);

      const subscriptionEnd = new Date();
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

      // Update user's plan
      await query(
        `UPDATE users SET subscription_plan = ?, updated_at = NOW() WHERE id = ?`,
        [planId, user._id]
      );

      // Upsert subscription record (table uses: tier, not plan)
      const [existingSub] = await query(
        `SELECT id FROM subscriptions WHERE user_id = ?`,
        [user._id]
      ) as any[];

      if (existingSub && existingSub.length > 0) {
        // Update existing
        await query(
          `UPDATE subscriptions SET tier = ?, status = 'active', 
           current_period_start = NOW(), current_period_end = ?, 
           cancel_at_period_end = 0, updated_at = NOW()
           WHERE user_id = ?`,
          [planId, subscriptionEnd, user._id]
        );
      } else {
        // Insert new
        const [uuidResult] = await query('SELECT UUID() as id');
        const subId = (uuidResult as any)[0].id;

        await query(
          `INSERT INTO subscriptions (id, user_id, tier, status, current_period_start, current_period_end, created_at)
           VALUES (?, ?, ?, 'active', NOW(), ?, NOW())`,
          [subId, user._id, planId, subscriptionEnd]
        );
      }

      return NextResponse.json({
        success: true,
        simulated: true,
        plan: planId,
        message: `Plan ${planId} activado (modo simulación)`,
      });
    }

    // Real Stripe flow
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey!);

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: PLAN_PRICES[planId].name,
              description: 'Suscripción mensual',
            },
            unit_amount: Math.round(PLAN_PRICES[planId].price * 100),
            recurring: {
              interval: PLAN_PRICES[planId].interval as 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription`,
      metadata: {
        userId: String(user._id),
        planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[SUBSCRIPTION] Error creating checkout:', error);
    return NextResponse.json(
      { error: 'Error creando sesión de pago' },
      { status: 500 }
    );
  }
}
