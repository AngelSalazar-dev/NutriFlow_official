import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

// PayPal Sandbox credentials (replace with your real credentials when going live)
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

const PLAN_PRICES: Record<string, { amount: string; name: string }> = {
  premium: { amount: '9.99', name: 'NutriFlow Premium - Mensual' },
  pro: { amount: '19.99', name: 'NutriFlow Pro - Mensual' },
};

async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET || PAYPAL_CLIENT_ID === 'tu_client_id_aqui') {
    throw new Error('PayPal credentials not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_SECRET in .env.local');
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
    throw new Error(`PayPal auth failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// POST /api/payments/create-order
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    if (!PLAN_PRICES[planId]) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `${user._id}_${planId}`,
            description: PLAN_PRICES[planId].name,
            amount: {
              currency_code: 'USD',
              value: PLAN_PRICES[planId].amount,
            },
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription/success?plan=${planId}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription?canceled=true`,
          brand_name: 'NutriFlow',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
        },
      }),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      console.error('[PAYPAL] Create order error:', error);
      return NextResponse.json({ error: 'Error creando orden de PayPal' }, { status: 500 });
    }

    const orderData = await orderResponse.json();

    return NextResponse.json({
      orderId: orderData.id,
      approveUrl: orderData.links?.find((l: any) => l.rel === 'approve')?.href,
    });
  } catch (error: any) {
    console.error('[PAYPAL] Create order error:', error.message);
    return NextResponse.json(
      { error: 'Error creando orden de pago: ' + error.message },
      { status: 500 }
    );
  }
}
