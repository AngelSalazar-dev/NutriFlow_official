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

    const userId = user._id || (user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario no encontrado' }, { status: 400 });
    }

    // Asegurar que las tablas existen (ignorar errores de permisos DDL si ya existen)
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS referral_codes (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          code VARCHAR(20) UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_user_id (user_id),
          INDEX idx_code (code)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS referrals (
          id VARCHAR(36) PRIMARY KEY,
          referrer_id VARCHAR(36) NOT NULL,
          referred_user_id VARCHAR(36) NOT NULL,
          referral_code VARCHAR(20) NOT NULL,
          rewarded BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY idx_unique_referral (referrer_id, referred_user_id),
          INDEX idx_referrer (referrer_id),
          INDEX idx_referred (referred_user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    } catch (e) {
      console.warn('Ignorando error al verificar/crear tablas de referidos:', e);
    }

    let existingRows: any[] = [];
    try {
      // Check if user already has a referral code
      const result = await query(
        'SELECT * FROM referral_codes WHERE user_id = ?',
        [userId]
      );
      existingRows = result[0] as any[];
    } catch (dbError) {
      console.warn('Error reading referral_codes table, falling back to users table:', dbError);
      // Si falla la lectura, pero el usuario tiene código, devolvemos ese
      if (user.referralCode) {
        return NextResponse.json({
          code: user.referralCode,
          link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${user.referralCode}`,
          totalReferrals: 0,
          rewardedReferrals: 0,
        });
      }
    }

    if (existingRows && existingRows.length > 0) {
      const referralCode = existingRows[0];

      let stats = { total_referrals: 0, rewarded_referrals: 0 };
      try {
        // Get referral stats
        const [statsRows] = await query(
          `SELECT 
           COUNT(*) as total_referrals,
           SUM(CASE WHEN rewarded = TRUE THEN 1 ELSE 0 END) as rewarded_referrals
           FROM referrals
           WHERE referrer_id = ?`,
          [userId]
        ) as any[];
        
        if (statsRows && statsRows[0]) {
          stats = statsRows[0];
        }
      } catch (e) {
        console.warn('Error reading referrals stats:', e);
      }

      return NextResponse.json({
        code: referralCode.code,
        link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${referralCode.code}`,
        totalReferrals: Number(stats.total_referrals || 0),
        rewardedReferrals: Number(stats.rewarded_referrals || 0),
      });
    }

    // Si no existe, intentar usar el código de la tabla users o generar uno
    const code = user.referralCode || generateReferralCode(user.name);
    const id = crypto.randomUUID();

    try {
      await query(
        'INSERT INTO referral_codes (id, user_id, code) VALUES (?, ?, ?)',
        [id, userId, code]
      );

      // Sincronizar con tabla users si es necesario
      await query('UPDATE users SET referral_code = ? WHERE id = ?', [code, userId]);
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        // Si el código ya existe para otro usuario, generar uno nuevo único
        const newCode = generateReferralCode((user.name || 'USER') + Math.floor(Math.random() * 1000));
        try {
          await query(
            'INSERT INTO referral_codes (id, user_id, code) VALUES (?, ?, ?)',
            [id, userId, newCode]
          );
          await query('UPDATE users SET referral_code = ? WHERE id = ?', [newCode, userId]);
        } catch (e) {
          console.warn('Error inserting duplicate fallback, returning code anyway', e);
        }
        return NextResponse.json({
          code: newCode,
          link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${newCode}`,
          totalReferrals: 0,
          rewardedReferrals: 0,
        });
      }
      
      console.warn('Error inserting referral code, falling back to returning code anyway:', err);
      // If insertion fails for ANY reason (like table doesn't exist), just return the code
      // We don't want the UI to break
    }

    return NextResponse.json({
      code,
      link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${code}`,
      totalReferrals: 0,
      rewardedReferrals: 0,
    });
  } catch (error: any) {
    console.error('CRITICAL ERROR in referral API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
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
  const safeName = (name || 'USER').toUpperCase();
  const cleanName = safeName.replace(/[^A-Z]/g, '').slice(0, 4);
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName || 'USER'}${randomChars}`;
}
