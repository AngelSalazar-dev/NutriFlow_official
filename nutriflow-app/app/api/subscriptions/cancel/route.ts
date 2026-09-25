import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

// POST - Cancel subscription (PayPal - local cancellation only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Mark subscription as canceled but keep access until period end
    await query(
      `UPDATE subscriptions SET cancel_at_period_end = 1, updated_at = NOW() WHERE user_id = ? AND status = 'active'`,
      [user._id]
    );

    return NextResponse.json({ success: true, message: 'Subscription canceled at period end' });
  } catch (error: any) {
    console.error('[SUBSCRIPTION] Cancel error:', error.message);
    return NextResponse.json(
      { error: 'Error cancelando suscripción: ' + error.message },
      { status: 500 }
    );
  }
}
