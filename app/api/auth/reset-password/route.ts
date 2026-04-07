/**
 * POST /api/auth/reset-password
 * Reset password using token
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import bcrypt from 'bcryptjs';
import { verifyPasswordResetToken, usePasswordResetToken } from '@/lib/auth-tokens';
import { isStrongPassword } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, confirmPassword } = body;

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Token, contraseña y confirmación son requeridos' },
        { status: 400 }
      );
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Las contraseñas no coinciden' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = isStrongPassword(password, { minLength: 8 });
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Contraseña débil: ' + passwordValidation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Verify the reset token
    const tokenVerification = await verifyPasswordResetToken(token);
    if (!tokenVerification.success || !tokenVerification.userId) {
      return NextResponse.json(
        { error: tokenVerification.error || 'Token inválido' },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user password
    await query(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
      [passwordHash, tokenVerification.userId]
    );

    // Mark token as used
    await usePasswordResetToken(token);

    console.log(`[Reset Password] Password successfully reset for user: ${tokenVerification.userId}`);

    return NextResponse.json({
      success: true,
      message: 'Contraseña restablecida exitosamente',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Error al restablecer la contraseña' },
      { status: 500 }
    );
  }
}
