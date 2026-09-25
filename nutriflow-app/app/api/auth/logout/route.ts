import { NextRequest, NextResponse } from 'next/server';
import { deleteSessionCookie } from '@/lib/auth-mysql';

export async function POST(request: NextRequest) {
  try {
    await deleteSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
