import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import Stripe from 'stripe';
import { ObjectId } from 'mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No authenticated' }, { status: 401 });
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

    // Update user subscription
    const db = await getDb();
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

    const userId = new ObjectId(String(user._id));

    await db.collection('users').updateOne(
      { _id: userId },
      {
        $set: {
          subscriptionPlan: planId,
          subscriptionEnd,
          stripeSubscriptionId: session.subscription as string,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying subscription:', error);
    return NextResponse.json(
      { error: 'Error verifying subscription' },
      { status: 500 }
    );
  }
}
