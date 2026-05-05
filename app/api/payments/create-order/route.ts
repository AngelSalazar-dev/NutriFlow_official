import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
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
    const { planId } = body;

    if (!PLAN_PRICES[planId]) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const paymentContext = new PaymentContext(new PayPalStrategy());
    const plan = PLAN_PRICES[planId];
    
    const order = await paymentContext.createOrder(
      user._id,
      planId,
      plan.amount,
      plan.name
    );

    return NextResponse.json({
      orderId: order.orderId,
      approveUrl: order.approveUrl,
    });
  } catch (error: any) {
    console.error('[PAYPAL] Create order error:', error.message);
    return NextResponse.json(
      { error: 'Error creando orden de pago: ' + error.message },
      { status: 500 }
    );
  }
}

