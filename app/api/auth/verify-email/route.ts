/**
 * GET /api/auth/verify-email?token=xxx
 * Verify email address using token
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailToken } from '@/lib/auth-tokens';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token de verificación es requerido' },
        { status: 400 }
      );
    }

    const result = await verifyEmailToken(token);

    if (!result.success) {
      // Redirect to error page
      const errorUrl = new URL('/verify-email-error', request.url);
      errorUrl.searchParams.set('error', result.error || 'unknown');
      return NextResponse.redirect(errorUrl);
    }

    // Redirect to success page
    const successUrl = new URL('/verify-email-success', request.url);
    return NextResponse.redirect(successUrl);
  } catch (error: any) {
    console.error('Email verification error:', error);
    const errorUrl = new URL('/verify-email-error', request.url);
    errorUrl.searchParams.set('error', 'server_error');
    return NextResponse.redirect(errorUrl);
  }
}
