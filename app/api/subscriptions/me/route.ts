import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  premium: 9.99,
  pro: 19.99,
};

// GET - Get user's subscription details and payment history
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Get active subscription (table columns: tier, not plan)
    const [subRows] = await query(`
      SELECT id, tier as plan, status,
        stripe_subscription_id,
        DATE_FORMAT(current_period_start, '%Y-%m-%dT%H:%i:%sZ') as currentPeriodStart,
        DATE_FORMAT(current_period_end, '%Y-%m-%dT%H:%i:%sZ') as currentPeriodEnd,
        cancel_at_period_end as cancelAtPeriodEnd,
        DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as createdAt
      FROM subscriptions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `, [user._id]) as any[];

    // Get subscription history (past records)
    const [historyRows] = await query(`
      SELECT id, tier as plan, status,
        DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as createdAt,
        DATE_FORMAT(current_period_start, '%Y-%m-%dT%H:%i:%sZ') as periodStart,
        DATE_FORMAT(current_period_end, '%Y-%m-%dT%H:%i:%sZ') as periodEnd,
        cancel_at_period_end as cancelAtPeriodEnd
      FROM subscriptions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `, [user._id]) as any[];

    const subscription = subRows && subRows.length > 0 ? subRows[0] : null;

    // Add price info to subscription
    if (subscription) {
      subscription.amount = PLAN_PRICES[subscription.plan] || 0;
    }

    // Add price info to history
    const history = (historyRows || []).map((h: any) => ({
      ...h,
      amount: PLAN_PRICES[h.plan] || 0,
    }));

    return NextResponse.json({
      subscription,
      history,
      currentPlan: user.subscriptionPlan,
    });
  } catch (error: any) {
    console.error('[SUBSCRIPTIONS] Error:', error.message);
    return NextResponse.json(
      { error: 'Error obteniendo suscripción: ' + error.message },
      { status: 500 }
    );
  }
}
