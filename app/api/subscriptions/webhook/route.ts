import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const isSimulationMode = !stripeSecretKey || stripeSecretKey === 'sk_test_your_stripe_secret_key' || stripeSecretKey.includes('dummy');

export async function POST(request: NextRequest) {
  // In simulation mode, webhooks are not needed (subscription is activated directly in create-checkout)
  if (isSimulationMode) {
    return NextResponse.json({ received: true, simulated: true });
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(stripeSecretKey!);

  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[WEBHOOK] Signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;

        if (session.payment_status === 'paid') {
          const userId = session.metadata?.userId;
          const planId = session.metadata?.planId;

          if (!userId || !planId) {
            console.error('Missing userId or planId in session metadata');
            break;
          }

          // Calculate subscription end date
          const subscriptionEnd = new Date();
          subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

          // Update user's subscription in MySQL
          await query(
            `UPDATE users 
             SET subscription_plan = ?, 
                 subscription_end = ?,
                 stripe_subscription_id = ?,
                 updated_at = NOW()
             WHERE id = ?`,
            [planId, subscriptionEnd, session.subscription, userId]
          );

          console.log(`✅ User ${userId} upgraded to ${planId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;

        const status = subscription.status;
        const subscriptionId = subscription.id;

        // Find user by stripe_subscription_id
        const [rows] = await query(
          'SELECT id FROM users WHERE stripe_subscription_id = ?',
          [subscriptionId]
        ) as any[];

        if (!rows || rows.length === 0) {
          console.error('User not found for subscription:', subscriptionId);
          break;
        }

        const userId = rows[0].id;

        if (status === 'active' || status === 'trialing') {
          // Determine plan from price
          const price = subscription.items.data[0]?.price;
          const planId = price?.metadata?.plan || (price?.unit_amount === 1999 ? 'pro' : 'premium');
          const subscriptionEnd = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : new Date();

          await query(
            `UPDATE users
             SET subscription_plan = ?,
                 subscription_end = ?,
                 updated_at = NOW()
             WHERE id = ?`,
            [planId, subscriptionEnd, userId]
          );
        } else if (status === 'canceled' || status === 'unpaid') {
          // Downgrade to free
          await query(
            `UPDATE users
             SET subscription_plan = 'free',
                 subscription_end = NULL,
                 updated_at = NOW()
             WHERE id = ?`,
            [userId]
          );
          console.log(`⬇️ User ${userId} downgraded to free`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const subscriptionId = subscription.id;

        const [rows] = await query(
          'SELECT id FROM users WHERE stripe_subscription_id = ?',
          [subscriptionId]
        ) as any[];

        if (rows && rows.length > 0) {
          const userId = rows[0].id;

          await query(
            `UPDATE users 
             SET subscription_plan = 'free', 
                 subscription_end = NULL,
                 stripe_subscription_id = NULL,
                 updated_at = NOW()
             WHERE id = ?`,
            [userId]
          );
          console.log(`⬇️ User ${userId} subscription deleted, downgraded to free`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
