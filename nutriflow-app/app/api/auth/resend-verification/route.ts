/**
 * POST /api/auth/resend-verification
 * Resend email verification token
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { createEmailVerificationToken, getEmailVerificationStatus } from '@/lib/auth-tokens';
import { verifyJWT } from '@/lib/auth-mysql';

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verify JWT to get user ID
    const payload = await verifyJWT(sessionCookie.value);
    if (!payload?.userId) {
      return NextResponse.json(
        { error: 'Sesión inválida' },
        { status: 401 }
      );
    }

    const userId = payload.userId as string;

    // Get user email
    const result = await query(
      'SELECT email, email_verified FROM users WHERE id = ?',
      [userId]
    );

    const rows = Array.isArray(result) ? result[0] : result;
    const users = Array.isArray(rows) ? rows : [rows];

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const user = users[0] as any;

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json(
        { error: 'Email ya verificado' },
        { status: 400 }
      );
    }

    // Create new verification token
    const token = await createEmailVerificationToken(userId);
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;

    console.log(`\n📧 [RESEND VERIFICATION] Email verification for: ${user.email}`);
    console.log(`🔗 Verification URL: ${verificationUrl}`);
    console.log(`⏰ Token expires in 24 hours\n`);

    // TODO: In production, send email
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Verifica tu email - NutriFlow',
    //   html: renderVerificationEmail({ verificationUrl }),
    // });

    return NextResponse.json({
      success: true,
      message: 'Email de verificación enviado',
    });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Error al enviar email de verificación' },
      { status: 500 }
    );
  }
}
