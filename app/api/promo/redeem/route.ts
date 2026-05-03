import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query, rowsToObjects } from '@/lib/mysql';

/**
 * POST /api/promo/redeem
 * Redeem a promotional code for free premium access
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Ensure promo table exists
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS promo_codes (
          id VARCHAR(36) PRIMARY KEY,
          code VARCHAR(50) UNIQUE NOT NULL,
          plan_type ENUM('premium', 'pro') NOT NULL,
          duration_type ENUM('days', 'months', 'lifetime') NOT NULL,
          duration_value INT NOT NULL,
          max_uses INT DEFAULT NULL,
          used_count INT DEFAULT 0,
          expires_at DATETIME DEFAULT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Inject demo code ANGJUARJ3 if it doesn't exist
      await query(`
        INSERT IGNORE INTO promo_codes (id, code, plan_type, duration_type, duration_value, max_uses)
        VALUES (UUID(), 'ANGJUARJ3', 'premium', 'months', 1, 1000)
      `);

      // Try adding columns to users table if they don't exist
      const alterQueries = [
        `ALTER TABLE users ADD COLUMN promo_code_id VARCHAR(36) DEFAULT NULL`,
        `ALTER TABLE users ADD COLUMN promo_applied_at DATETIME DEFAULT NULL`,
        `ALTER TABLE users ADD COLUMN promo_expires_at DATETIME DEFAULT NULL`
      ];
      
      for (const q of alterQueries) {
        try {
          await query(q);
        } catch (e: any) {
          if (e.code !== 'ER_DUP_FIELDNAME') {
            console.warn('Error adding column to users:', e.message);
          }
        }
      }
    } catch (e) {
      console.warn('Ignoring DDL error for promo_codes/users:', e);
    }

    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Código inválido' }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Check if user already used a promo code
    let existingUser: any[] = [];
    try {
      const result = await query(
        'SELECT promo_code_id FROM users WHERE id = ? AND promo_code_id IS NOT NULL',
        [user._id]
      );
      existingUser = result[0] as any[];
    } catch (e) {
      console.warn('Error checking existing user promo, continuing', e);
    }

    if (existingUser && existingUser.length > 0 && existingUser[0].promo_code_id) {
      return NextResponse.json(
        { error: 'Ya canjeaste un código promocional anteriormente' },
        { status: 400 }
      );
    }

    // Find the promo code
    const [codeRows] = await query(
      `SELECT * FROM promo_codes 
       WHERE code = ? AND is_active = TRUE 
       AND (expires_at IS NULL OR expires_at > NOW())
       AND (max_uses IS NULL OR used_count < max_uses)`,
      [normalizedCode]
    ) as any[];

    if (!codeRows || codeRows.length === 0) {
      return NextResponse.json(
        { error: 'Código inválido o expirado' },
        { status: 404 }
      );
    }

    const promoCode = codeRows[0];

    // Calculate subscription end date
    let subscriptionEnd: Date | null = null;
    const now = new Date();

    if (promoCode.duration_type === 'lifetime') {
      // Lifetime: set far future date (99 years)
      subscriptionEnd = new Date(now.setFullYear(now.getFullYear() + 99));
    } else if (promoCode.duration_type === 'months') {
      subscriptionEnd = new Date(now.setMonth(now.getMonth() + promoCode.duration_value));
    } else if (promoCode.duration_type === 'days') {
      subscriptionEnd = new Date(now.setDate(now.getDate() + promoCode.duration_value));
    }

    // Update user's subscription
    await query(
      `UPDATE users 
       SET subscription_plan = ?, 
           subscription_end = ?,
           promo_code_id = ?,
           promo_applied_at = NOW(),
           promo_expires_at = ?
       WHERE id = ?`,
      [
        promoCode.plan_type,
        subscriptionEnd,
        promoCode.id,
        subscriptionEnd,
        user._id
      ]
    );

    // Increment usage count
    await query(
      'UPDATE promo_codes SET used_count = used_count + 1 WHERE id = ?',
      [promoCode.id]
    );

    return NextResponse.json({
      success: true,
      message: `¡Código canjeado exitosamente! Ahora tienes acceso ${promoCode.plan_type === 'pro' ? 'Pro' : 'Premium'} hasta ${subscriptionEnd?.toLocaleDateString()}`,
      plan: promoCode.plan_type,
      expiresAt: subscriptionEnd,
    });
  } catch (error) {
    console.error('Error redeeming promo code:', error);
    return NextResponse.json(
      { error: 'Error al canjear código' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/promo/validate
 * Validate a promo code without redeeming it
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Código requerido' }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Ensure promo table exists and insert a default code if needed
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS promo_codes (
          id VARCHAR(36) PRIMARY KEY,
          code VARCHAR(50) UNIQUE NOT NULL,
          plan_type ENUM('premium', 'pro') NOT NULL,
          duration_type ENUM('days', 'months', 'lifetime') NOT NULL,
          duration_value INT NOT NULL,
          max_uses INT DEFAULT NULL,
          used_count INT DEFAULT 0,
          expires_at DATETIME DEFAULT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      
      // Inject demo code ANGJUARJ3 if it doesn't exist
      await query(`
        INSERT IGNORE INTO promo_codes (id, code, plan_type, duration_type, duration_value, max_uses)
        VALUES (UUID(), 'ANGJUARJ3', 'premium', 'months', 1, 1000)
      `);
    } catch (e) {
      console.warn('Ignoring DDL error for promo_codes:', e);
    }

    const [codeRows] = await query(
      `SELECT code, plan_type, duration_type, duration_value, max_uses, used_count, expires_at, is_active
       FROM promo_codes 
       WHERE code = ?`,
      [normalizedCode]
    ) as any[];

    if (!codeRows || codeRows.length === 0) {
      return NextResponse.json({ valid: false, error: 'Código no encontrado' }, { status: 404 });
    }

    const promoCode = codeRows[0];

    // Check if active
    if (!promoCode.is_active) {
      return NextResponse.json({ valid: false, error: 'Código desactivado' });
    }

    // Check if expired
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, error: 'Código expirado' });
    }

    // Check if max uses reached
    if (promoCode.max_uses !== null && promoCode.used_count >= promoCode.max_uses) {
      return NextResponse.json({ valid: false, error: 'Código agotado' });
    }

    return NextResponse.json({
      valid: true,
      plan: promoCode.plan_type,
      duration: `${promoCode.duration_value} ${promoCode.duration_type}`,
      usesRemaining: promoCode.max_uses !== null ? promoCode.max_uses - promoCode.used_count : 'Ilimitados',
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json(
      { error: 'Error al validar código' },
      { status: 500 }
    );
  }
}
