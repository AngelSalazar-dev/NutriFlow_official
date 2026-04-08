import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getCurrentUser } from '@/lib/auth-mysql';

/**
 * GET /api/chat/limit
 * Check user's message usage limit
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const now = new Date();
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

    const [count] = await query(
      'SELECT COUNT(*) as count FROM chat_messages WHERE user_id = ? AND created_at >= ?',
      [user._id, fiveHoursAgo]
    ) as any[];

    const messagesUsed = count?.count || 0;
    const isPremium = user.subscriptionPlan === 'premium' || user.subscriptionPlan === 'pro';
    const windowLimit = isPremium ? 9999 : 15;
    const windowHours = 5;

    let resetTime = new Date(now.getTime() + windowHours * 60 * 60 * 1000);

    if (messagesUsed >= windowLimit && !isPremium) {
      const [oldestMessage] = await query(`
        SELECT created_at FROM chat_messages
        WHERE user_id = ? AND created_at >= ?
        ORDER BY created_at ASC
        LIMIT 1
      `, [user._id, fiveHoursAgo]) as any[];

      if (oldestMessage && oldestMessage[0]) {
        resetTime = new Date(oldestMessage[0].created_at);
        resetTime.setHours(resetTime.getHours() + windowHours);
      }
    }

    const timeUntilReset = resetTime.getTime() - now.getTime();
    const hoursRemaining = Math.ceil(timeUntilReset / (1000 * 60 * 60));
    const minutesRemaining = Math.ceil((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));

    return NextResponse.json({
      allowed: messagesUsed < windowLimit,
      remaining: Math.max(0, windowLimit - messagesUsed),
      limit: windowLimit,
      used: messagesUsed,
      isPremium,
      windowHours,
      resetTime: resetTime.toISOString(),
      hoursRemaining,
      minutesRemaining,
    });
  } catch (error) {
    console.error('Error checking chat limit:', error);
    return NextResponse.json(
      { error: 'Error verificando límite' },
      { status: 500 }
    );
  }
}
