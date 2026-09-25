/**
 * POST /api/auth/forgot-password
 * Initiate password reset flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { createPasswordResetToken } from '@/lib/auth-tokens';
import { isValidEmail, sanitizeInput } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Email no válido' },
        { status: 400 }
      );
    }

    // Find user by email
    const result = await query(
      'SELECT id, email, name, email_verified FROM users WHERE email = ?',
      [sanitizedEmail]
    );

    const rows = Array.isArray(result) ? result[0] : result;
    const users = Array.isArray(rows) ? rows : [rows];

    // Always return success to prevent email enumeration
    if (users.length === 0) {
      console.log(`[Forgot Password] User not found: ${sanitizedEmail} (preventing enumeration)`);
      return NextResponse.json({
        success: true,
        message: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña',
      });
    }

    const user = users[0] as any;

    // Create password reset token
    const token = await createPasswordResetToken(user.id);

    // In production, send email with reset link
    // For now, log the token (replace with actual email sending in production)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    console.log(`\n📧 [FORGOT PASSWORD] Password reset request for: ${user.email}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);
    console.log(`⏰ Token expires in 1 hour\n`);

    // TODO: In production, send email using a service like:
    // - Resend (resend.com)
    // - SendGrid
    // - AWS SES
    // - Postmark
    // Example:
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Restablece tu contraseña de NutriFlow',
    //   html: renderPasswordResetEmail({ userName: user.name, resetUrl }),
    // });

    return NextResponse.json({
      success: true,
      message: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
