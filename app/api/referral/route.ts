import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

/**
 * GET /api/referral
 * Get or create user's referral code
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Check if user already has a referral code
    const [existingRows] = await query(
      'SELECT * FROM referral_codes WHERE user_id = ?',
      [user._id]
    ) as any[];

    if (existingRows && existingRows.length > 0) {
      const referralCode = existingRows[0];

      // Get referral stats
      const [statsRows] = await query(
        `SELECT
         COUNT(*) as total_referrals,
         SUM(CASE WHEN rewarded = TRUE THEN 1 ELSE 0 END) as rewarded_referrals
         FROM referrals
         WHERE referrer_id = ?`,
        [user._id]
      ) as any[];

      const stats = statsRows && statsRows[0] ? statsRows[0] : { total_referrals: 0, rewarded_referrals: 0 };

      return NextResponse.json({
        code: referralCode.code,
        link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${referralCode.code}`,
        totalReferrals: Number(stats.total_referrals),
        rewardedReferrals: Number(stats.rewarded_referrals),
      });
    }

    // Create new referral code
    const code = generateReferralCode(user.name);
    const id = crypto.randomUUID();

    await query(
      'INSERT INTO referral_codes (id, user_id, code) VALUES (?, ?, ?)',
      [id, user._id, code]
    );

    // Also update user's referral_code column
    await query('UPDATE users SET referral_code = ? WHERE id = ?', [code, user._id]);

    return NextResponse.json({
      code,
      link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${code}`,
      totalReferrals: 0,
      rewardedReferrals: 0,
      isNew: true,
    });
  } catch (error) {
    console.error('Error getting referral code:', error);
    return NextResponse.json(
      { error: 'Error al obtener código de referido' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/referral
 * Apply referral code or process reward
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, referrerCode, referredUserId } = body;

    // Apply referral code
    if (action === 'apply' || (!action && referrerCode)) {
      if (!referrerCode) {
        return NextResponse.json({ error: 'Código de referido requerido' }, { status: 400 });
      }

      // Find the referrer
      const [referrerRows] = await query(
        'SELECT * FROM referral_codes WHERE code = ?',
        [referrerCode.toUpperCase()]
      ) as any[];

      if (!referrerRows || referrerRows.length === 0) {
        return NextResponse.json({ error: 'Código de referido inválido' }, { status: 404 });
      }

      const referrerCodeData = referrerRows[0];

      return NextResponse.json({
        success: true,
        referrerId: referrerCodeData.user_id,
        message: 'Código de referido aplicado',
      });
    }

    // Process reward
    if (action === 'reward' || (!action && referredUserId)) {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
      }

      // Check if this user was referred
      const [userRows] = await query(
        'SELECT referred_by FROM users WHERE id = ? AND referred_by IS NOT NULL',
        [user._id]
      ) as any[];

      if (!userRows || userRows.length === 0) {
        return NextResponse.json({ error: 'Usuario no fue referido' }, { status: 400 });
      }

      const referrerId = userRows[0].referred_by;

      // Calculate reward (default: 3 days for registration)
      const rewardDays = 3;

      // Update referrer's subscription
      const [referrerRows] = await query(
        'SELECT subscription_plan, subscription_end FROM users WHERE id = ?',
        [referrerId]
      ) as any[];

      if (referrerRows && referrerRows.length > 0) {
        const referrer = referrerRows[0];
        const now = new Date();
        let newSubscriptionEnd: Date;

        // If current subscription is in the future, extend from there
        const currentEnd = referrer.subscription_end ? new Date(referrer.subscription_end) : now;
        const baseDate = currentEnd > now ? currentEnd : now;

        newSubscriptionEnd = new Date(baseDate);
        newSubscriptionEnd.setDate(newSubscriptionEnd.getDate() + rewardDays);

        await query(
          `UPDATE users
           SET subscription_plan = 'premium',
               subscription_end = ?,
               referral_credits = referral_credits + ?
           WHERE id = ?`,
          [newSubscriptionEnd, rewardDays, referrerId]
        );
      }

      // Mark referral as rewarded
      await query(
        `INSERT INTO referrals (id, referrer_id, referred_user_id, referral_code, rewarded, created_at)
         VALUES (UUID(), ?, ?, (SELECT code FROM referral_codes WHERE user_id = ?), TRUE, NOW())
         ON DUPLICATE KEY UPDATE rewarded = TRUE`,
        [referrerId, user._id, referrerId]
      );

      return NextResponse.json({
        success: true,
        rewardDays,
        message: `${rewardDays} días Premium por referido`,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing referral:', error);
    return NextResponse.json(
      { error: 'Error processing referral' },
      { status: 500 }
    );
  }
}

// Helper function to generate referral code from name
function generateReferralCode(name: string): string {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName || 'USER'}${randomChars}`;
}
