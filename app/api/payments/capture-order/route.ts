import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';
import { PaymentContext, PayPalStrategy } from '@/lib/payments/strategies';

const PLAN_PRICES: Record<string, { amount: string; name: string }> = {
  premium: { amount: '9.99', name: 'NutriFlow Premium - Mensual' },
  pro: { amount: '19.99', name: 'NutriFlow Pro - Mensual' },
};

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, planId } = body;

    if (!orderId || !planId) {
      return NextResponse.json({ error: 'Falta orderId o planId' }, { status: 400 });
    }

    const paymentContext = new PaymentContext(new PayPalStrategy());
    const captureResult = await paymentContext.captureOrder(orderId);

    if (!captureResult.success) {
      return NextResponse.json({ error: 'El pago no fue completado' }, { status: 400 });
    }

    // Activate the user's subscription
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

    await query(
      `UPDATE users SET subscription_plan = ?, updated_at = NOW() WHERE id = ?`,
      [planId, user._id]
    );

    const [existingSub] = await query(
      `SELECT id FROM subscriptions WHERE user_id = ?`,
      [user._id]
    ) as any[];

    if (existingSub && existingSub.length > 0) {
      await query(
        `UPDATE subscriptions SET tier = ?, status = 'active', 
         current_period_start = NOW(), current_period_end = ?,
         stripe_subscription_id = ?, cancel_at_period_end = 0, updated_at = NOW()
         WHERE user_id = ?`,
        [planId, subscriptionEnd, `paypal_${orderId}`, user._id]
      );
    } else {
      const [uuidResult] = await query('SELECT UUID() as id');
      const subId = (uuidResult as any)[0].id;

      await query(
        `INSERT INTO subscriptions (id, user_id, tier, status, current_period_start, current_period_end, stripe_subscription_id, created_at)
         VALUES (?, ?, ?, 'active', NOW(), ?, ?, NOW())`,
        [subId, user._id, planId, subscriptionEnd, `paypal_${orderId}`]
      );
    }

    return NextResponse.json({
      success: true,
      plan: planId,
      paymentId: captureResult.paymentId,
      message: `Plan ${planId} activado exitosamente`,
    });
  } catch (error: any) {
    console.error('[PAYPAL] Capture order error:', error.message);
    return NextResponse.json(
      { error: 'Error procesando el pago: ' + error.message },
      { status: 500 }
    );
  }
}

