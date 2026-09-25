import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { avatarType, avatarUrl } = body;

    if (!avatarType) {
      return NextResponse.json({ error: 'avatarType is required' }, { status: 400 });
    }

    if (avatarType === 'custom' && !avatarUrl) {
      return NextResponse.json({ error: 'avatarUrl is required for custom avatars' }, { status: 400 });
    }

    await query(
      'UPDATE users SET avatar_type = ?, avatar_url = ? WHERE id = ?',
      [avatarType, avatarType === 'initials' ? null : avatarUrl, user._id]
    );

    return NextResponse.json({ success: true, avatarType, avatarUrl });
  } catch (error: any) {
    console.error('Avatar update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      'SELECT avatar_url, avatar_type FROM users WHERE id = ?',
      [user._id]
    );

    const rows = Array.isArray(result) ? result[0] : result;
    const row = Array.isArray(rows) ? rows[0] : rows;

    return NextResponse.json({
      avatarUrl: row?.avatar_url || null,
      avatarType: row?.avatar_type || 'initials',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
