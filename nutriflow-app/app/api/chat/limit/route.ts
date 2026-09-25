import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyJWT } from '@/lib/auth-mysql';

async function getUserFromRequest(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionMatch = cookieHeader.match(/session=([^;]+)/);
  const token = sessionMatch ? sessionMatch[1] : null;
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload?.userId) return null;

  const userId = payload.userId as string;
  const [rows] = await query(`SELECT id, email, name, subscription_plan FROM users WHERE id = ? LIMIT 1`, [userId]);
  const users = Array.isArray(rows) ? rows : [rows];
  if (!users || users.length === 0) return null;

  const u = users[0] as any;
  return { _id: u.id, email: u.email, name: u.name, subscriptionPlan: u.subscription_plan };
}

/**
 * GET /api/chat/limit
 * Check user's message usage limit
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
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
