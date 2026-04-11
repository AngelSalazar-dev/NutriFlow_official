import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

const PLAN_PRICES: Record<string, { amount: string; name: string }> = {
  premium: { amount: '9.99', name: 'NutriFlow Premium - Mensual' },
  pro: { amount: '19.99', name: 'NutriFlow Pro - Mensual' },
};

async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET || PAYPAL_CLIENT_ID === 'tu_client_id_aqui') {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`PayPal auth failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

// POST /api/payments/capture-order
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

    if (!PLAN_PRICES[planId]) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    // Capture the order
    const captureResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!captureResponse.ok) {
      const error = await captureResponse.text();
      console.error('[PAYPAL] Capture error:', error);
      return NextResponse.json({ error: 'Error capturando el pago' }, { status: 500 });
    }

    const captureData = await captureResponse.json();

    // Check if payment was successful
    const status = captureData.status;
    if (status !== 'COMPLETED') {
      return NextResponse.json({ error: 'El pago no fue completado', status }, { status: 400 });
    }

    // Activate the user's subscription
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

    // Update user plan
    await query(
      `UPDATE users SET subscription_plan = ?, updated_at = NOW() WHERE id = ?`,
      [planId, user._id]
    );

    // Upsert subscription record
    const [existingSub] = await query(
      `SELECT id FROM subscriptions WHERE user_id = ?`,
      [user._id]
    ) as any[];

    const captureInfo = captureData.purchase_units?.[0]?.payments?.captures?.[0] || {};

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
      paymentId: captureInfo.id,
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
