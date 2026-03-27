import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

const PLAN_PRICES: Record<string, { price: number; name: string }> = {
  premium: { price: 999, name: 'NutriFlow Premium' }, // $9.99 in cents
  pro: { price: 1999, name: 'NutriFlow Pro' }, // $19.99 in cents
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

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: PLAN_PRICES[planId].name,
              description: 'Suscripción mensual',
            } as Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData,
            unit_amount: PLAN_PRICES[planId].price,
            recurring: {
              interval: 'month',
            } as Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring,
          } as Stripe.Checkout.SessionCreateParams.LineItem.PriceData,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription`,
      metadata: {
        userId: String(user._id),
        planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creando sesión de pago' },
      { status: 500 }
    );
  }
}
