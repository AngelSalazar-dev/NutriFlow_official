import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = body;

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify the session belongs to this user
    if (session.customer_email !== user.email) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 400 });
    }

    // Get plan from metadata
    const planId = session.metadata?.planId;
    if (!planId || !['premium', 'pro'].includes(planId)) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    // Calculate subscription end date
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

    // Update user subscription in MySQL
    await query(
      `UPDATE users 
       SET subscription_plan = ?, 
           subscription_end = ?,
           stripe_subscription_id = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [planId, subscriptionEnd, session.subscription, user._id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Suscripción activada exitosamente',
      plan: planId,
    });
  } catch (error) {
    console.error('Error verifying subscription:', error);
    return NextResponse.json(
      { error: 'Error verificando suscripción' },
      { status: 500 }
    );
  }
}
